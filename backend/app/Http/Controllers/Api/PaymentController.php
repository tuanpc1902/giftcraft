<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Jobs\SendOrderStatusUpdate;
use App\Models\Order;
use App\Services\Payment\MoMoService;
use App\Services\Payment\VNPayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    use ApiResponse;

    public function __construct(
        private readonly VNPayService $vnpay,
        private readonly MoMoService $momo,
    ) {
    }

    // --- VNPay ---

    public function vnpayCallback(Request $request)
    {
        $params = $request->query();
        $valid = $this->vnpay->verifySignature($params) && $this->vnpay->isSuccessful($params);

        if ($valid) {
            $this->markPaid($params['vnp_TxnRef'] ?? '');
        }

        // Redirect the browser back to the frontend order page.
        $orderNumber = $params['vnp_TxnRef'] ?? '';
        $status = $valid ? 'success' : 'failed';

        return redirect()->away(
            config('app.frontend_url') . "/don-hang/{$orderNumber}?payment={$status}"
        );
    }

    public function vnpayIpn(Request $request): JsonResponse
    {
        $params = $request->all();

        if (! $this->vnpay->verifySignature($params)) {
            return response()->json(['RspCode' => '97', 'Message' => 'Invalid signature']);
        }

        if ($this->vnpay->isSuccessful($params)) {
            $this->markPaid($params['vnp_TxnRef'] ?? '');
        }

        return response()->json(['RspCode' => '00', 'Message' => 'Confirm Success']);
    }

    // --- MoMo ---

    public function momoCallback(Request $request)
    {
        $params = $request->query();
        $valid = $this->momo->verifySignature($params) && $this->momo->isSuccessful($params);

        if ($valid) {
            $this->markPaid($params['orderId'] ?? '');
        }

        $orderNumber = $params['orderId'] ?? '';
        $status = $valid ? 'success' : 'failed';

        return redirect()->away(
            config('app.frontend_url') . "/don-hang/{$orderNumber}?payment={$status}"
        );
    }

    public function momoIpn(Request $request): JsonResponse
    {
        $params = $request->all();

        if ($this->momo->verifySignature($params) && $this->momo->isSuccessful($params)) {
            $this->markPaid($params['orderId'] ?? '');
        }

        return response()->json(['status' => 'received']);
    }

    /**
     * Idempotently mark an order as paid + confirmed.
     */
    private function markPaid(string $orderNumber): void
    {
        if ($orderNumber === '') {
            return;
        }

        DB::transaction(function () use ($orderNumber) {
            $order = Order::where('order_number', $orderNumber)->lockForUpdate()->first();

            if (! $order || $order->payment_status === 'paid') {
                return; // idempotent: already processed
            }

            $order->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
                'status' => 'confirmed',
            ]);

            SendOrderStatusUpdate::dispatch($order->id, 'confirmed');
        });
    }
}

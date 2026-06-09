<?php

namespace App\Services\Payment;

use App\Models\Order;
use Illuminate\Http\Request;

class VNPayService
{
    private string $tmnCode;
    private string $hashSecret;
    private string $url;
    private string $returnUrl;

    public function __construct()
    {
        $this->tmnCode = (string) env('VNPAY_TMN_CODE');
        $this->hashSecret = (string) env('VNPAY_HASH_SECRET');
        $this->url = (string) env('VNPAY_URL');
        $this->returnUrl = (string) env('VNPAY_RETURN_URL');
    }

    /**
     * Build a signed VNPay payment URL for an order.
     */
    public function createPaymentUrl(Order $order, string $ip = '127.0.0.1'): string
    {
        $data = [
            'vnp_Version' => '2.1.0',
            'vnp_Command' => 'pay',
            'vnp_TmnCode' => $this->tmnCode,
            'vnp_Amount' => (int) $order->total * 100, // VNPay uses amount * 100
            'vnp_CurrCode' => 'VND',
            'vnp_TxnRef' => $order->order_number,
            'vnp_OrderInfo' => 'Thanh toan don hang ' . $order->order_number,
            'vnp_OrderType' => 'other',
            'vnp_Locale' => 'vn',
            'vnp_ReturnUrl' => $this->returnUrl,
            'vnp_IpAddr' => $ip,
            'vnp_CreateDate' => now()->format('YmdHis'),
        ];

        ksort($data);
        $hashData = $this->buildQuery($data);
        $secureHash = hash_hmac('sha512', $hashData, $this->hashSecret);

        return $this->url . '?' . $hashData . '&vnp_SecureHash=' . $secureHash;
    }

    /**
     * Verify the signature on a VNPay callback/IPN.
     */
    public function verifySignature(array $params): bool
    {
        $received = $params['vnp_SecureHash'] ?? '';
        unset($params['vnp_SecureHash'], $params['vnp_SecureHashType']);

        ksort($params);
        $hashData = $this->buildQuery($params);
        $expected = hash_hmac('sha512', $hashData, $this->hashSecret);

        return hash_equals($expected, $received);
    }

    /**
     * Determine if a verified callback indicates success.
     */
    public function isSuccessful(array $params): bool
    {
        return ($params['vnp_ResponseCode'] ?? null) === '00'
            && ($params['vnp_TransactionStatus'] ?? null) === '00';
    }

    private function buildQuery(array $data): string
    {
        return collect($data)
            ->map(fn ($value, $key) => urlencode((string) $key) . '=' . urlencode((string) $value))
            ->implode('&');
    }
}

<?php

namespace App\Services\Payment;

use App\Models\Order;
use Illuminate\Support\Facades\Http;

class MoMoService
{
    private string $partnerCode;
    private string $accessKey;
    private string $secretKey;
    private string $endpoint;
    private string $returnUrl;
    private string $ipnUrl;

    public function __construct()
    {
        $this->partnerCode = (string) env('MOMO_PARTNER_CODE');
        $this->accessKey = (string) env('MOMO_ACCESS_KEY');
        $this->secretKey = (string) env('MOMO_SECRET_KEY');
        $this->endpoint = (string) env('MOMO_ENDPOINT');
        $this->returnUrl = (string) env('MOMO_RETURN_URL');
        $this->ipnUrl = (string) (env('APP_URL') . '/api/payment/momo/ipn');
    }

    /**
     * Create a MoMo payment and return the redirect URL.
     */
    public function createPaymentUrl(Order $order): string
    {
        $requestId = (string) \Illuminate\Support\Str::uuid();
        $amount = (string) (int) $order->total;
        $orderId = $order->order_number;
        $orderInfo = 'Thanh toan don hang ' . $orderId;
        $requestType = 'captureWallet';
        $extraData = '';

        $rawSignature = "accessKey={$this->accessKey}&amount={$amount}&extraData={$extraData}"
            . "&ipnUrl={$this->ipnUrl}&orderId={$orderId}&orderInfo={$orderInfo}"
            . "&partnerCode={$this->partnerCode}&redirectUrl={$this->returnUrl}"
            . "&requestId={$requestId}&requestType={$requestType}";

        $signature = hash_hmac('sha256', $rawSignature, $this->secretKey);

        $response = Http::timeout(15)->post($this->endpoint, [
            'partnerCode' => $this->partnerCode,
            'accessKey' => $this->accessKey,
            'requestId' => $requestId,
            'amount' => $amount,
            'orderId' => $orderId,
            'orderInfo' => $orderInfo,
            'redirectUrl' => $this->returnUrl,
            'ipnUrl' => $this->ipnUrl,
            'extraData' => $extraData,
            'requestType' => $requestType,
            'signature' => $signature,
            'lang' => 'vi',
        ]);

        return $response->json('payUrl') ?? $this->returnUrl;
    }

    /**
     * Verify the signature on a MoMo IPN/callback.
     */
    public function verifySignature(array $params): bool
    {
        $received = $params['signature'] ?? '';

        $raw = "accessKey={$this->accessKey}"
            . "&amount=" . ($params['amount'] ?? '')
            . "&extraData=" . ($params['extraData'] ?? '')
            . "&message=" . ($params['message'] ?? '')
            . "&orderId=" . ($params['orderId'] ?? '')
            . "&orderInfo=" . ($params['orderInfo'] ?? '')
            . "&orderType=" . ($params['orderType'] ?? '')
            . "&partnerCode=" . ($params['partnerCode'] ?? '')
            . "&payType=" . ($params['payType'] ?? '')
            . "&requestId=" . ($params['requestId'] ?? '')
            . "&responseTime=" . ($params['responseTime'] ?? '')
            . "&resultCode=" . ($params['resultCode'] ?? '')
            . "&transId=" . ($params['transId'] ?? '');

        $expected = hash_hmac('sha256', $raw, $this->secretKey);

        return hash_equals($expected, (string) $received);
    }

    public function isSuccessful(array $params): bool
    {
        return (string) ($params['resultCode'] ?? '') === '0';
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatController extends Controller
{
    private const MODEL = 'claude-opus-4-8';

    private const SYSTEM_PROMPT = <<<'EOT'
Bạn là trợ lý AI thân thiện của GiftCraft Studio — cửa hàng quà tặng cao cấp tại Việt Nam chuyên về quà tặng cá nhân hoá.

**Về GiftCraft Studio:**
- Chuyên sản xuất quà tặng in ấn, khắc tên, thêu logo cho cả cá nhân lẫn doanh nghiệp (B2B)
- Sản phẩm tiêu biểu: cốc sứ, áo thun, hộp quà cao cấp, ví da, túi vải canvas, đồ dùng văn phòng — tất cả có thể in/thêu theo yêu cầu
- Giao hàng toàn quốc qua GHN (tiêu chuẩn 2-3 ngày & hoả tốc trong ngày)
- Thanh toán: VNPay, MoMo, COD

**Tính năng chính:**
- Đặt lẻ cá nhân: chọn sản phẩm → tuỳ chỉnh nội dung in/thêu → thêm giỏ → thanh toán
- B2B (số lượng ≥20): chiết khấu đặc biệt theo số lượng, gửi yêu cầu tại /bat-dau-du-an-moi
- Chương trình tích điểm: hạng Gold (≥5 triệu VNĐ tích lũy), Platinum (≥15 triệu VNĐ)
- Portfolio dự án đã thực hiện tại /forfolio

**Hướng dẫn trả lời:**
- Trả lời bằng ngôn ngữ của khách (tiếng Việt ưu tiên, hoặc tiếng Anh nếu khách hỏi bằng tiếng Anh)
- Ngắn gọn, thân thiện, chuyên nghiệp — tối đa 3–4 câu mỗi lần, trừ khi khách yêu cầu chi tiết
- Nếu hỏi giá cụ thể: hướng dẫn xem trang sản phẩm vì giá phụ thuộc mẫu mã và số lượng
- Nếu cần tư vấn B2B: hướng đến /bat-dau-du-an-moi để gửi yêu cầu báo giá
- Không bịa thông tin; nếu không chắc hãy nói "Tôi không chắc — bạn có thể nhắn trực tiếp qua fanpage hoặc email hello@giftcraft.vn để được tư vấn thêm"
EOT;

    public function stream(Request $request): StreamedResponse
    {
        $request->validate([
            'messages'             => 'required|array|min:1|max:20',
            'messages.*.role'      => 'required|in:user,assistant',
            'messages.*.content'   => 'required|string|max:2000',
        ]);

        // 50 messages per hour per session
        $sessionId = $request->header('X-Session-ID') ?? $request->ip();
        $rateLimitKey = "chat_rate:{$sessionId}";

        $count = (int) Redis::get($rateLimitKey);
        if ($count >= 50) {
            return response()->stream(static function () {
                echo "data: " . json_encode(['error' => 'Rate limit exceeded. Please try again later.']) . "\n\n";
                ob_flush();
                flush();
            }, 429, ['Content-Type' => 'text/event-stream', 'Cache-Control' => 'no-cache']);
        }

        Redis::pipeline(function ($pipe) use ($rateLimitKey) {
            $pipe->incr($rateLimitKey);
            $pipe->expire($rateLimitKey, 3600);
        });

        $messages = array_map(static fn ($m) => [
            'role'    => $m['role'],
            'content' => $m['content'],
        ], $request->messages);

        $payload = json_encode([
            'model'      => self::MODEL,
            'max_tokens' => 1024,
            'stream'     => true,
            'system'     => self::SYSTEM_PROMPT,
            'messages'   => $messages,
        ]);

        $headers = [
            'Content-Type: application/json',
            'x-api-key: ' . config('services.anthropic.key'),
            'anthropic-version: 2023-06-01',
        ];

        return response()->stream(static function () use ($payload, $headers) {
            $ch = curl_init('https://api.anthropic.com/v1/messages');
            curl_setopt_array($ch, [
                CURLOPT_POST          => true,
                CURLOPT_HTTPHEADER    => $headers,
                CURLOPT_POSTFIELDS    => $payload,
                CURLOPT_RETURNTRANSFER => false,
                CURLOPT_WRITEFUNCTION => static function ($ch, $data) {
                    echo $data;
                    ob_flush();
                    flush();

                    return strlen($data);
                },
                CURLOPT_TIMEOUT => 60,
            ]);

            curl_exec($ch);
            curl_close($ch);
        }, 200, [
            'Content-Type'      => 'text/event-stream',
            'Cache-Control'     => 'no-cache',
            'X-Accel-Buffering' => 'no',
        ]);
    }
}

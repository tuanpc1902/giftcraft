<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    private const TOKEN_TTL_MINUTES = 60 * 24 * 7; // 7 days

    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => 'customer',
        ]);

        return $this->success(
            $this->tokenPayload($user),
            'Đăng ký thành công',
            201
        );
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $key = 'login:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);

            return $this->error(
                "Quá nhiều lần thử. Vui lòng đợi {$seconds} giây.",
                [],
                429
            );
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($key, 60); // decay 60s window

            throw ValidationException::withMessages([
                'email' => ['Thông tin đăng nhập không chính xác.'],
            ]);
        }

        RateLimiter::clear($key);

        $this->mergeGuestCart($request, $user);

        return $this->success($this->tokenPayload($user), 'Đăng nhập thành công');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->success(null, 'Đã đăng xuất');
    }

    public function me(Request $request): JsonResponse
    {
        return $this->success(new UserResource($request->user()));
    }

    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return $this->success($this->tokenPayload($user), 'Token đã được làm mới');
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);

        $status = Password::sendResetLink($request->only('email'));

        // Always return success to avoid user enumeration.
        return $this->success(null, 'Nếu email tồn tại, liên kết đặt lại đã được gửi.');
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required'],
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill(['password' => Hash::make($password)])->save();
            }
        );

        if ($status !== Password::PasswordReset) {
            return $this->error('Không thể đặt lại mật khẩu.', ['email' => [__($status)]], 422);
        }

        return $this->success(null, 'Đặt lại mật khẩu thành công');
    }

    /**
     * Merge a guest cart (X-Session-ID) into the user's cart on login.
     */
    private function mergeGuestCart(Request $request, User $user): void
    {
        $sessionId = $request->header('X-Session-ID');
        if (! $sessionId) {
            return;
        }

        app(\App\Services\CartService::class)->merge(
            "cart:guest:{$sessionId}",
            "cart:user:{$user->id}"
        );
    }

    /**
     * Build a fresh token + user payload.
     */
    private function tokenPayload(User $user): array
    {
        $token = $user->createToken('api', ['*'], now()->addMinutes(self::TOKEN_TTL_MINUTES));

        return [
            'user' => new UserResource($user),
            'token' => $token->plainTextToken,
            'expires_at' => now()->addMinutes(self::TOKEN_TTL_MINUTES)->toIso8601String(),
        ];
    }
}

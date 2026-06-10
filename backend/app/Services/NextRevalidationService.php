<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NextRevalidationService
{
    private string $url;
    private string $secret;

    public function __construct()
    {
        $this->url    = rtrim(config('app.nextjs_internal_url', 'http://nextjs:3000'), '/') . '/api/revalidate';
        $this->secret = config('app.revalidation_secret', '');
    }

    public function revalidate(string $tag): void
    {
        if (! $this->secret) {
            return;
        }

        try {
            Http::timeout(2)->post($this->url, [
                'tag'    => $tag,
                'secret' => $this->secret,
            ]);
        } catch (\Throwable $e) {
            Log::debug("ISR revalidation failed for tag [{$tag}]: " . $e->getMessage());
        }
    }

    public function revalidateProducts(?string $slug = null): void
    {
        $this->revalidate('products');
        if ($slug) {
            $this->revalidate("product-{$slug}");
        }
    }

    public function revalidatePortfolio(): void
    {
        $this->revalidate('portfolio');
    }

    public function revalidateBlog(?string $slug = null): void
    {
        $this->revalidate('blog');
        if ($slug) {
            $this->revalidate("blog-{$slug}");
        }
    }
}

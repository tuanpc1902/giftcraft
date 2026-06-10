Add a new API endpoint to the GiftCraft Laravel backend.

## Arguments
$ARGUMENTS — describe the feature: resource name, HTTP methods needed, auth requirements, business logic.

## What to do

Read `backend/CLAUDE.md` for all conventions before writing any code.

### Step 1 — Create the Controller

File: `backend/app/Http/Controllers/Api/<FeatureName>Controller.php`
For admin-only: `backend/app/Http/Controllers/Api/Admin/<FeatureName>Controller.php`

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\MyModel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MyController extends Controller
{
    use ApiResponse;

    public function index(Request $request): JsonResponse
    {
        $items = MyModel::query()
            ->when($request->filled('status'), fn($q) => $q->where('status', $request->status))
            ->latest()
            ->paginate($request->integer('per_page', 20));

        return $this->success([
            'items' => $items->items(),   // or MyResource::collection(...)
            'meta' => [
                'current_page' => $items->currentPage(),
                'last_page'    => $items->lastPage(),
                'total'        => $items->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $model = MyModel::create($validated);

        return $this->success($model, 'Tạo thành công', 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $model = MyModel::findOrFail($id);
        $model->update($request->validate(['status' => 'required|string']));
        return $this->success($model, 'Cập nhật thành công');
    }

    public function destroy(int $id): JsonResponse
    {
        MyModel::findOrFail($id)->delete();
        return $this->success(null, 'Đã xóa');
    }
}
```

### Step 2 — Register the route

Open `backend/routes/api.php` and add the route in the correct group:

```php
// Public:
Route::get('/my-resource', [MyController::class, 'index']);

// Auth-required:
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-resource', [MyController::class, 'index']);
    Route::put('/my-resource/{id}', [MyController::class, 'update'])->whereNumber('id');
});

// Admin-only:
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/my-resource', [MyController::class, 'index']);
    Route::post('/my-resource', [MyController::class, 'store']);
    Route::put('/my-resource/{id}', [MyController::class, 'update'])->whereNumber('id');
    Route::delete('/my-resource/{id}', [MyController::class, 'destroy'])->whereNumber('id');
});
```

### Step 3 — Create/update the Model (if new)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyModel extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'status', 'user_id'];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];
}
```

### Step 4 — Create the migration (if new table)

```bash
docker compose -f infra/docker-compose.yml -p giftcraft exec -T laravel \
  php artisan make:migration create_my_table_table
```

### Step 5 — PHP 8.4 gotchas to avoid

- Queue `$queue` property → use `$this->onQueue('emails')` in constructor
- Redis prefix → `Redis::connection()->executeRaw([...])`
- Spatie activity log: `LogOptions` is `Spatie\Activitylog\LogOptions`
- Always type-hint nullable as `?string $value = null` not `string $value = null`

### Step 6 — Checklist

- [ ] Controller uses `ApiResponse` trait
- [ ] All responses return `{ success, data, message }` envelope
- [ ] Routes added to `api.php` in correct auth group
- [ ] Validation uses Form Request or inline `$request->validate()`
- [ ] `whereNumber('id')` constraint on numeric route params
- [ ] New endpoint documented in `backend/CLAUDE.md` endpoint list
- [ ] If frontend will call it, update `api.ts` usage docs and PROGRESS.md

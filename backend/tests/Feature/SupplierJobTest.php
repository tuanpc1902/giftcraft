<?php

namespace Tests\Feature;

use App\Models\JobApplication;
use App\Models\SupplierApplication;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SupplierJobTest extends TestCase
{
    use RefreshDatabase;

    // ─── Supplier Applications ──────────────────────────────────────────────

    /** POST /api/supplier/apply */
    public function test_can_submit_supplier_application(): void
    {
        $response = $this->postJson('/api/supplier/apply', [
            'company_name'    => 'Công ty TNHH Gỗ Việt',
            'tax_code'        => '0123456789',
            'contact_name'    => 'Nguyễn Văn A',
            'phone'           => '0901234567',
            'email'           => 'contact@goviet.vn',
            'product_types'   => 'Đồ thủ công mỹ nghệ, gỗ trang trí, quà tặng cao cấp',
            'has_vat_invoice' => true,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('supplier_applications', [
            'company_name' => 'Công ty TNHH Gỗ Việt',
            'tax_code'     => '0123456789',
            'status'       => 'new',
        ]);
    }

    public function test_supplier_application_requires_mandatory_fields(): void
    {
        $this->postJson('/api/supplier/apply', [
            'company_name' => 'Thiếu thông tin',
        ])->assertUnprocessable();
    }

    public function test_supplier_application_accepts_optional_fields(): void
    {
        $response = $this->postJson('/api/supplier/apply', [
            'company_name'       => 'Gốm Sứ Bát Tràng',
            'tax_code'           => '9876543210',
            'contact_name'       => 'Trần Thị B',
            'phone'              => '0912345678',
            'email'              => 'info@battrang.vn',
            'product_types'      => 'Gốm sứ, đồ trang trí, quà lưu niệm',
            'has_vat_invoice'    => false,
            'min_order_quantity' => 50,
            'description'        => 'Chuyên sản xuất gốm sứ thủ công truyền thống tại Bát Tràng.',
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('supplier_applications', [
            'min_order_quantity' => 50,
            'has_vat_invoice'    => false,
        ]);
    }

    /** Admin: GET /api/admin/supplier-applications */
    public function test_admin_can_list_supplier_applications(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SupplierApplication::create([
            'company_name'  => 'Công ty A',
            'tax_code'      => '1111111111',
            'contact_name'  => 'NV A',
            'phone'         => '0900000001',
            'email'         => 'a@company.vn',
            'product_types' => 'Sản phẩm A',
            'status'        => 'new',
        ]);

        SupplierApplication::create([
            'company_name'  => 'Công ty B',
            'tax_code'      => '2222222222',
            'contact_name'  => 'NV B',
            'phone'         => '0900000002',
            'email'         => 'b@company.vn',
            'product_types' => 'Sản phẩm B',
            'status'        => 'reviewing',
        ]);

        $this->actingAs($admin)->getJson('/api/admin/supplier-applications')
            ->assertOk()
            ->assertJsonCount(2, 'data.items');
    }

    public function test_admin_can_filter_supplier_applications_by_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        SupplierApplication::create([
            'company_name'  => 'Đơn mới',
            'tax_code'      => '3333333333',
            'contact_name'  => 'NV C',
            'phone'         => '0900000003',
            'email'         => 'c@company.vn',
            'product_types' => 'Loại C',
            'status'        => 'new',
        ]);

        SupplierApplication::create([
            'company_name'  => 'Đơn đã duyệt',
            'tax_code'      => '4444444444',
            'contact_name'  => 'NV D',
            'phone'         => '0900000004',
            'email'         => 'd@company.vn',
            'product_types' => 'Loại D',
            'status'        => 'approved',
        ]);

        $this->actingAs($admin)->getJson('/api/admin/supplier-applications?status=new')
            ->assertOk()
            ->assertJsonCount(1, 'data.items');
    }

    /** Admin: PUT /api/admin/supplier-applications/{id} */
    public function test_admin_can_update_supplier_status(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $app = SupplierApplication::create([
            'company_name'  => 'Đơn cần cập nhật',
            'tax_code'      => '5555555555',
            'contact_name'  => 'NV E',
            'phone'         => '0900000005',
            'email'         => 'e@company.vn',
            'product_types' => 'Loại E',
            'status'        => 'new',
        ]);

        $this->actingAs($admin)->putJson("/api/admin/supplier-applications/{$app->id}", [
            'status' => 'approved',
        ])->assertOk();

        $this->assertDatabaseHas('supplier_applications', ['id' => $app->id, 'status' => 'approved']);
    }

    public function test_non_admin_cannot_access_supplier_admin_endpoints(): void
    {
        $user = User::factory()->create(['role' => 'customer']);

        $this->actingAs($user)->getJson('/api/admin/supplier-applications')
            ->assertForbidden();
    }

    // ─── Job Applications ───────────────────────────────────────────────────

    /** POST /api/jobs/apply */
    public function test_can_submit_job_application(): void
    {
        $response = $this->postJson('/api/jobs/apply', [
            'job_title'      => 'Designer Cao Cấp',
            'applicant_name' => 'Lê Thị F',
            'phone'          => '0923456789',
            'email'          => 'lethif@email.com',
            'cv_url'         => 'https://drive.google.com/file/d/abc123',
            'cover_letter'   => 'Tôi có 5 năm kinh nghiệm thiết kế bao bì sản phẩm cao cấp.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('job_applications', [
            'job_title'      => 'Designer Cao Cấp',
            'applicant_name' => 'Lê Thị F',
            'status'         => 'new',
        ]);
    }

    public function test_job_application_requires_valid_cv_url(): void
    {
        $this->postJson('/api/jobs/apply', [
            'job_title'      => 'Nhân viên kinh doanh',
            'applicant_name' => 'Phạm G',
            'phone'          => '0934567890',
            'email'          => 'phamg@email.com',
            'cv_url'         => 'khong-phai-url',
        ])->assertUnprocessable();
    }

    public function test_cover_letter_is_optional(): void
    {
        $response = $this->postJson('/api/jobs/apply', [
            'job_title'      => 'Kế toán',
            'applicant_name' => 'Hoàng H',
            'phone'          => '0945678901',
            'email'          => 'hoangh@email.com',
            'cv_url'         => 'https://drive.google.com/file/d/xyz789',
        ]);

        $response->assertStatus(201);
    }

    /** Admin: GET /api/admin/job-applications */
    public function test_admin_can_list_job_applications(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        JobApplication::create([
            'job_title' => 'Designer', 'applicant_name' => 'UV 1', 'phone' => '0900000001',
            'email' => 'uv1@email.com', 'cv_url' => 'https://example.com/cv1', 'status' => 'new',
        ]);

        JobApplication::create([
            'job_title' => 'Sales', 'applicant_name' => 'UV 2', 'phone' => '0900000002',
            'email' => 'uv2@email.com', 'cv_url' => 'https://example.com/cv2', 'status' => 'reviewing',
        ]);

        $this->actingAs($admin)->getJson('/api/admin/job-applications')
            ->assertOk()
            ->assertJsonCount(2, 'data.items');
    }

    /** Admin: PUT /api/admin/job-applications/{id} */
    public function test_admin_can_advance_application_to_interviewed(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $app = JobApplication::create([
            'job_title' => 'Marketing', 'applicant_name' => 'UV 3',
            'phone' => '0900000003', 'email' => 'uv3@email.com',
            'cv_url' => 'https://example.com/cv3', 'status' => 'reviewing',
        ]);

        $this->actingAs($admin)->putJson("/api/admin/job-applications/{$app->id}", [
            'status' => 'interviewed',
        ])->assertOk();

        $this->assertDatabaseHas('job_applications', ['id' => $app->id, 'status' => 'interviewed']);
    }
}

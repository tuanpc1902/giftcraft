<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // PostgreSQL does not support altering enum values natively.
        // Convert to VARCHAR, then add a check constraint with the new status set.
        DB::statement("ALTER TABLE b2b_quotes ALTER COLUMN status TYPE VARCHAR(50)");
        DB::statement("ALTER TABLE b2b_quotes DROP CONSTRAINT IF EXISTS b2b_quotes_status_check");
        DB::statement("ALTER TABLE b2b_quotes ADD CONSTRAINT b2b_quotes_status_check
            CHECK (status IN ('new','reviewing','quoted','approved','in_production','delivered','cancelled'))");

        // Migrate legacy status values to new ones
        DB::statement("UPDATE b2b_quotes SET status = 'reviewing'  WHERE status = 'contacted'");
        DB::statement("UPDATE b2b_quotes SET status = 'delivered'  WHERE status = 'won'");
        DB::statement("UPDATE b2b_quotes SET status = 'cancelled'  WHERE status = 'lost'");

        // Add customer-visible admin note (separate from internal sales_notes)
        Schema::table('b2b_quotes', function (Blueprint $table) {
            $table->text('admin_note')->nullable()->after('sales_notes');
        });
    }

    public function down(): void
    {
        Schema::table('b2b_quotes', function (Blueprint $table) {
            $table->dropColumn('admin_note');
        });

        DB::statement("UPDATE b2b_quotes SET status = 'new' WHERE status NOT IN ('new','contacted','quoted','won','lost')");
        DB::statement("ALTER TABLE b2b_quotes ALTER COLUMN status TYPE VARCHAR(50)");
        DB::statement("ALTER TABLE b2b_quotes DROP CONSTRAINT IF EXISTS b2b_quotes_status_check");
        DB::statement("ALTER TABLE b2b_quotes ADD CONSTRAINT b2b_quotes_status_check
            CHECK (status IN ('new','contacted','quoted','won','lost'))");
    }
};

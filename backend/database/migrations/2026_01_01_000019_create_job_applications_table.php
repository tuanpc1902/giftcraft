<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->string('job_title');
            $table->string('applicant_name');
            $table->string('phone');
            $table->string('email');
            $table->string('cv_url');
            $table->text('cover_letter')->nullable();
            $table->enum('status', ['new', 'reviewing', 'interviewed', 'hired', 'rejected'])->default('new');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};

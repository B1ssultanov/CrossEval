<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('supervisor', function (Blueprint $table) {
            $table->id();
            $table->integer('supervisor_id')->unique();
            $table->string('name');
            $table->string('surname');
            $table->string('email')->unique();
            $table->string('phone_number')->nullable();
            $table->string('login');
            $table->string('password');
            $table->enum('gender',['male','female','other'])->nullable();
            $table->date('birthday')->nullable();
            $table->string('faculty');
            $table->string('education_grade');
            $table->enum('status',['active','inactive', 'ban'])->default('inactive');
            $table->text('token');
            $table->text('image')->nullable();
            $table->date('date_of_hiring')->nullable();
            $table->string('city_id');
            $table->string('country_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supervisor');
    }
};

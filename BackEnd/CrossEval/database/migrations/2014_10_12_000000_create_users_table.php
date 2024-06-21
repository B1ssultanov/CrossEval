<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->integer('university_id');
            $table->string('name');
            $table->string('surname');
            $table->string('email')->unique();
            $table->string('phone_number')->nullable();
            $table->string('login');
            $table->string('password');
            $table->enum('gender',['male','female','other'])->nullable();
            $table->string('course_grade');
            $table->string('faculty');
            $table->string('speciality');
            $table->enum('status',['active','inactive', 'ban'])->default('inactive');
            $table->text('token');
            $table->text('image')->nullable();
            $table->date('birthday')->nullable();
            $table->date('end_date')->nullable();
            $table->string('city_id');
            $table->string('country_id');
            $table->enum('academic_degree',['Bachelor','Master','Doctorate'])->nullable();
            $table->enum('role', ['student','supervisor']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};

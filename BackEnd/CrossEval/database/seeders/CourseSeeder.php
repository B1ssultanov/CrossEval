<?php

namespace Database\Seeders;

use App\Models\Course;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $course = new Course;

        $course->code = 'MDE' . rand(100, 400);
        $course->name = Str::random(15);
        $course->course_group = '0' . rand(1,9) . '-N';
        $course->invite_code = Str::random(6);

        $course->save();
    }
}

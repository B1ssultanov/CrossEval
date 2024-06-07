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

        $course->course_id = 'MDE' . rand(100, 400);
        $course->course_name = Str::random(15);
        $course->course_group = '0' . rand(1,9) . '-N';

        $course->save();
    }
}

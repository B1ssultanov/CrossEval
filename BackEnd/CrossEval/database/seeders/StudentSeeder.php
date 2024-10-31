<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class StudentSeeder extends Seeder
{
    public $name = [
        'Yedyge',
        'Igor',
        'Valodiya',
        'Gennadiy',
        'Zhanbolat',
        'Ivan',
        'Anton'
    ];

    public $surname = [
        'Bissultanov',
        'Igorev',
        'Valodiev',
        'Gennadiev',
        'Mukan',
        'Ivanov',
        'Antonov'
    ];

    public $gender = [
        'male',
        'female'
    ];

    public $faculty = [
        'Engineer',
        'Law',
        'Information Technology',
        'Economics',
        'Business School',
        'Arts',
        'Philosophy'
    ];

    public $speciality = [
        'Computer Science',
        'Computer Engineering',
        'Marketing',
        'Cybersecurity',
    ];

    public $status = [
        'active',
        'ban',
        'inactive'
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $student = new User;

        $student->university_id = rand(210000000,210999999);
        $student->name = $this->name[rand(0,6)];
        $student->surname = $this->surname[rand(0,6)];
        $student->email = Str::random('10') . '@mail.ru';
        $student->phone_number = rand(80000000000,89999999999);
        $student->login = Str::random(10);
        $student->password = Hash::make('12345678');
        $student->gender = $this->gender[rand(0,1)];
        $student->course_grade = rand(1,4);
        $student->faculty = $this->faculty[rand(0,6)];
        $student->academic_degree = 'Bachelor';
        $student->speciality = $this->speciality[rand(0,3)];
        $student->status = $this->status[rand(0,2)];
        $student->token = Str::random(40);
        $student->birthday = '2004-08-09';
        $student->city_id = 1;
        $student->country_id = 1;

        $student->save();
    }
}

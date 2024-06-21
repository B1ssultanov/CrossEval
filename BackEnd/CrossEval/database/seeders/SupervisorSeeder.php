<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SupervisorSeeder extends Seeder
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

    public $education_grade = [
        'Master',
        'Doctor'
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $supervisor = new User;

        $supervisor->supervisor_id = rand(210000000, 210999999);
        $supervisor->name = $this->name[rand(0, 6)];
        $supervisor->surname = $this->surname[rand(0, 6)];
        $supervisor->email = Str::random('10') . '@mail.ru';
        $supervisor->phone_number = rand(80000000000, 89999999999);
        $supervisor->login = Str::random(10);
        $supervisor->password = Hash::make('12345678');
        $supervisor->gender = $this->gender[rand(0, 1)];
        $supervisor->education_grade = $this->education_grade[rand(0,1)];
        $supervisor->faculty = $this->faculty[rand(0, 6)];
        $supervisor->status = $this->status[rand(0, 2)];
        $supervisor->token = Str::random(40);
        $supervisor->birthday = '1999-07-11';
        $supervisor->city_id = 1;
        $supervisor->country_id = 1;

        $supervisor->save();
    }
}

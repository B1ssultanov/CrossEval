<?php

namespace Database\Seeders;

use App\Models\City;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    public $cities = [
        'Almaty',
        'Aktobe',
        'Kyzylorda',
        'Aktau',
        'Cairo',
        'Alexandria'
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 6; $i++) {
            $city = new City;
            $city->city_name = $this->cities[$i];
            $city->save();
        }
    }
}

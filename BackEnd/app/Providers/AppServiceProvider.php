<?php

namespace App\Providers;

use Illuminate\Support\Facades\Validator;
use App\Rules\ActiveEventRule;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Validator::extend('active_event', ActiveEventRule::class);
    }
}

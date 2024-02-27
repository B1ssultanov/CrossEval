<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->namespace('App\Http\Controllers\Api')->group(function () {
    Route::get('page/main_page', 'PageController@mainPage');

    Route::get('user/interest',      'UserController@interest');
    Route::get('user/sm/auth',       'UserController@socailMediaAuthentication');
    Route::post('user/register',     'UserController@registration');
    Route::post('user/auth',         'UserController@authentication');
    Route::post('user/verification', 'UserController@verificationCode');
    Route::post('user/password',     'UserController@setPassword');

    Route::middleware(['App\Http\Middleware\AuthCheck'])->group( function () {
        // USER
            Route::delete('user',      'UserController@deleteUser');
            Route::post('user',        'UserController@update');
            Route::get('user_profile', 'UserController@getUserProfile');
            Route::get('/user',        'UserController@getUserData');
        // #END# USER
    });
});

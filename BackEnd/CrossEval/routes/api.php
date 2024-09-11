<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('v1')->namespace('App\Http\Controllers\Api')->group(function () {
    Route::middleware('web')->group(function () {
        Route::post('register', [RegisteredUserController::class, 'store']);

        Route::post('login', [AuthenticatedSessionController::class, 'store']);
    });

    Route::middleware('auth')->group(function () {
        Route::get('/main', 'CourseController@mainInfo');

        Route::get('/course',    'CourseController@detail');
        Route::post('/course',   'CourseController@create');
        Route::post('/syllabus', 'CourseController@syllabus');

        Route::get('/schedule', 'AssignmentController@schedule');

        Route::post('/assignment',     'AssignmentController@create');
        Route::get('/assignment/{id}', 'AssignmentController@get');

        Route::post('/answer', 'AnswerController@store');

        Route::get('/user/student/grades',    'UserController@student_grades');
        Route::get('/user/supervisor/grades', 'UserController@supervisor_grades');
    });
});

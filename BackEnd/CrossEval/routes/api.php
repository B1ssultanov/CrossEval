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

        Route::post('test', [\App\Http\Controllers\HomeController::class, 'test']);
    });

    Route::middleware('auth')->group(function () {
        Route::get('/main', 'CourseController@mainInfo');

        Route::get('/course',         'CourseController@detail');
        Route::post('/course',        'CourseController@create');
        Route::post('/course/invite', 'CourseController@invite');

        Route::post('/syllabus', 'CourseController@syllabus');

        Route::get('/schedule', 'AssignmentController@schedule');

        Route::post('/assignment',        'AssignmentController@create');
        Route::post('/assignment/missed', 'AssignmentController@missed_assignment');
        Route::get('/assignment/{id}',    'AssignmentController@get');

        Route::post('answer_review/groups/create', 'AnswerReviewController@cross_check_grouping');
        Route::post('answer_review/review/submit', 'AnswerReviewController@review_submit');

        Route::post('/answer',       'AnswerController@store');
        Route::get('/grades/export', 'AnswerController@export');

        Route::get('/cross_review/check',              'CrossCheckController@allAnswers');
        Route::get('/cross_review/{answer_review_id}', 'CrossCheckController@getReview');

        Route::get('/user/student/grades',    'UserController@student_grades');
        Route::get('/user/supervisor/grades', 'UserController@supervisor_grades');
        Route::get('/user',                   'UserController@info');
        Route::post('/user/profile',          'UserController@profile_update');
        Route::delete('/user',                'UserController@delete');
        Route::delete('/user/course',         'UserController@remove_from_course');
    });
});

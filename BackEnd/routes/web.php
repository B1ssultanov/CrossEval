<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\EventCategoryController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\OrganizationController;
use App\Http\Controllers\Admin\SearchCategoryController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\AppleAppSiteAssociationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [AdminController::class, 'mainPage']);

//Route::get('/admin/', [AdminController::class, 'index'])->name('welcome.page');


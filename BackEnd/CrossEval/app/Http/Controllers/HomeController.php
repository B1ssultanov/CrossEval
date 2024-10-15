<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\AnswerReview;
use App\Models\Assignment;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index(): \Illuminate\Contracts\Support\Renderable
    {
        return view('home');
    }

    /**
     * Controller for tests on project
     */
    public function test(): string
    {
        return "test API";
    }
}

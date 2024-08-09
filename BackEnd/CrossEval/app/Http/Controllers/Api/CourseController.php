<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CourseSummaryResource;
use App\Models\Course;
use App\Models\UserCourse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function mainInfo(Request $request): JsonResponse
    {
        $user = User::where('token', $request->bearerToken())->first();

        $course_list = UserCourse::where('user_id', $user->id)->pluck('course_id')->toArray();
        $courses     = Course::whereIn('id', $course_list)->get();

        return response()->json([
            'courses' => CourseSummaryResource::collection($courses),
            'user'    => $user,
        ], 200 );
    }
}

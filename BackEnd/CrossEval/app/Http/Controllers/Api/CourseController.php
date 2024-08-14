<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssignmentSummaryResource;
use App\Http\Resources\CourseSummaryResource;
use App\Models\Assignment;
use App\Models\Course;
use App\Models\UserCourse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    public function detail(Request $request): JsonResponse
    {
        $user        = User::where('token', $request->bearerToken())->first();
        $course      = Course::where('id', $request->id)->first();
        $assignments = Assignment::where('course_id', $course->id)->get();

        return response()->json([
            'course'      => new CourseSummaryResource($course),
            'assignments' => AssignmentSummaryResource::collection($assignments),
        ], 200 );
    }
}

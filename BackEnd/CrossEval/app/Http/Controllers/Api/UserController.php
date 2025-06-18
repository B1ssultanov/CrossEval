<?php

namespace app\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Grades\StudentResource;
use App\Http\Resources\Grades\SupervisorResource;
use App\Models\Answer;
use App\Models\Assignment;
use App\Models\Course;
use app\Models\User;
use App\Models\UserCourse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * This API shows every grade for every assignment of the student
     *
     * @param Request       $request
     * @return JsonResponse
     */
    public function student_grades(Request $request): \Illuminate\Http\JsonResponse
    {
        $limit  = $request->limit ?? 10;
        $page   = $request->page ?? 1;
        $offset = ($page - 1) * $limit;

        $user    = User::where('token', $request->bearerToken())->first();
        $answers = DB::table('answers as an')
            ->join('assignments as a', 'a.id', '=', 'an.assignment_id')
            ->where('a.course_id', '=', $request->course_id)
            ->where('an.user_id', '=', $user->id)
            ->select('a.*', 'an.*')
            ->get();

        $nbTotal   = $answers->count();
        $totalPage = ceil($nbTotal / $limit);
        $answers   = $answers->skip($offset)->take($limit);


        return response()->json([
            'grades'    => StudentResource::collection($answers),
            'page'      => $page,
            'totalPage' => $totalPage,
            'nbTotal'   => $nbTotal,
        ], 200);
    }

    /**
     * This method gives data that will show the information about all grades of supervisor students
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function supervisor_grades(Request $request): JsonResponse
    {
        $limit  = $request->limit ?? 10;
        $page   = $request->page ?? 1;
        $offset = ($page - 1) * $limit;

        $user     = User::where('token', $request->bearerToken())->first();
        $students = DB::table('user_courses as uc')
            ->join('users as u', 'u.id', '=', 'uc.user_id')
            ->where('uc.course_id', '=', $request->course_id)
            ->where('u.id', '!=', $user->id)
            ->get();

        $nbTotal   = $students->count();
        $totalPage = ceil($nbTotal / $limit);
        $students  = $students->skip($offset)->take($limit);

        return response()->json([
            'students'  => SupervisorResource::collection($students),
            'page'      => $page,
            'totalPage' => $totalPage,
            'nbTotal'   => $nbTotal,
        ], 200);
    }

    /**
     * This method updates User info in profile page.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function profile_update(Request $request): JsonResponse
    {
        $user = User::where('token', $request->bearerToken())->first();

        $user->university_id   = $request->university_id   ?? $user->university_id;
        $user->name            = $request->name            ?? $user->name;
        $user->surname         = $request->surname         ?? $user->surname;
        $user->phone_number    = $request->phone_number    ?? $user->phone_number;
        $user->login           = $request->login           ?? $user->login;
        $user->gender          = $request->gender          ?? $user->gender;
        $user->birthday        = $request->birthday        ?? $user->birthday;
        $user->course_grade    = $request->course_grade    ?? $user->course_grade;
        $user->faculty         = $request->faculty         ?? $user->faculty;
        $user->speciality      = $request->speciality      ?? $user->speciality;
        $user->city_id         = $request->city_id         ?? $user->city_id;
        $user->country_id      = $request->country_id      ?? $user->country_id;
        $user->academic_degree = $request->academic_degree ?? $user->academic_degree;

        if (isset($request->image) and !isset($user->image)) {
            $user->saveImage($request->image);
        } elseif (isset($request->image) and isset($user->image)) {
            $user->updateImage($request->image);
        }

        $user->save();

        return response()->json([
            'User'    => $user,
            'message' => 'User successfully updated'
        ], 200);
    }

    /**
     * This function will delete user's account
     *
     * @param Request       $request
     * @return JsonResponse
     */
    public function delete(Request $request): JsonResponse
    {
        $user = User::where('token', $request->bearerToken())->first();

        $user->delete();

        Auth::logout();

        return response()->json([
            'message' => 'Successfully deleted user'
        ]);
    }

    /**
     * Function to remove the student from the course
     *
     * @param Request       $request
     * @return JsonResponse
     */
    public function remove_from_course(Request $request): JsonResponse
    {
        $user        = User::where('token', $request->bearerToken())->first();
        $course      = Course::where('id', $request->course_id)->first();
        $assignments = Assignment::where('course_id', $request->course_id)->pluck('id')->toArray();

        if(!isset($request->user_id)){
            $userCourse = UserCourse::where('user_id', $user->id)->where('course_id', $request->course_id)->first();
            $userCourse->delete();

            $answers = Answer::whereIn('assignment_id', $assignments)->where('user_id', $user->id);
            $answers->delete();

            return response()->json([
                'message' => 'You successfully removed from the course.'
            ]);
        } else if ($user->id == $course->supervisor_id){
            $userCourse = UserCourse::where('user_id', $request->user_id)->where('course_id', $request->course_id)->first();
            $userCourse->delete();

            $answers = Answer::whereIn('assignment_id', $assignments)->where('user_id', $request->user_id);
            $answers->delete();

            return response()->json([
                'message' => 'You successfully removed student from the course.'
            ]);
        }

        return response()->json([
            'message' => 'You are not allowed to do it.'
        ]);
    }

    /**
     * Gets full information about the user
     *
     * @param Request       $request
     * @return JsonResponse
     */
    public function info(Request $request)
    {
        $user = User::where('token', $request->bearerToken())->first();

        return response()->json([
            'user' => $user,
        ]);
    }
}

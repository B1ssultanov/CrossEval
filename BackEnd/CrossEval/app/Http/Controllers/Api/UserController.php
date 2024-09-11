<?php

namespace app\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Grades\StudentResource;
use App\Http\Resources\Grades\SupervisorResource;
use app\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
            ->join('assignments as as', 'as.id', '=', 'an.assignment_id')
            ->where('as.course_id', '=', $request->course_id)
            ->where('an.user_id', '=', $user->id)
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
}

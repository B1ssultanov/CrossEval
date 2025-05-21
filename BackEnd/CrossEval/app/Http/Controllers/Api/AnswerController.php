<?php

namespace app\Http\Controllers\Api;

use App\Exports\GradesExport;
use App\Http\Controllers\Controller;
use App\Http\Resources\AnswerResource;
use App\Http\Resources\AnswerReviewResource;
use App\Models\Answer;
use App\Models\AnswerReview;
use App\Models\Course;
use App\Models\User;
use App\Services\Answer\Create\Service as CreateAnswerService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class AnswerController extends Controller
{
    /**
     * Create an Answer for the user.
     */
    public function store(Request $request)
    {
        $user      = User::where('token', $request->bearerToken())->first();
        $answer_id = Answer::where('assignment_id', $request->assignment_id)
            ->where('user_id', $user->id)
            ->first()
            ->id;

        $service = new CreateAnswerService();
        $answer  = $service->execute($request->answer_file, $answer_id, $request->comment);

        return response()->json([
            'message' => 'Answer saved successfully',
            'answer'  => $answer
        ], 200 );
    }

    /**
     * Exports Grades of Students into Excel table
     *
     * @param Request $request
     * @return mixed
     */
    public function export(Request $request): mixed
    {
        $course_id     = (int)$request->input('course_id');
        $assignmentIds = $request->input('assignment_ids', []);
        $course        = Course::where('id', $course_id)->first();

        return Excel::download(new GradesExport($assignmentIds), 'grades_' . $course->code . '.xlsx');
    }

    /**
     * Provide information about student submissions.
     *
     * @param Request       $request
     * @return JsonResponse
     */
    public function get(Request $request): JsonResponse
    {
        $user = User::where('token', $request->bearerToken())->first();
        $answer = Answer::where('assignment_id', $request->assignment_id)->where('user_id', $user->id)->first();

        return response()->json([
            'answer' => new AnswerResource($answer),
        ]);
    }

    /**
     * Gives information about students answer check status.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function answer_info(Request $request)
    {
        $user            = User::where('token', $request->bearerToken())->first();
        $answer          = Answer::with('assignment.course.supervisor')->find($request->answer_id);
        $supervisor      = $answer->assignment->course->supervisor;
        $answer_user     = $answer->user;
        $answer_reviews  = AnswerReview::where('answer_id', $request->answer_id)->get();

        if ($answer_user->id == $user->id || $user->id == $supervisor->id){
            return response()->json([
                'answer'  => AnswerReviewResource::collection($answer_reviews),
                'message' => 'Successful response.'
            ]);
        } else {
            return response()->json([
                'message' => 'You are not allowed to see other students grades.'
            ]);
        }
    }

    /**
     * Teacher access to recheck the cross-reviewed assignment
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function answer_recheck(Request $request)
    {
        $user       = User::where('token', $request->bearerToken())->first();
        $answer     = Answer::with('assignment.course.supervisor')->find($request->answer_id);
        $supervisor = $answer->assignment->course->supervisor;

        if ( $supervisor->id == $user->id ){
            $answer->grade      = $request->grade;
            $answer->grade_date = Carbon::now();
            $answer->status     = 'Done';

            $answer->save();
            return response()->json([
                'message' => 'Grade Changed successfully.',
            ]);
        } else {
            return response()->json([
                'message' => 'You are not the supervisor.'
            ]);
        }
    }
}

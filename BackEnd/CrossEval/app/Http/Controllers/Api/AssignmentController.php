<?php

namespace app\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssignmentSummaryResource;
use App\Models\Assignment;
use App\Models\Course;
use App\Models\User;
use App\Models\Answer;
use App\Models\UserCourse;
use App\Services\Assignment\Rubrics\Create\Service as AddRubricsService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    /**
     * API that gives info to schedule page
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function schedule(Request $request)
    {
        $user           = User::where('token', $request->bearerToken())->first();
        $assignments_id = Answer::where('user_id', $user->id)->pluck('assignment_id');
        $assignments    = Assignment::whereIn('id', $assignments_id)->orderBy('start_date')->get();

        return response()->json([
            'assignments' => AssignmentSummaryResource::collection($assignments),
        ], 200 );
    }

    /**
     * This method creates/updates Assignment.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     * @throws \Exception
     */
    public function create(Request $request)
    {
        $validateData = Validator::make($request->all(), [
            'course_id'         => 'required|string',
            'title'             => 'required|string',
            'description'       => 'required|string',
            'type'              => 'required|string|in:quiz,project,presentation,code,essay',
            'evaluation_method' => 'required|string|in:Cross-check,System-check,Manual-check',
            'criteria'          => 'required|string',
            'start_date'        => 'required|date|after:today',
            'end_date'          => 'required|date|after:start_date',
            'weight'            => 'required|numeric',
        ], [
            'course_id.required'         => 'The course ID is required.',
            'course_id.string'           => 'The course ID must be a valid string.',
            'title.required'             => 'The title is required.',
            'title.string'               => 'The title must be a valid string.',
            'description.required'       => 'The description is required.',
            'description.string'         => 'The description must be a valid string.',
            'type.required'              => 'The type is required.',
            'type.string'                => 'The type must be a string.',
            'type.in'                    => 'The type must be one of the following: quiz,project,presentation,code,essay.',
            'evaluation_method.required' => 'The evaluation-method is required.',
            'evaluation_method.boolean'  => 'The evaluation-method must be one of following: "Cross-check", "System-check", "Manual-check".',
            'criteria.required'          => 'The criteria is required.',
            'criteria.string'            => 'The criteria must be a valid string.',
            'start_date.required'        => 'The start date is required.',
            'start_date.date'            => 'The start date must be a valid date and time.',
            'end_date.required'          => 'The end date is required.',
            'end_date.date'              => 'The end date must be a valid date and time.',
            'weight.required'            => 'The weight is required.',
            'weight.numeric'             => 'The weight must be a number.',
        ]);

        if ($validateData->fails()) {
            return response()->json($validateData->errors(), 400);
        }

        $course  = Course::where('id', $request->course_id)->first();
        $teacher = User::where('token', $request->bearerToken())
            ->where('id', $course->supervisor_id)
            ->first();

        if ( !isset($teacher) ){
            return response()->json( 'You are not the course supervisor.', 200);
        }

        $assignment                        = Assignment::where('id', $request->assignment_id)->first() ?? new Assignment;
        $assignment->user_id               = $teacher->id;
        $assignment->course_id             = $course->id;
        $assignment->type                  = $request->type              ?? $assignment->type;
        $assignment->title                 = $request->title             ?? $assignment->title;
        $assignment->description           = $request->description       ?? $assignment->description;
        $assignment->start_date            = $request->start_date        ?? $assignment->start_date;
        $assignment->end_date              = $request->end_date          ?? $assignment->end_date;
        $assignment->weight                = $request->weight            ?? $assignment->weight;
        $assignment->criteria              = $request->criteria          ?? $assignment->criteria;
        $assignment->evaluation_method     = $request->evaluation_method ?? $assignment->evaluation_method;
        $assignment->end_cross_date        = $request->end_cross_date    ?? $assignment->end_cross_date;
        $assignment->cross_check_processed = false;

        $assignment->save();

        if (isset($request->rubrics_file)) {
            $service    = new AddRubricsService();
            $assignment = $service->execute($request->rubrics_file, $assignment->id);
        }

        if (!isset($request->assignment_id)) {
            $users_assignment = UserCourse::where('course_id', $course->id)->pluck('user_id');

            $data = $users_assignment->map(function ($user_id) use ($assignment) {
                return [
                    'user_id'       => $user_id,
                    'assignment_id' => $assignment->id,
                    'status'        => Answer::STATUS_FUTURE,
                ];
            });

            Answer::insert($data->toArray());
        }

        return response()->json( $assignment, 200);
    }

    /**
     * API for getting Assignment summary data
     *
     * @param Request $request
     * @param         $id
     * @return JsonResponse
     */
    public function get(Request $request, $id)
    {
        $assignment = Assignment::where('id', $id)->first();

        return response()->json([
            'assignment' => new AssignmentSummaryResource($assignment),
        ], 200 );
    }

    /**
     * This API would give the answers which was not submitted
     *
     * @return JsonResponse
     */
    public function missed_assignment(): JsonResponse
    {
        $currentDateTime = Carbon::now();

        $assignments = Assignment::where('end_date', '<=', $currentDateTime)->get();

        if (isset($assignments)) {

            $answers = Answer::whereIn('assignment_id', $assignments->pluck('id'))->where('status', 'Available')->get();

            foreach ($answers as $answer) {
                $answer->status = 'Missed';
                $answer->save();
            }

            $filtered = $answers->map(function ($user) {
                return $user->only(['assignment_id', 'user_id']);
            });

            $filteredArray = $filtered->toArray();

            return response()->json([
                'message' => 'This students are missed the assignment for this moment',
                'answers' => $filteredArray
            ]);
        }
        return response()->json([
            'message' => 'Nobody missed the assignment for this moment.'
        ]);
    }
}

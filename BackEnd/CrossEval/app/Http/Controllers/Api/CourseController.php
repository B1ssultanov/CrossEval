<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssignmentSummaryResource;
use App\Http\Resources\CourseSummaryResource;
use App\Models\Answer;
use App\Models\Assignment;
use App\Models\Course;
use App\Models\UserCourse;
use App\Models\User;
use App\Services\Course\Syllabus\Create\Service as AddSyllabusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    /**
     * API for main page to give Course and User info
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function mainInfo(Request $request): JsonResponse
    {
        $user = User::where('token', $request->bearerToken())->first();

        $course_list = UserCourse::where('user_id', $user->id)->pluck('course_id')->toArray();
        $courses     = Course::whereIn('id', $course_list)
            ->where('name', 'like', '%' . $request->search . '%')
            ->get();

        return response()->json([
            'courses' => CourseSummaryResource::collection($courses),
            'user'    => $user,
        ], 200 );
    }

    /**
     * API that gives info about course for the user. With the assignments' data.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function detail(Request $request): JsonResponse
    {
        $course      = Course::where('id', $request->id)->first();
        $assignments = Assignment::where('course_id', $course->id)->get();

        return response()->json([
            'course'      => new CourseSummaryResource($course),
            'assignments' => AssignmentSummaryResource::collection($assignments),
        ], 200 );
    }

    /**
     * Function that creates course
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        $validateData = Validator::make($request->all(), [
            'id'  => 'required|string', // course->code
            'name'  => 'required|string', // course->course_group
            'group' => 'required|string', // "24-p, 25-p"
        ], [
            'id.required'    => 'The course ID is required.',
            'id.string'      => 'The course ID must be a valid string.',
            'name.required'  => 'The course Name is required.',
            'name.string'    => 'The course Name must be a valid string.',
            'group.required' => 'The course group is required.',
            'group.string'   => 'The course group must be a valid string.',
        ]);

        if ($validateData->fails()) {
            return response()->json($validateData->errors(), 400);
        }

        $groups = explode(', ', $request->group);

        $user = User::where('token', $request->bearerToken())->first();

        foreach ($groups as $group) {
            $course = Course::create([
                'code'          => $request->id,
                'name'          => $request->name,
                'course_group'  => $group,
                'invite_code'   => Str::random(6),
            ]);

            UserCourse::create([
                'user_id'   => $user->id,
                'course_id' => $course->id,
            ]);
        }

        return response()->json([
            'message' => 'Course created successfully'
        ], 200 );
    }

    /**
     * This method creates syllabus for the course
     *
     * @param Request       $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function syllabus(Request $request): JsonResponse
    {
        $service = new AddSyllabusService();
        $course  = $service->execute($request->syllabus_file, $request->course_id);

        return response()->json([
            'course'  => $course,
            'message' => 'Course syllabus added successfully!',
        ], 200 );
    }

    /**
     * API to register student to the course
     *
     * @param Request       $request
     * @return JsonResponse
     */
    public function invite(Request $request): JsonResponse
    {
        $user   = User::where('token', $request->bearerToken())->first();
        $course = Course::where('invite_code', $request->invite_code)->first();

        UserCourse::firstOrCreate([
            'user_id'   => $user->id,
            'course_id' => $course->id,
        ]);

        $assignments = Assignment::where('course_id', $course->id)->pluck('id');

        $data = $assignments->map(function ($assignment_id) use ($user) {
            return [
                'user_id' => $user->id,
                'assignment_id' => $assignment_id,
            ];
        });

        Answer::insertOrIgnore($data->toArray());

        return response()->json([
            'student' => $user->name,
            'message' => 'Successfully added to course',
        ]);
    }
}

<?php

namespace app\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssignmentSummaryResource;
use App\Models\Assignment;
use App\Models\User;
use App\Models\UserAssignments;
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
        $assignments_id = UserAssignments::where('user_id', $user->id)->pluck('assignment_id');
        $assignments    = Assignment::whereIn('id', $assignments_id)->orderBy('start_date')->get();

        return response()->json([
            'assignments' => AssignmentSummaryResource::collection($assignments),
        ], 200 );
    }
}

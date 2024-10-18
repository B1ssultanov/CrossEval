<?php

namespace app\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnswerResource;
use App\Http\Resources\AnswerReviewResource;
use App\Http\Resources\AssignmentSummaryResource;
use App\Models\AnswerReview;
use App\Models\Assignment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CrossCheckController extends Controller
{
    /**
     * Display all information for the Cross-Review page.
     */
    public function getReview(Request $request, $answer_review_id)
    {
        $answer_review = AnswerReview::where('id', $answer_review_id)->first();
        $answer        = $answer_review->answer;
        $assignment    = $answer->assignment;

        return response()->json([
            'answer_info'     => new AnswerResource($answer),
            'assignment_info' => new AssignmentSummaryResource($assignment),
        ], 200 );
    }

    /**
     * Display all students answers that Student needs to check
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function allAnswers(Request $request): \Illuminate\Http\JsonResponse
    {
        $user       = User::where('token', $request->bearerToken())->first();
        $assignment = Assignment::where('id', $request->assignment_id)->first();

        if ($user->id != $request->reviewer_id && $assignment->user_id != $user->id)
            return response()->json( 'You are not the reviewer', 200);

        $answers_info = DB::table(DB::raw("(SELECT * FROM answer_reviews ORDER BY id DESC LIMIT 1000) as ar"))
            ->join('answers', 'ar.answer_id', '=', 'answers.id')
            ->where('answers.assignment_id', $request->assignment_id)
            ->where('ar.reviewer_id', $request->reviewer_id)
            ->get();

        return response()->json([
            'answers_info' => AnswerReviewResource::collection($answers_info),
        ], 200 );
    }
}

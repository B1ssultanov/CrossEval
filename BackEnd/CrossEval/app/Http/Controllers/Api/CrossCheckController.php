<?php

namespace app\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnswerResource;
use App\Http\Resources\AssignmentSummaryResource;
use App\Models\AnswerReview;
use App\Models\Assignment;
use Illuminate\Http\Request;

class CrossCheckController extends Controller
{
    /**
     * Display a listing of the resource.
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
}

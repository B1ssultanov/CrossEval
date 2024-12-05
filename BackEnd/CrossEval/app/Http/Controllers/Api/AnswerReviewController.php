<?php

namespace app\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\AnswerReview;
use App\Models\Assignment;
use Carbon\Carbon;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnswerReviewController extends Controller
{
    /**
     * Controller for creating answer review groups
     *
     * @param Request $request
     * @return array|string
     */
    public function cross_check_grouping(Request $request): array|string
    {
        $assignment  = Assignment::where('id', $request->assignment_id)->first();
        if($assignment->cross_check_processed != 1) {
            $user_answer = Answer::select('id', 'user_id')->where('status', Answer::STATUS_SUBMITTED)->where('assignment_id', $assignment->id)->orderBy('id', 'desc')->limit(1000)->get()->shuffle();
            $user_ids = $user_answer->pluck('user_id')->toArray();

            $groups = [];
            $count = count($user_ids);

            if ($count <= 5) {
                $groups = $user_ids;
            } else {
                $index = 0;
                $groups_by_3 = (4 - ($count % 4)) % 4;
                $groups = $this->divide_groups($groups_by_3, $user_ids, $index);
            }

            foreach ($groups as $group) {
                $answer_ids = $user_answer->whereIn('user_id', $group)->pluck('id')->toArray();

                $permutations = $this->generatePermutations($group, $answer_ids);

                $dataToInsert = [];
                foreach ($permutations as $pair) {
                    $dataToInsert[] = [
                        'reviewer_id' => $pair[0],
                        'answer_id' => $pair[1],
                    ];
                }
                AnswerReview::insertOrIgnore($dataToInsert);
            }

            $assignment->cross_check_processed = True;
            $assignment->save();

            return [
                'groups' => $groups,
                'message' => 'Answer Reviews successfully created'
            ];
        } else {
            return "This Assignment already processed";
        }
    }
    /**
     * This function divides array of users into groups by 4
     *
     * @param $groups_number
     * @param $array
     * @param $index
     * @return array
     */
    public function divide_groups($groups_number, $array, &$index): array
    {
        $groups = [];
        $count  = count($array);

        for ($group = 0; $group < $groups_number; $group++) {
            if ($index < $count) {
                $groups[] = array_slice($array, $index, 3);
                $index += 3;
            }
        }

        while ($index < $count) {
            $groups[] = array_slice($array, $index, 4);
            $index += 4;
        }

        return $groups;
    }

    /**
     * This function creates all permutations for group users
     *
     * @param $array1
     * @param $array2
     * @return array
     */
    function generatePermutations($array1, $array2) {
        $permutations = [];

        $count1 = count($array1);
        $count2 = count($array2);

        for ($i = 0; $i < $count1; $i++) {
            for ($j = 0; $j < $count2; $j++) {
                if ($i !== $j) {
                    $permutations[] = [$array1[$i], $array2[$j]];
                }
            }
        }

        return $permutations;
    }

    /**
     * API for adding review for the answer of the student
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function review_submit(Request $request)
    {
        $validateData = Validator::make($request->all(), [
            'answer_id'    => 'required|numeric',
            'reviewer_id'  => 'required|numeric',
            'criteria'     => 'required|string',
            'comment'      => 'string',
        ], [
            'answer_id.required'    => 'The answer ID is required.',
            'answer_id.numeric'     => 'The answer ID must be a valid number.',
            'reviewer_id.required'  => 'The reviewer ID is required.',
            'reviewer_id.numeric'   => 'The reviewer ID must be a valid number.',
            'criteria.required'     => 'The criteria field is required.',
            'criteria.string'       => 'The criteria must be a valid string.',
            'comment.string'        => 'The comment must be a valid string.',
        ]);

        if ($validateData->fails()) {
            return response()->json($validateData->errors(), 400);
        }

        $user          = User::where('token', $request->bearerToken())->first();
        $answer_review = AnswerReview::where('answer_id', $request->answer_id)->where('reviewer_id', $request->reviewer_id)->first();
        $answer        = Answer::where('id', $request->answer_id)->first();
        $assignment    = Assignment::where('id', $answer->assignment_id)->first();

        if ($user->id != $request->reviewer_id && $assignment->user_id != $user->id)
            return response()->json( 'You are not the reviewer', 200);

        $answer_review->comment        = $request->comment  ?? $answer_review->comment;
        $answer_review->criteria_grade = $request->criteria ?? $answer_review->criteria_grade;

        $answer_review->save();

        $grades = AnswerReview::where('answer_id', $request->answer_id)->pluck('criteria_grade')->toArray();

        if (count(array_filter($grades, function($value) { return is_null($value); })) === 0) {
            $avg_grade = 0;

            foreach ($grades as $grade) {
                $sum = 0;
                $grade = explode(',', $grade);
                foreach ($grade as $value) {
                    if (preg_match('/\d+$/', $value, $matches)) {
                        $sum += (int)$matches[0];
                    }
                }
                $avg_grade += $sum;
            }

            $avg_grade = $avg_grade / count($grades);

            $answer->grade      = $avg_grade;
            $answer->grade_date = Carbon::now();
            $answer->status     = 'Done';

            $answer->save();

            $message = "Successfully checked your work.";
        } else {
            $message = "Other students haven't yet checked you.";
        }


        return response()->json( [
            'AnswerReview' => $answer_review,
            'message' => $message,
        ], 200);
    }
}

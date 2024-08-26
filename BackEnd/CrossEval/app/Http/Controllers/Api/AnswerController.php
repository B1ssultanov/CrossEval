<?php

namespace app\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use App\Models\User;
use App\Services\Answer\Create\Service as CreateAnswerService;
use Illuminate\Http\Request;

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
        $answer = $service->execute($request->answer_file, $answer_id, $request->comment);

        return response()->json([
            'message' => 'Answer saved successfully',
            'answer'  => $answer
        ], 200 );
    }
}

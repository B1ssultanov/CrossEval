<?php

namespace app\Services\Answer\Create;


use App\Models\Answer;
use App\Services\File\Create\Service as StoreFileService;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;

class Service
{
    /**
     * File path, where answers are saving
     */
    protected const ANSWERS_PATH = '/files/answers/';

    /**
     * Answer's Model
     *
     * @var Answer
     */
    protected Answer $answer;

    /**
     * Service for adding Files
     *
     * @var \app\Services\File\Create\Service
     */
    protected StoreFileService $storeFileService;

    public function __construct()
    {
        $this->storeFileService = new StoreFileService;
    }

    /**
     * Updating Answer
     *
     * @param UploadedFile $uploadedFile
     * @param              $answer_id
     * @param              $comment
     * @return Answer
     * @throws \Exception
     */
    public function execute(UploadedFile $uploadedFile, $answer_id, $comment): Answer
    {
        $file   = $this->storeFileService->execute($uploadedFile, self::ANSWERS_PATH);
        $answer = Answer::where('id', $answer_id)->first();

        $answer->submitted_date = Carbon::now();
        $answer->file_id        = $file->id;
        $answer->comment        = $comment;
        $answer->status         = Answer::STATUS_SUBMITTED;

        $answer->save();

        return $answer;
    }
}

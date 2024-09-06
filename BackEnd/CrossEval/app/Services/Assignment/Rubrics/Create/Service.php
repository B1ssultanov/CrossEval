<?php

namespace app\Services\Assignment\Rubrics\Create;

use App\Models\Assignment;
use App\Services\File\Create\Service as StoreFileService;
use Illuminate\Http\UploadedFile;

class Service
{
    /**
     * File path, where rubrics are saving
     */
    protected const RUBRICS_PATH = '/files/rubrics/';

    /**
     * Assignment's Model
     *
     * @var Assignment
     */
    protected Assignment $assignment;

    /**
     * Service for adding Files
     *
     * @var StoreFileService
     */
    protected StoreFileService $storeFileService;

    public function __construct()
    {
        $this->storeFileService = new StoreFileService;
    }

    /**
     * Updating Assignment
     *
     * @param UploadedFile $uploadedFile
     * @param              $assignment_id
     * @return Assignment
     * @throws \Exception
     */
    public function execute(UploadedFile $uploadedFile, $assignment_id): Assignment
    {
        $file       = $this->storeFileService->execute($uploadedFile, self::RUBRICS_PATH);
        $assignment = Assignment::where('id', $assignment_id)->first();

        $assignment->rubrics_file_id = $file->id;

        $assignment->save();

        return $assignment;
    }
}

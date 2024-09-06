<?php

namespace app\Services\Course\Syllabus\Create;

use App\Models\Assignment;
use App\Models\Course;
use App\Services\File\Create\Service as StoreFileService;
use Illuminate\Http\UploadedFile;

class Service
{
    /**
     * File path, where syllabuses are saving
     */
    protected const SYLLABUS_PATH = '/files/syllabuses/';

    /**
     * Course's Model
     *
     * @var Course
     */
    protected Course $course;

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
     * Updating Course table
     *
     * @param UploadedFile $uploadedFile
     * @param              $course_id
     * @return Course
     * @throws \Exception
     */
    public function execute(UploadedFile $uploadedFile, $course_id): Course
    {
        $file   = $this->storeFileService->execute($uploadedFile, self::SYLLABUS_PATH);
        $course = Course::where('id', $course_id)->first();

        $course->syllabus_file_id = $file->id;

        $course->save();

        return $course;
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class CourseSummaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $teacher = DB::table('courses')
            ->join('users', 'users.id', '=', 'courses.supervisor_id')
            ->where('courses.id', $this->id)
            ->select('users.*')
            ->first();

        $teacherName = $teacher ? $teacher->name . ' ' . $teacher->surname : 'No teacher assigned';

        $data = [
            'id'               => $this->id,
            'name'             => $this->name,
            'code'             => $this->code,
            'invite_code'      => $this->invite_code,
            'course_group'     => $this->course_group,
            'teacher_name'     => $teacherName,
            'syllabus_file_id' => $this->syllabus_file_id,
        ];

        return $data;
    }
}

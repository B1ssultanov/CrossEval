<?php

namespace App\Http\Resources;

use App\Models\Answer;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;

class AssignmentSummaryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $status = Answer::where('assignment_id', $this->id)
            ->where('user_id', $request->user->id)
            ->first()
            ->status;

        $course = Course::where('id', $this->course_id)->first();

        $data = [
            'id'                => $this->id,
            'title'             => $this->title,
            'type'              => $this->type,
            'description'       => $this->description,
            'start_date'        => $this->start_date,
            'end_date'          => $this->end_date,
            'weight'            => $this->weight,
            'evaluation_method' => $this->evaluation_method,
            'criteria'          => $this->criteria,
            'rubrics_id'        => $this->rubrics_file_id,
            'status'            => $status,
            'course_info'       => new CourseSummaryResource($course),
        ];

        if ($this->evaluation_method == 'Cross-check') {
            $data += ['end_cross_date' => $this->end_cross_date];
        }

        return $data;
    }
}

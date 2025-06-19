<?php

namespace app\Http\Resources\Grades;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $grade      = $this->grade ?? 0;
        $weight     = $this->weight ?? 0;
        $percentage = ($grade * $weight) / 100;
        $status     = $this->status;

        $data = [
            'assignment_id' => $this->assignment_id,
            'title'         => $this->title,
            'grade'         => $grade,
            'weight'        => $weight . '%',
            'percentage'    => $percentage . '%',
            'status'        => $status,
        ];

        return $data;
    }
}

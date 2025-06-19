<?php

namespace app\Http\Resources\Grades;

use App\Models\Answer;
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

        $answer     = Answer::where('assignment_id', $this->assignment_id)
            ->where('user_id', $this->user_id)
            ->first();

        $data = [
            'assignment_id' => $this->assignment_id,
            'answer_id'     => $answer->id,
            'title'         => $this->title,
            'grade'         => $grade,
            'weight'        => $weight . '%',
            'percentage'    => $percentage . '%',
            'status'        => $status,
        ];

        return $data;
    }
}

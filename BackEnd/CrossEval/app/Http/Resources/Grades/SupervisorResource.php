<?php

namespace app\Http\Resources\Grades;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\Grades\StudentResource;

class SupervisorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $answers = DB::table('answers as an')
            ->join('assignments as as', 'as.id', '=', 'an.assignment_id')
            ->where('as.course_id', '=', $this->course_id)
            ->where('an.user_id', '=', $this->user_id)
            ->get();

        $data = [
            'name'          => $this->name,
            'surname'       => $this->surname,
            'university_id' => $this->university_id,
            'assignments'   => StudentResource::collection($answers),
        ];

        return $data;
    }
}

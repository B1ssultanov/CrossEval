<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnswerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'status'     => $this->status,
            'file_id'    => $this->file_id,
            'comment'    => $this->comment,
            'grade'      => $this->grade,
            'grade_date' => $this->grade_date,
        ];

        return $data;
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssignmentScheduleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id'                => $this->id,
            'title'             => $this->title,
            'type'              => $this->type,
            'start_date'        => $this->start_date,
            'end_date'          => $this->end_date,
            'evaluation_method' => $this->evaluation_method,
        ];

        return $data;
    }
}

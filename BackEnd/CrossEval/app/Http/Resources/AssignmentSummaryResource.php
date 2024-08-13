<?php

namespace App\Http\Resources;

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
        $data = [
            'id'           => $this->id,
            'status'       => $this->status,
            'title'        => $this->title,
            'type'         => $this->type,
            'start_date'   => $this->start_date,
            'end_date'     => $this->end_date,
            'weight'       => $this->weight,
            'isCrossCheck' => $this->cross_check,
        ];

        Cache::put('assignmentSummary' . $this->id, $data);

        return $data;
    }
}

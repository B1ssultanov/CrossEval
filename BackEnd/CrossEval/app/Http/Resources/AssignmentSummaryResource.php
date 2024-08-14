<?php

namespace App\Http\Resources;

use App\Models\UserAssignments;
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
        $status = UserAssignments::where('assignment_id', $this->id)
            ->where('user_id', $request->user->id)
            ->first()
            ->status;

        $data = [
            'id'           => $this->id,
            'title'        => $this->title,
            'type'         => $this->type,
            'start_date'   => $this->start_date,
            'end_date'     => $this->end_date,
            'weight'       => $this->weight,
            'isCrossCheck' => $this->cross_check,
            'status'       => $status,
        ];

        return $data;
    }
}

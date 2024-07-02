<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cache;

class CourseSummaryResource extends JsonResource
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
            'name'         => $this->name,
            'code'         => $this->code,
            'invite_code'  => $this->invite_code,
            'course_group' => $this->course_group,
        ];

        Cache::put('courseSummary' . $this->id, $data);

        return $data;
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentsInfoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id'            => $this->user_id ?? $this->id,
            'university_id' => $this->university_id,
            'name'          => $this->name,
            'surname'       => $this->surname,
        ];

        return $data;
    }
}

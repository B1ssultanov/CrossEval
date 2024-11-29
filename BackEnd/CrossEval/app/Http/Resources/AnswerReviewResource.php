<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnswerReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $overall = 0;
        $grade   = explode(',', $this->criteria_grade);

        foreach ($grade as $value) {
            if (preg_match('/\d+$/', $value, $matches)) {
                $overall += (int)$matches[0];
            }
        }

        $status = ($this->criteria_grade !== null) ? 'Checked' : 'To Check';

        $data = [
            'answer_id' => $this->answer_id,
            'grade'     => $overall,
            'criteria'  => $this->criteria_grade,
            'comment'   => $this->comment,
            'status'    => $status,
        ];

        return $data;
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        $data = [
            'id'           => $this->id,
            'image'        => $this->image,
            'name'         => $this->name,
            'nickname'     => $this->nickname,
            'phone_number' => $this->phone_number,
            'email'        => $this->email,
            'gender'       => $this->gender,
            'birthday'     => $this->birthday,
            'password'     => $this->password,
            'token'        => $this->token,
        ];

        if ($this->image !== null) {
            $data['image'] = config('app.image_url') . $this->image;
        }

        return $data;
    }
}

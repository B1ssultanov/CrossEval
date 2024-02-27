<?php

namespace App\Http\Requests\Admin\User;

use Illuminate\Foundation\Http\FormRequest;

class ShowRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        // добавляем переменную из урла в request
        $id = $this->route('id');

        $this->merge([
            'id' => $id,
        ]);

        return [
            'id' => 'required|exists:users,id'
        ];
    }

    /**
     * Get custom messages for validator error.
     *
     * @return string[]
     */
    public function messages()
    {
        return [
            'id.exists' => 'Пользовтель не найдено.',
        ];
    }
}

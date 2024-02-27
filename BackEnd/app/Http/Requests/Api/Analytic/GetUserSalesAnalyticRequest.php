<?php

namespace App\Http\Requests\Api\Analytic;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class GetUserSalesAnalyticRequest extends FormRequest
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
            'id.exists' => 'Пользователь не найдено.',
        ];
    }

    /**
     * Handle a failed validation attempt
     *
     * @param  Validator $validator
     * @return mixed
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => $validator->errors()->first()
        ], 422));
    }
}

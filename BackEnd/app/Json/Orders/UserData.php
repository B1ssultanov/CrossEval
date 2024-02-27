<?php

namespace App\Json\Orders;

use App\Json\BaseJson;

/**
 * Order user data
 */
class UserData extends BaseJson
{
    /**
     * User name
     *
     * @var string|mixed|null
     */
    public ?string $name;

    /**
     * User surname
     *
     * @var string|mixed|null
     */
    public ?string $surname;

    /**
     * User birthday
     *
     * @var string|mixed|null
     */
    public ?string $birthday;

    /**
     * User email
     *
     * @var string|mixed|null
     */
    public ?string $email;

    /**
     * User phone number
     *
     * @var string|mixed|null
     */
    public ?string $number;

    /**
     * @param array $data
     */
    public function __construct(array $data = [])
    {
        $this->name     = $data['name'] ?? null;
        $this->surname  = $data['surname'] ?? null;
        $this->birthday = $data['birthday'] ?? null;
        $this->email    = $data['email'] ?? null;
        $this->number   = $data['number'] ?? null;
    }

    /**
     * Creates an instance of the current class from json object
     *
     * @param  string $json
     * @return self
     */
    public static function fromJson(string $json): self
    {
        return new self(json_decode($json, true));
    }

    /**
     * Возвращает данные пользователя в виде массива
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'name'              => $this->name,
            'surname'           => $this->surname,
            'birthday'          => $this->birthday,
            'email'             => $this->email,
            'number'            => $this->number,
        ];
    }
}

<?php

namespace App\Json\Orders;

use App\Json\BaseJson;

/**
 * Additional data
 */
class AdditionalData extends BaseJson
{
    /**
     * @var UserData|null
     */
    public ?UserData $userData;

    /**
     * @var TeamData|null
     */
    public ?TeamData $teamData;

    /**
     * @param array $data
     */
    public function __construct(array $data = [])
    {
        if (empty($data['userData'])) {
            $this->userData = null;
        } else {
            $this->userData = new UserData($data['userData']);
        }

        if (empty($data['teamData'])) {
            $this->teamData = null;
        } else {
            $this->teamData = new TeamData($data['teamData']);
        }
    }

    /**
     * @param  \App\Json\Orders\UserData       $userData
     * @return \App\Json\Orders\AdditionalData
     */
    public function setUserData(UserData $userData): self
    {
        $this->userData = $userData;

        return $this;
    }

    /**
     * Checks if user data is filled in
     *
     * @return bool
     */
    public function userDataExists()
    {
        return !is_null($this->userData);
    }

    /**
     * Checks if team data is filled in
     *
     * @return bool
     */
    public function teamDataExists(): bool
    {
        return !is_null($this->teamData);
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
}

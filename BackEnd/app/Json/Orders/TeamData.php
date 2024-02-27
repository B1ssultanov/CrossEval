<?php

namespace App\Json\Orders;

use App\Json\BaseJson;

class TeamData extends BaseJson
{
    /**
     * Team name
     *
     * @var string|null
     */
    public ?string $name;

    /**
     * Team members list
     *
     * @var array|null
     */
    public ?array $members;

    /**
     * @param array $data
     */
    public function __construct(array $data = [])
    {
        $this->name    = $data['name'];
        $this->members = TeamMember::generateMembersList($data['members'] ?? []);
    }

    /**
     * Returns data as an array
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'name'    => $this->name,
            'members' => $this->members,
        ];
    }
}

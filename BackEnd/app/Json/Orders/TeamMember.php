<?php

namespace App\Json\Orders;

use App\Json\BaseJson;

/**
 * Order team member
 */
class TeamMember extends BaseJson
{
    /**
     * Member name
     *
     * @var string
     */
    public string $name;

    /**
     * @param string $name
     */
    public function __construct(string $name)
    {
        $this->name = $name;
    }

    /**
     * Forms a list of objects from an array
     *
     * @param  array $list
     * @return array
     */
    public static function generateMembersList(array $list): array
    {
        $members = [];

        foreach ($list as $item) {
            $members[] = new TeamMember($item['name']);
        }

        return $members;
    }
}

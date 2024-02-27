<?php

namespace App\Json;

/**
 * Base json clas
 */
class BaseJson
{
    /**
     * Converts object to a json
     *
     * @return string
     */
    public function toJson(): string
    {
        return json_encode($this);
    }
}

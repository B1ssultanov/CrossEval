<?php

namespace App\Enum\Statuses;

class FlexibleDateTypes
{
    /**
     * Events this week
     */
    public const THIS_WEEK = 'this_week';

    /**
     * Events this month
     */
    public const THIS_MONTH = 'this_month';

    /**
     * Available filter types
     */
    public const AVAILABLE_TYPES = [
        self::THIS_WEEK,
        self::THIS_MONTH,
    ];

    /**
     * Значение статусов на русском
     */
    public const TYPES_RUS_VALUE = [
        self::THIS_WEEK  => 'на этой неделе',
        self::THIS_MONTH => 'в этом месяце',
    ];
}

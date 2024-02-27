<?php

namespace App\Rules;

use App\Models\Event;
use Illuminate\Contracts\Validation\Rule;

class ActiveEventRule implements Rule
{
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        $event = Event::where('id', $value)->where('status', Event::STATUS_LIVE)->first();

        return $event instanceof Event;
    }

    public function validate($attribute, $value)
    {
        $event = Event::where('id', $value)->where('status', Event::STATUS_LIVE)->first();

        return $event instanceof Event;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'The validation error message.';
    }
}

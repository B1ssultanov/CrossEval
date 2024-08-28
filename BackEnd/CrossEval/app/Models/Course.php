<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Course extends Model
{
    use HasFactory;


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'code',
        'name',
        'course_group',
        'invite_code',
    ];

    /**
     * Returns the Students courses
     *
     * @return HasMany
     */
    public function users()
    {
        return $this->hasMany(User_course::class, 'course_id', 'id');
    }
}

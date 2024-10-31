<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'supervisor_id',
    ];

    /**
     * Returns the Students courses
     *
     * @return HasMany
     */
    public function users()
    {
        return $this->hasMany(UserCourse::class, 'course_id', 'id');
    }

    /**
     * Returns the Supervisor of the courses
     *
     * @return BelongsTo
     */
    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }
}

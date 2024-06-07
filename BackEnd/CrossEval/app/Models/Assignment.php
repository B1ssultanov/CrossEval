<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Assignment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description'
    ];

    /**
     * Returns the Assignments course
     *
     * @return BelongsTo
     */
    public function course()
    {
        return $this->belongsTo(Course::class, 'course_id');
    }
}

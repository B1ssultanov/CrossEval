<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    /**
     * Listing all statuses for Answer
     */
    const STATUS_SUBMITTED = 'Submitted';
    const STATUS_FUTURE = 'Future';
    const STATUS_DONE = 'Done';
    const STATUS_MISSED = 'Missed';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'assignment_id',
        'status',
        'submission',
        'grade',
        'grade_date',
        'comment'
    ];
}

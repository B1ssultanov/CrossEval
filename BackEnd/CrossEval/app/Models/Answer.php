<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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

    const STATUS_AVAILABLE = 'Available';

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

    /**
     * Returns the Answers assignment
     *
     * @return BelongsTo
     */
    public function assignment(): BelongsTo
    {
        return $this->belongsTo(Assignment::class, 'assignment_id');
    }

    /**
     * Returns the Answers user
     *
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Returns the Answers File
     *
     * @return BelongsTo
     */
    public function file(): BelongsTo
    {
        return $this->belongsTo(File::class, 'file_id');
    }
}

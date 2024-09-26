<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnswerReview extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'answer_id',
        'reviewer_id',
        'criteria_grade',
        'comment'
    ];

    /**
     * Returns the AnswerReviews Answer
     *
     * @return BelongsTo
     */
    public function answer(): BelongsTo
    {
        return $this->belongsTo(Answer::class, 'answer_id');
    }

    /**
     * Returns the AnswerReviews reviewer
     *
     * @return BelongsTo
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }
}

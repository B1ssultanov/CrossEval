<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Http\UploadedFile;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Student extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'surname',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Status indicating that the user is active
     */
    public const STATUS_ACTIVE = 'active';

    /**
     * Status indicating that the user is inactive
     */
    public const STATUS_INACTIVE = 'inactive';

    /**
     * Status indicating that the user is banned
     */
    public const STATUS_BAN = 'ban';

    /**
     * Returns the Students city
     *
     * @return BelongsTo
     */
    public function city()
    {
        return $this->belongsTo(City::class, 'city_id');
    }

    /**
     * Returns the Students country
     *
     * @return BelongsTo
     */
    public function country()
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

    /**
     * Returns the Students courses
     *
     * @return HasMany
     */
    public function student_courses()
    {
        return $this->hasMany(Student_course::class, 'student_id', 'id');
    }

    /**
     * Сохрание фотографии
     *
     * @param  \Illuminate\Http\UploadedFile $image
     * @return \App\Models\Student
     */
    public function saveImage(UploadedFile $image): self
    {
        $imageName = time().'.'.$image->getClientOriginalExtension();

        //move image
        $image->move( public_path('images/students'), $imageName);

        $this->image = 'images/students/' . $imageName;

        return $this;
    }

    /**
     * Замена фотографии
     *
     * @param  \Illuminate\Http\UploadedFile $image
     * @return \App\Models\Student
     */
    public function updateImage(UploadedFile $image): self
    {
        //удаление фото
        unlink(public_path($this->image));

        $imageName = time().'.'.$image->getClientOriginalExtension();

        //move image
        $image->move( public_path('images/students'), $imageName );

        $this->image = 'images/students/' . $imageName;

        return $this;
    }

    /**
     * Удаление фотографии
     *
     * @param  \Illuminate\Http\UploadedFile $image
     * @return \App\Models\Student
     */
    public function deleteImage()
    {
        //удаление фото
        unlink(public_path($this->image));

        return $this;
    }
}

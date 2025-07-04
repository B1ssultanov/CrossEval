<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Http\UploadedFile;
use Illuminate\Auth\Notifications\ResetPassword;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'surname',
        'login',
        'gender',
        'faculty',
        'speciality',
        'birthday',
        'role',
        'university_id',
        'token',
        'status',
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

    public function sendPasswordResetNotification($token)
    {
        ResetPassword::createUrlUsing(function ($user, string $token) {
            return config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);
        });

        $this->notify(new ResetPassword($token));
    }

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
    public function user_courses()
    {
        return $this->hasMany(UserCourse::class, 'user_id', 'id');
    }

    /**
     * Returns the supervising courses
     *
     * @return HasMany
     */
    public function supervisor_courses()
    {
        return $this->hasMany(Course::class, 'supervisor_id', 'id');
    }

    /**
     * Сохрание фотографии
     *
     * @param  \Illuminate\Http\UploadedFile $image
     * @return \App\Models\User
     */
    public function saveImage(UploadedFile $image): self
    {
        $imageName = time().'.'.$image->getClientOriginalExtension();

        //move image
        $image->move( public_path('images/users'), $imageName);

        $this->image = 'images/users/' . $imageName;

        return $this;
    }

    /**
     * Замена фотографии
     *
     * @param  \Illuminate\Http\UploadedFile $image
     * @return \App\Models\User
     */
    public function updateImage(UploadedFile $image): self
    {
        //удаление фото
        unlink(public_path($this->image));

        $imageName = time().'.'.$image->getClientOriginalExtension();

        //move image
        $image->move( public_path('images/users'), $imageName );

        $this->image = 'images/users/' . $imageName;

        return $this;
    }

    /**
     * Удаление фотографии
     *
     * @param  \Illuminate\Http\UploadedFile $image
     * @return \App\Models\User
     */
    public function deleteImage()
    {
        //удаление фото
        unlink(public_path($this->image));

        return $this;
    }
}

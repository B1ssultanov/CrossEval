<?php

namespace app\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;

class Supervisor extends Authenticatable
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
     * Сохрание фотографии
     *
     * @param  \Illuminate\Http\UploadedFile $image
     * @return \App\Models\Supervisor
     */
    public function saveImage(UploadedFile $image): self
    {
        $imageName = time().'.'.$image->getClientOriginalExtension();

        //move image
        $image->move( public_path('images/supervisors'), $imageName);

        $this->image = 'images/supervisors/' . $imageName;

        return $this;
    }

    /**
     * Замена фотографии
     *
     * @param  \Illuminate\Http\UploadedFile $image
     * @return \App\Models\Supervisor
     */
    public function updateImage(UploadedFile $image): self
    {
        //удаление фото
        unlink(public_path($this->image));

        $imageName = time().'.'.$image->getClientOriginalExtension();

        //move image
        $image->move( public_path('images/supervisors'), $imageName );

        $this->image = 'images/supervisors/' . $imageName;

        return $this;
    }

    /**
     * Удаление фотографии
     *
     * @param  \Illuminate\Http\UploadedFile $image
     * @return \App\Models\Supervisor
     */
    public function deleteImage()
    {
        //удаление фото
        unlink(public_path($this->image));

        return $this;
    }
}

<?php

namespace App\Models;

use App\Models\Event;
use App\Models\Organization;
use App\Models\Ticket;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Http\UploadedFile;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\DB;

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

    /**
     * Return user organizations
     */
    public function organizations()
    {
        return $this->hasMany(Organization::class);
    }

    /**
     * Return user events
     */
    public function events()
    {
        return $this->hasMany(Event::class);
    }

    /**
     * Returns the total ticket sales of the user's organizations
     *
     * @return array
     */
    public function getTicketSales(): array
    {
        $eventIds = $this->events()->get()->pluck('id');

        $result = DB::table('tickets')
            ->select(
                DB::raw('COUNT(tickets.id) as salesCount'),
                DB::raw('SUM(tickets.price) as salesSum'),
            )
            ->whereIn('event_id', $eventIds)
            ->where('status', Ticket::STATUS_ACTIVE)
            ->first();

        return [
            'salesCount' => $result->salesCount ?? 0,
            'salesSum'   => $result->salesSum ?? 0,
        ];
    }
}

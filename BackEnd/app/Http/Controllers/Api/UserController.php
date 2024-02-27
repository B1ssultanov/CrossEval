<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\EventCategoryResource;
use App\Http\Resources\EventResource;
use App\Http\Resources\UserDataWithoutTokenResource;
use App\Http\Resources\UserDetailResource;
use App\Http\Resources\UserResource;
use App\Models\Event;
use App\Models\EventCategory;
use App\Models\User;
use App\Services\Mail\Auth\SendVerificationCode\Service as VerificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use stdClass;
use Validator;

class UserController extends Controller
{
    /**
     * Registration
     *
     * @param  \Illuminate\Http\Request      $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function registration(Request $request)
    {
        $validateData = Validator::make($request->all(),[
            'name'         => 'required|string',
            'nickname'     => 'required|unique:users,nickname',
            'birthday'     => 'required|date',
            'phone_number' => 'required|string|unique:users,phone_number',
            'gender'       => 'required|in:male,female',
            'password'     => 'required|min:8',
            'email'        => 'required|unique:users,email',
            'image'        => 'image|mimes:jpeg,png,jpg,svg,webp|max:7120',
        ],
        [
            'name.required'         => 'Заполните имя',
            'nickname.required'     => 'Заполните ник',
            'nickname.unique'       => 'Ник занят',
            'birthday.required'     => 'Заполните дату рождения',
            'phone_number.required' => 'Заполните номер телефона',
            'phone_number.unique'   => 'Номер телефона занят',
            'email.required'        => 'Заполните поле email',
            'gender.required'       => 'Укажите свой пол',
            'email.unique'          => 'Email занят',
            'password.required'     => 'Заполните поле password',
            'password.min'          => 'Минимальное длина пароля 8 символов',
        ]);

        if( $validateData->fails() ) {
            return response()->json(
                [
                    'message' => $validateData->errors()->first(),
                    'errors'  => $validateData->errors()
                ],
                400
            );
        }

        $service           = new VerificationService;
        $verification_code = sprintf('%04d', rand(0, 9999));
        $result            = $service->execute($request->email, $verification_code);

        $user               = new User;
        $user->name         = $request->name;
        $user->email        = $request->email;
        $user->nickname     = $request->nickname;
        $user->birthday     = $request->birthday;
        $user->phone_number = $request->phone_number;
        $user->gender       = $request->gender;
        $user->token        = \Str::random(40);
        $user->password     = \Hash::make($request->password);
        $user->appleToken   = $request->appleToken ?? '';
        $user->status       = User::STATUS_INACTIVE;

        if ($request->image) {
            $user->saveImage($request->image);
        }
        $user->save();

        Cache::put(
            $request->email,
            [
                'verification_code' => $verification_code
            ],
            300
        );

        if ($result->isSuccess()) {
            return response()->json( ['message' => 'Код отправлен'], 200);
        }
        return response()->json(['message' => $result->getMessage()], 500);
    }

    /**
     * User Interests
     *
     * @param  \Illuminate\Http\Request      $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function interest(Request $request): JsonResponse
    {
        $categories = EventCategory::orderBy('created_at')->where('parent_id', 0)->get();

        return response()->json(EventCategoryResource::collection($categories));
    }

    /**
     * SMS user verification
     *
     * @param  \Illuminate\Http\Request      $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function verificationCode(Request $request)
    {
        $validateData = Validator::make($request->all(),[
            'email'             => 'required',
            'verification_code' => 'required|min:4'
        ]);

        if( $validateData->fails() ) {
            return response()->json(
                [
                    'message' => $validateData->errors()->first(),
                    'errors'  => $validateData->errors()
                ],
                400
            );
        }

        $user_data = Cache::get($request->email);

        if( !$user_data || $user_data['verification_code'] != $request->verification_code) {
            return response()->json(['message' => 'Не верный email'] , 400);
        }

        $user         = User::where('email', $request->email)->first();
        $user->status = User::STATUS_ACTIVE;
        $user->save();

        Cache::forget($request->email);

        return response()->json(new UserResource($user), 200);
    }

    /**
     * Add user password
     *
     * @param  \Illuminate\Http\Request      $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function setPassword(Request $request)
    {
        $validateData = Validator::make($request->all(),[
            'password' => 'required|min:8',
        ], [
            'password.required'     => 'Заполните поле password',
            'password.min'          => 'Минимальное длина пароля 8 символов',
        ]);

        if( $validateData->fails() ) {
            return response()->json(
                [
                    'message' => $validateData->errors()->first(),
                    'errors' => $validateData->errors()
                ],
                400
            );
        }

        $user           = User::where('token',$request->bearerToken() ?? '')->first();
        $user->password = \Hash::make($request->password);
        $user->status   = 'active';
        $user->save();

        return response()->json(new UserResource($user), 200);
    }

    /**
     * Authorization
     *
     * @param  \Illuminate\Http\Request      $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function authentication(Request $request)
    {
        $validateData = Validator::make( $request->all(),[
            'email'    => 'required|exists:users,email',
            'password' => 'required|min:8'
        ],
        [
            'email.required'    => 'Заполните поле email',
            'email.exists'      => 'Email не найден',
            'password.required' => 'Заполните поле password',
            'password.min'      => 'Минимальное кол-во символов 8'
        ]);

        if( $validateData->fails() ) {
            return response()->json(
                [
                    'message' => $validateData->errors()->first(),
                    'errors'  => $validateData->errors(),
                ],
                400
            );
        }

        $user = User::where('email',$request->email)->first();

        if ($user->status !== 'active') {
            return response()->json(
                [
                    'message' => 'Вы не подтвердили свой номер',
                ],
                400
            );
        }

        if(!Hash::check($request->password,$user->password)) {
            $passwordError = new stdClass();
            $passwordError->password = 'Invalid password';
            return response()->json(
                [
                    'message' => 'Invalid password',
                    'errors'  => [
                        "password" => [
                            "Invalid password"
                        ]
                    ]
                ],
                401
            );
        }

        return response()->json(new UserResource($user) , 200);
    }

    /**
     * Authorization with social media
     *
     * @param  Request $request
     * @return JsonResponse
     */
    public function socailMediaAuthentication(Request $request)
    {
        try {
            $user = User::where('email', $request->email ?? '')
                ->orWhere('appleToken', $request->appleToken ?? '')
                ->first();

            return response()->json([
                'user' => new UserResource($user),
            ]);
        } catch (\ErrorException $e){
            return response()->json(['user' => null]);
        }
    }

    public function getUserEvents(Request $request)
    {
        $user = User::where('token',$request->bearerToken() ?? '')->first();

        $activeEvents = Event::where('events.created', true)
            ->whereIn('events.id', function($query) {
                $query->selectRaw('event_id')
                    ->from('event_datetimes')
                    ->whereDate('start','>=', now()->format('Y-m-d h:m:s'));
            })
            ->join('orders','orders.event_id','events.id')
            ->where('orders.user_id',$user->id)
            ->get();

        $archiveEvents = Event::where('events.created', true)
            ->whereIn('events.id', function($query) {
                $query->selectRaw('event_id')
                    ->from('event_datetimes')
                    ->whereDate('start','<', now()->format('Y-m-d h:m:s'));
            })
            ->join('orders','orders.event_id','events.id')
            ->where('orders.user_id',$user->id)
            ->get();

        $response = new StdClass;
        $response->activeEvents = EventResource::collection($activeEvents);
        $response->archiveEvents = EventResource::collection($archiveEvents);

        return response()->json($response,200);
    }

    public function getUserCreateEvents(Request $request)
    {
        $user = User::where('token',$request->bearerToken() ?? '')->first();

        if (!$user) {
            return response()->json('User not found',401);
        }

        $activeEvents = Event::where('events.created', true)
            ->whereIn('events.id', function($query) {
                $query->selectRaw('event_id')
                    ->from('event_datetimes')
                    ->whereDate('start','>', now()->format('Y-m-d h:m:s'));
            })
            ->where('user_id',$user->id)
            ->get();

        $archiveEvents = Event::where('events.created', true)
            ->whereIn('events.id', function($query) {
                $query->selectRaw('event_id')
                    ->from('event_datetimes')
                    ->whereDate('start','<', now()->format('Y-m-d h:m:s'));
            })
            ->where('user_id',$user->id)
            ->get();

        $response = new StdClass;
        $response->activeEvents = EventResource::collection($activeEvents);
        $response->archiveEvents = EventResource::collection($archiveEvents);

        return response()->json($response,200);
    }


    /**
     * Update User Information
     *
     * @param  Request $request
     * @return JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        $validateData = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'image'        => 'image|mimes:jpeg,png,jpg,svg|max:7120',
            'name'         => 'required|string',
            'email'        => 'required|string',
            'phone_number' => 'required|string',
            'gender'       => 'required|string',
            'nickname'     => 'required|string',
            'birthday'     => 'required|string'
        ],[
            'name.required'         => 'Имя пользователя не найдено.',
            'email.required'        => 'Почта пользователя не найдена.',
            'phone_number.required' => 'Телефон пользователя не найден.',
            'user_id.exists'        => 'Пользователь не найдена.',
            'gender.exists'         => 'Пол пользователя не найден.',
            'nickname.exists'       => 'Название профиля не найдена.',
            'birthday.exists'       => 'День рождения пользователя не найден.'
        ]);

        if ($validateData->fails()) {
            return response()->json([
                'message' => $validateData->errors()->first(),
                'errors'  => $validateData->errors()
            ], 422);
        }

        /** @var \App\Models\User $user */
        $user = $request->user;

        if ( $user->nickname !== $request->nickname && User::where('nickname', $request->nickname)->first() === null){
            $user->nickname = $request->nickname;
        }

        $user->name         = $request->name;
        $user->email        = $request->email;
        $user->phone_number = $request->phone_number;
        $user->gender       = $request->gender;
        $user->birthday     = $request->birthday;

        if ($request->image instanceof UploadedFile) {
            $user->saveImage($request->image);
        }

        $user->save();

        return response()->json([
            'user' => new UserResource($user),
        ]);
    }

    /**
     * Get user's detail information
     *
     * @param  \Illuminate\Http\Request      $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserProfile(Request $request): JsonResponse
    {
        return response()->json([
            'user' => new UserDetailResource($request->user)
        ]);
    }

    /**
     * Get all user data without token
     *
     * @param  \Illuminate\Http\Request      $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserData(Request $request): JsonResponse
    {
        /** @var \App\Models\User $user */
        $user = $request->user;

        return response()->json([
            'user' => new UserDataWithoutTokenResource($user),
        ]);
    }

    /**
     * Удаляет Пользователя
     *
     * @param \Illuminate\Http\Request       $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteUser(Request $request): JsonResponse
    {
        $user = User::where('id',  $request->user->id)->first();

        $user->delete();

        return response()->json([
            'message' => 'Пользователь успешно удален',
        ]);
    }
}

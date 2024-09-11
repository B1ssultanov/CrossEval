<?php

namespace app\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Illuminate\View\View;

class RegisteredUserController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
//            'name'          => ['required', 'string', 'max:255'],
//            'surname'       => ['required', 'string', 'max:255'],
//            'login'         => ['required', 'string', 'max:255'],
//            'gender'        => ['string', 'max:255'],
//            'faculty'       => ['required', 'string', 'max:255'],
//            'speciality'    => ['required', 'string', 'max:255'],
//            'birthday'      => ['date_format:Y-m-d', 'max:255'],
            'email'         => ['required', 'string', 'email', 'max:255', 'unique:'.User::class],
            'password'      => ['required', 'confirmed', Rules\Password::defaults()],
//            'university_id' => ['required', 'integer'],
        ], [
//            'name.required'          => 'The name field is required.',
//            'name.string'            => 'The name must be a string.',
//            'name.max'               => 'The name may not be greater than :max characters.',
//            'surname.required'       => 'The surname field is required.',
//            'surname.string'         => 'The surname must be a string.',
//            'surname.max'            => 'The surname may not be greater than :max characters.',
//            'login.required'         => 'The login field is required.',
//            'login.string'           => 'The login must be a string.',
//            'login.max'              => 'The login may not be greater than :max characters.',
//            'gender.string'          => 'The gender must be a string.',
//            'gender.max'             => 'The gender may not be greater than :max characters.',
//            'faculty.required'       => 'The faculty field is required.',
//            'faculty.string'         => 'The faculty must be a string.',
//            'faculty.max'            => 'The faculty may not be greater than :max characters.',
//            'speciality.required'    => 'The speciality field is required.',
//            'speciality.string'      => 'The speciality must be a string.',
//            'speciality.max'         => 'The speciality may not be greater than :max characters.',
//            'birthday.date_format'   => 'The birthday must be in the format YYYY-MM-DD.',
            'email.required'         => 'The email field is required.',
            'email.string'           => 'The email must be a string.',
            'email.email'            => 'The email must be a valid email address.',
            'email.max'              => 'The email may not be greater than :max characters.',
            'email.unique'           => 'The email has already been taken.',
            'password.required'      => 'The password field is required.',
            'password.confirmed'     => 'The password confirmation does not match.',
//            'university_id.required' => 'The university_ud field is required.',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name'          => $request->name,
            'surname'       => $request->surname,
            'login'         => $request->login,
            'gender'        => $request->gender,
            'faculty'       => $request->faculty,
            'speciality'    => $request->speciality,
            'birthday'      => $request->birthday,
            'email'         => $request->email,
            'password'      => Hash::make($request->password),
            'role'          => ($request->isSupervisor == 'on' ? 'supervisor' : 'student'),
            'token'         => \Str::random(40),
            'university_id' => $request->university_id,
            'status'        => 'active',
        ]);

        event(new Registered($user));

        Auth::login($user);

        return response()->json([
            'token'   => $user->token,
            'message' => 'User successfully created',
        ]);
    }
}

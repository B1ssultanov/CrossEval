<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\SendsPasswordResetEmails;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ForgotPasswordController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Password Reset Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling password reset emails and
    | includes a trait which assists in sending these notifications from
    | your application to your users. Feel free to explore this trait.
    |
    */

    use SendsPasswordResetEmails;

    /**
     * Forgot password email sending API
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function forgot_password(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $status = \Illuminate\Support\Facades\Password::sendResetLink(
            $request->only('email')
        );

        return response()->json(['message' => __($status)], $status === \Illuminate\Support\Facades\Password::RESET_LINK_SENT ? 200 : 400);
    }

    /**
     * Resets password
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function reset_password(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = \Illuminate\Support\Facades\Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => bcrypt($password),
                ])->save();
            }
        );

        return response()->json(['message' => __($status)], $status === \Illuminate\Support\Facades\Password::PASSWORD_RESET ? 200 : 400);
    }
}

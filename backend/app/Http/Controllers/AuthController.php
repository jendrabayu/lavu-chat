<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => ['string', 'max:100', 'required', 'email'],
            'password' => ['required', 'string']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'fail',
                'errors' => $validator->getMessageBag()->all()
            ], 400);
        }

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $token = $request->user()->createToken('token');
            $user = $request->user();
            $user['_token'] = $token->plainTextToken;
            return response()->json([
                'status' => 'success',
                'data' => $user,
            ]);
        }

        return response()->json([
            'status' => 'fail',
            'errors' => 'Sorry, your email and password are invalid',
        ], 401);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['string', 'max:25', 'required'],
            'email' => ['string', 'max:30', 'required', 'email', 'unique:users,email'],
            'password' => ['required', Password::min(3)->letters()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'fail',
                'errors' => $validator->getMessageBag()->all()
            ], 400);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Registration is successful, please login!'
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Logged out'
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => ['string', 'max:255', 'required'],
            'email' => ['string', 'max:255`', 'required', 'email', 'unique:users,email,' . $user->id],
            'avatar' => ['max:1000', 'nullable']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'fail',
                'errors' => $validator->getMessageBag()->all()
            ], 400);
        }

        if ($request->hasFile('avatar')) {
            $avatar = $request->file('avatar')->store('avatars', 'public');
            Storage::delete($user->avatar);
        } else {
            $avatar = $user->avatar;
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->avatar = $avatar;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated',
            'data' => [
                'user' => Auth::user()
            ]
        ], 200);
    }


    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => ['required', Password::min(3)->letters()],
            'password' => ['required', Password::min(3)->letters(), 'confirmed']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'fail',
                'errors' => $validator->getMessageBag()->all()
            ], 400);
        }

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'fail',
                'errors' => 'Sorry, Your current password is wrong'
            ], 400);
        }


        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Password changed',
        ], 200);
    }
}

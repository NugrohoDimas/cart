<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class JwtAuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    public function register(Request $request): JsonResponse
    {
        $req = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:6',
        ]);

        if($req->fails()){
            return response()->json($req->errors()->toJson(), 400);
        }

        $user = User::create(array_merge(
            $req->validated(),
            ['password' => bcrypt($request->password)]
        ));

        return response()->json([
            'message' => 'User signed up',
            'user' => $user
        ], 201);
    }

    public function login(Request $request)
    {
        $req = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required|string|min:5',
        ]);

        if ($req->fails()) {
            return response()->json($req->errors(), 422);
        }

        $token = auth()->attempt(request(['email', 'password']));

        try {
            if (!$token) {
                return response()->json(['Auth error' => 'Unauthorized'], 401);
            }
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        $cookie = cookie('jwt', $token, 60 * 24);

        return response(['access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth()->user()])->withCookie($cookie);

//        return redirect()->route('/')->withCookie($cookie);
    }

    public function signout(): JsonResponse
    {
        auth()->logout();
        return response()->json(['message' => 'User loged out']);
    }

    /**
     * Token refresh
     */
    public function refresh(): JsonResponse
    {
        return $this->generateToken(auth()->refresh());
    }

    /**
     * User
     */
    public function user()
    {
        return response()->json(auth()->user());
    }

    /**
     * Generate token
     */
    protected function generateToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }

    public function test()
    {
        return "Test";
    }
}

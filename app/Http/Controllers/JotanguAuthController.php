<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Hash;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use GuzzleHttp;
use GuzzleHttp\Subscriber\Oauth\Oauth1;

use App\User;


class JotanguAuthController extends Controller
{
    public function signin (Request $request) {

        //validate request data
        $this->validate($request, [
            'email' => 'required|email|max:255',
            'password' => 'required|max:60'
        ]);

        //get only pair of user's email and password from the request
        $credentials = $request->only(['email', 'password']);

        try {
            // verify the credentials and create a token for the user
            if (! $token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'invalid_credentials'], 401);
            }
        } catch (JWTException $e) {
            // something went wrong
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        // if no errors are encountered we can return a JWT
        return response()->json(compact('token'));

    }

    public function signup (Request $request) {

        // validate data in request
        // if something wrong it returns json with errors automatically
        $this->validate($request, [
            'first_name' => 'required|max:255',
            'last_name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|max:60'
        ]);

        $userData = $request->only('first_name', 'last_name', 'email', 'password');

        // create new user object with a data provided
        $user = new User;
        $user->first_name = $userData['first_name'];
        $user->last_name = $userData['last_name'];
        $user->email = $userData['email'];
        $user->password = Hash::make($userData['password']);

        $user->save();

        $token = JWTAuth::fromUser($user);
        return response()->json(compact('token'));
    }

    public function facebook(Request $request)
    {
        $client = new GuzzleHttp\Client();

        //set parameters for a facebook authentication request
        //input data here like code, client_id and redirect_uri are passed by satellizer
        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'redirect_uri' => $request->input('redirectUri'),
            'client_secret' => getenv('FACEBOOK_SECRET') //secret facebook code from .env
        ];

        //Exchange authorization code for access token.
        $accessTokenResponse = $client->request('GET', 'https://graph.facebook.com/v2.5/oauth/access_token', [
            'query' => $params
        ]);

        $accessToken = json_decode($accessTokenResponse->getBody(), true);

        //Retrieve profile information about the current user.
        $fields = 'id,email,first_name,last_name,picture';
        $profileResponse = $client->request('GET', 'https://graph.facebook.com/v2.5/me', [
            'query' => [
                'access_token' => $accessToken['access_token'],
                'fields' => $fields
            ]
        ]);
        $profile = json_decode($profileResponse->getBody(), true);

        // Create a new user account or return an existing one.

        // Find user by email
        $user = User::where('email', '=', $profile['email'])->first();

        if ($user) {
            //If the user exists update his info from the facebook profile
            $user->facebook_id = $profile['id'];
            $user->first_name = $profile['first_name'];
            $user->last_name = $profile['last_name'];
            $user->avatar = $profile['picture']['data']['url'];
            $user->save();

            //And return JWT for this user to log him in
            return response()->json(['token' => JWTAuth::fromUser($user)]);
        }

        //If the user doesn't exist create new, get info from the facebook profile and save
        $user = new User;
        $user->facebook_id = $profile['id'];
        $user->email = $profile['email'];
        $user->first_name = $profile['first_name'];
        $user->last_name = $profile['last_name'];
        $user->avatar = $profile['picture']['data']['url'];
        $user->save();

        //And return JWT for this user to log him in
        return response()->json(['token' => JWTAuth::fromUser($user)]);
    }

    public function google (Request $request) {

        $client = new GuzzleHttp\Client();

        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'client_secret' => getenv('GOOGLE_SECRET'),
            'redirect_uri' => $request->input('redirectUri'),
            'grant_type' => 'authorization_code',
        ];

        //Exchange authorization code for access token.
        $accessTokenResponse = $client->request('POST', 'https://accounts.google.com/o/oauth2/token', [
            'form_params' => $params
        ]);
        $accessToken = json_decode($accessTokenResponse->getBody(), true);

        //Retrieve profile information about the current user.
        $profileResponse = $client->request('GET', 'https://www.googleapis.com/plus/v1/people/me/openIdConnect', [
            'headers' => array('Authorization' => 'Bearer ' . $accessToken['access_token'])
        ]);
        $profile = json_decode($profileResponse->getBody(), true);

        // Create a new user account or return an existing one.

        // Find user by email
        $user = User::where('email', '=', $profile['email'])->first();

        if ($user) {
            //If the user exists update his info from the facebook profile
            $user->google_id = $profile['sub'];
            $user->last_name = $profile['family_name'];
            $user->first_name = $profile['given_name'];
            $user->avatar = $profile['picture'];
            $user->save();

            //And return JWT for this user to log him in
            return response()->json(['token' => JWTAuth::fromUser($user)]);
        }

        //If the user doesn't exist create new, get info from the facebook profile and save
        $user = new User;
        $user->google_id = $profile['sub'];
        $user->email = $profile['email'];
        $user->last_name = $profile['family_name'];
        $user->first_name = $profile['given_name'];
        $user->avatar = $profile['picture'];
        $user->save();


        //And return JWT for this user to log him in
        return response()->json(['token' => JWTAuth::fromUser($user)]);
    }

    public function vkontakte (Request $request) {

        $client = new GuzzleHttp\Client();

        $params = [
            'code' => $request->input('code'),
            'client_id' => $request->input('clientId'),
            'client_secret' => getenv('VK_SECRET'),
            'redirect_uri' => $request->input('redirectUri')
        ];

        //Exchange authorization code for access token.
        $accessTokenResponse = $client->request('GET', 'https://oauth.vk.com/access_token', [
            'query' => $params
        ]);
        $accessToken = json_decode($accessTokenResponse->getBody(), true);

        //Retrieve profile information about the current user.
        $fields = 'uid,email,first_name,last_name,photo';
        $profileResponse = $client->request('GET', 'https://api.vk.com/method/users.get', [
            'query' => [
                'access_token' => $accessToken['access_token'],
                'user_id' => $accessToken['user_id'],
                'fields' => $fields
            ]
        ]);
        $profile = json_decode($profileResponse->getBody(), true);
        $profile = $profile['response'][0];

        // Create a new user account or return an existing one.

        // Find user by email
        $user = User::where('email', '=', $accessToken['email'])->first();

        if ($user) {
            //If the user exists update his info from the facebook profile
            $user->vk_id = $profile['uid'];
            $user->first_name = $profile['first_name'];
            $user->last_name = $profile['last_name'];
            $user->avatar = $profile['photo'];
            $user->save();

            //And return JWT for this user to log him in
            return response()->json(['token' => JWTAuth::fromUser($user)]);
        }

        //If the user doesn't exist create new, get info from the facebook profile and save
        $user = new User;
        $user->vk_id = $profile['uid'];
        $user->email = $accessToken['email'];
        $user->first_name = $profile['first_name'];
        $user->last_name = $profile['last_name'];
        $user->avatar = $profile['photo'];
        $user->save();


        //And return JWT for this user to log him in
        return response()->json(['token' => JWTAuth::fromUser($user)]);
    }
}

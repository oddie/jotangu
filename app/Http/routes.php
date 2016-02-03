<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
*/

Route::get('/', function () {
    return response('Don\'t call index.php directly.');
});

Route::group(['prefix' => 'api/auth'], function() {
    Route::post('/signin', 'JotanguAuthController@signin'); //sign in with email and password
    Route::post('/signup', 'JotanguAuthController@signup'); //sign up with email and password
    Route::post('/facebook', 'JotanguAuthController@facebook'); //sign in/up with facebook
    Route::post('/twitter', 'JotanguAuthController@twitter'); //sign in/up with twitter
    Route::post('/google', 'JotanguAuthController@google'); //sign in/up with google plus
    Route::post('/vkontakte', 'JotanguAuthController@vkontakte'); //sign in/up with vkontakte
});

Route::group(['prefix' => 'api/user', 'middleware' => 'jwt.auth'], function() {
    Route::get('/profile', 'JotanguUserController@profile'); //get private user data
});
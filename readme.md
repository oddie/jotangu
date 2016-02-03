# JotAngu App
#### created by Oleg Kovalev (ovkovalev@gmail.com)

### Jotangu App - is an example how to implement authentication with JWT tokens and social OAuth services

Backend:
- [Laravel 5.2](http://laravel.com/docs)
- [Jwt-Auth - JSON Web Token Authentication for Laravel & Lumen](https://github.com/tymondesigns/jwt-auth)
- [Guzzle HTTP Client](https://github.com/guzzle/guzzle)
- [Guzzle OAuth Subscriber](https://github.com/guzzle/oauth-subscriber)

Frontend: AngularJS 1.4.9
- [AngularJS 1.4.9](https://angularjs.org/)
- [Satellizer - token-based authentication module for AngularJS](https://github.com/sahat/satellizer)

## Installation

Clone repository or copy files to your project folder

Run:
composer update
bower update
npm update

from command line in order to load project dependencies

## Database

Create a mysql database with the name "jotangu" and user "jotangu" (password "secret" with all grants on this database.
You may use any names but then don't forget to configure database parameters in .env file in the root project's folder.

Migrate tables

Run "php artisan migrate" from the root project's folder to create tables

Run "php artisan db:seed" from the root project's folder to seed users table.
It creates a user "ovkovalev@gmail.com" with password "secret" which you may use for checking email/password authentication.

## Web Server Configuration

This app was developed on Laravel Homestead virtual environment with Nginx web server.
So for Nginx you need to configure locations for splitting requests to backend and front end.

location /api { try_files $uri $uri/ /index.php?$query_string; }
location / { try_files $uri $uri/ /index.html; }

## Secret codes

Social services use some secret codes to authorize applications to use its API.
I registered jotangu.app in Facebook, Google+ and VKontakte but It would be better if you register your own application and will use own secret codes.
You can change codes in .env configuration file.

## License

Feel free to use this code as you wish

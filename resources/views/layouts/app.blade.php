<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <base href="/"></base>
    <title>Jotangu App</title>

    <!-- Fonts -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css">
    <link href='https://fonts.googleapis.com/css?family=Open+Sans:400,300,700' rel='stylesheet' type='text/css'>
    <!-- Styles -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'OpenSans', sans-serif;
        }
    </style>
</head>
<body id="app-layout" ng-app="jotanguApp">
    <div ui-view="header"></div>

    @yield('content')

    <!-- JavaScripts -->
    <script src="/assets/js/vendor/angular.min.js"></script>
    <script src="/assets/js/vendor/angular-ui-router.min.js"></script>
    <script src="/assets/js/vendor/satellizer.min.js"></script>
    <script src="/assets/js/vendor/loading-bar.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="/assets/js/app.min.js"></script>
</body>
</html>

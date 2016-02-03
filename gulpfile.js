/* Asset management tasks using gulp*/
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    del = require('del');

gulp.task('scripts', function() {
    return gulp.src('resources/frontend/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/app'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('public/app'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('html', function() {
    return gulp.src('resources/frontend/**/*.html')
        .pipe(gulp.dest('public/'))
        .pipe(notify({ message: 'Html task complete' }));
});

gulp.task ('lib', function() {
    gulp.src('bower_components/angular/angular.min.js')
        .pipe(gulp.dest('public/app/lib'))
        .pipe(notify({ message: 'AngularJS copied' }));

    gulp.src('bower_components/angular-loading-bar/build/loading-bar.min.js')
        .pipe(gulp.dest('public/app/lib'))
        .pipe(notify({ message: 'Angular Loading Bar JS copied' }));

    gulp.src('bower_components/angular-loading-bar/build/loading-bar.min.css')
        .pipe(gulp.dest('public/assets/css'))
        .pipe(notify({ message: 'Angular Loading Bar CSS copied' }));

    gulp.src('bower_components/angular-ui-router/release/angular-ui-router.min.js')
        .pipe(gulp.dest('public/app/lib'))
        .pipe(notify({ message: 'Angular UI Router JS copied' }));

    return gulp.src('bower_components/satellizer/satellizer.min.js')
        .pipe(gulp.dest('public/app/lib'))
        .pipe(notify({ message: 'Satellizer JS copied' }));
});

gulp.task('watch-js', function() {
    gulp.watch(['resources/frontend/**/*.js'], ['scripts']);
});
gulp.task('watch-pages', function() {
    gulp.watch(['resources/frontend/**/*.html'], ['html']);
});

gulp.task('default', function() {
    gulp.start('scripts', 'html', 'lib');
});


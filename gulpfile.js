"use strict";

var gulp = require('gulp'),
    connect = require('gulp-connect'),
		wiredep = require('wiredep').stream,
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),    
    clean = require('gulp-clean'),
		opn = require('opn');

// claen
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

// bower
gulp.task('wiredep', function () {    
  gulp.src('app/*.html')
    .pipe(wiredep({
        directory: 'app/bower_components'
    }))
    .pipe(gulp.dest('app'));
});

// Сначала папка dist удаляется, затем запускается сборка 
gulp.task('useref', ['clean'], function () {
    gulp.start('images');
    gulp.start('fonts');
    
    var assets = useref.assets();
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));

});

// Подключаемся к локальному серверу
gulp.task('connect', function () {
	connect.server({
		root: 'app',
		livereload: true
	});
	opn('http://localhost:8080/');
})

// html
gulp.task('html', function () {
  gulp.src('./app/*.html')
    .pipe(connect.reload());
});

// js
gulp.task('html', function () {
  gulp.src('./app/js/*.js')
    .pipe(connect.reload());
});

// css
gulp.task('css', function () {
  gulp.src('./app/css/*.css')
    .pipe(connect.reload());
});

// images
gulp.task('images', function () {
    return gulp.src('app/img/**/*')
        .pipe(gulp.dest('dist/img'))
});

// fonts
gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

// Слежка
gulp.task('watch', function () {
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/css/*.css'], ['css']);
  gulp.watch(['./app/js/*.js'], ['js']);
  gulp.watch(['./bower.json'], ['wiredep']);
});

// Локальная разработка
gulp.task('localdev', ['connect', 'watch']);

// Сборка 
gulp.task('default', ['useref']);



var gulp = require('gulp');
var concat = require('gulp-concat');
var debug = require('gulp-debug');

var src = './public_html';
var destJS = 'public_html/js'

var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});
gulp.task('scripts', function () {
    debugger;
    return gulp.src(src + "/assets/js/*.js")
            .pipe(concat('main.js')).pipe(debug({title: "WTF"}))
            .pipe(gulp.dest(src + '/concat'))
            .pipe(debug({title: "WTF2"}));
});
gulp.task('libs', function () {
    //debugger;
    return gulp.src([
        src + "/vendor/OpenLayers/dist/ol-debug.js"
    ])
            .pipe(concat('libs.js')).pipe(debug({title: "WTF"}))
            .pipe(gulp.dest(src + '/concat'))
            .pipe(debug({title: "WTF2"}));
});
gulp.task('css', function () {
    //debugger;
    return gulp.src([
        src + "/vendor/OpenLayers/dist/*.css",
        src + "/assets/css/*.css"
    ])
            .pipe(concat('main.css')).pipe(debug({title: "WTF"}))
            .pipe(gulp.dest(src + '/concat'))
            .pipe(debug({title: "WTF2"}));
});

gulp.task('default', ['scripts', 'libs',"css"]);

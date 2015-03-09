var gulp   = require('gulp');
var jscs   = require('gulp-jscs'); 
var jshint = require('gulp-jshint');

var config = require('./gulp-config');

gulp.task('vet', function () {
    
    return gulp
        .src(config.jsPath)
        .pipe(jscs())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {verbose: true}));
});

var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var watchify = require('watchify');
var notify = require("gulp-notify");


var dirs = {
  SRC : './src/js',
  PROD : './pub'
}

gulp.task('default', function() {
    // Single entry point to browserify 
    gulp.src('src/js/app.js')
        .pipe(browserify({
          insertGlobals : true
        }))
        .pipe(gulp.dest('./pub/js'))
});



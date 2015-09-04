var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('gulp-browserify');
var notify = require("gulp-notify");


var dirs = {
  SRC : './src/js',
  PROD : './pub'
}

gulp.task('default',['build', 'watch']);

gulp.task('build', function() {
    gulp.src('src/js/app.js')
        .pipe(browserify({
          insertGlobals : true
        }))
        .pipe(gulp.dest('./pub/js'))

});

gulp.task('watch', function() {
	gulp.watch('src/js/*', ['build']);
});

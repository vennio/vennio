var gulp = require('gulp');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');

gulp.task('js', function () {
  gulp.src('client/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build'))
});

gulp.task('browser-sync', function() {
  var files = [
    'client/*.html',
    'client/css/*.css'
  ];

  browserSync.init(files, {
    server: {
      baseDir: './client'
    }
  })
});

gulp.task('build', ['js']);
gulp.task('default', ['browserSync']);
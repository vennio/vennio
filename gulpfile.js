var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var less = require('gulp-sass');

var paths = {
  scss: 'client/css/*.scss'
};

gulp.task('js', function() {
  return gulp.src([
    'client/bower_components/d3/d3.js',
    'client/bower_components/jquery/dist/jquery.js',
    'client/bower_components/typeahead.js/dist/typeahead.bundle.js',
    'client/bower_components/pace/pace.js',
    'client/js/*.js'
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/js'))

});

gulp.task('jshint', function() {
  return gulp.src('client/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
})

gulp.task('html', function() {
  return gulp.src('client/*.html').pipe(gulp.dest('build'));
});

gulp.task('img', function() {
  return gulp.src('client/img/**').pipe(gulp.dest('build/img'));
});

gulp.task('fonts', function() {
  return gulp.src('client/font/**').pipe(gulp.dest('build/css'));
});

gulp.task('css', function() {
  return gulp.src([
    'client/bower_components/skeleton/css/normalize.css',
    'client/bower_components/skeleton/css/skeleton.css',
    'client/bower_components/pace/themes/blue/pace-theme-corner-indicator.css',
    'client/font/stylesheet.css'
  ])
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('build/css'));
});

gulp.task('sass', function() {
  return gulp.src([
    'client/css/*.scss'
  ])
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(gulp.dest('build/css'))
  .pipe(browserSync.stream());
});

gulp.task('bsync', function() {
  var files = [
    'client/*.html',
    'client/css/*.css'
  ];

  browserSync.init(files, {
    server: {
      baseDir: './build'
    }
  })

});

gulp.task('bs-reload', function() {
  return browserSync.reload();
})

gulp.task('default', ['sass', 'css', 'fonts', 'bsync', 'js', 'html', 'img'], function() {

  gulp.watch(['client/js/*.js'], ['jshint', 'js', 'bs-reload']);
  gulp.watch(['client/css/**/*.scss'], ['sass']);
  gulp.watch(['client/*.html'], ['html', 'bs-reload']);

});

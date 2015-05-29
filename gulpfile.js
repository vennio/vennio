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
  gulp.src([
    'client/bower_components/d3/d3.js',
    'client/js/*.js'
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
    
});

gulp.task('jshint', function() {
  return gulp.src('client/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
})

gulp.task('html', function() {
  gulp.src('client/*.html').pipe(gulp.dest('build'));
});

gulp.task('img', function() {
  gulp.src('client/img/**').pipe(gulp.dest('build/img'));
});

gulp.task('sass', function() {
  return gulp.src([
    'client/bower_components/skeleton/normalize.css',
    'client/bower_components/skeleton/skeleton.css',
    'client/font/stylesheet.css',
    "client/css/*.scss"
  ])
  .pipe(sass())
  .pipe(gulp.dest("build/css"))
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

gulp.task('bs-reload', function () {
  browserSync.reload();
})

gulp.task('default', ['sass', 'bsync', 'js', 'html', 'img'], function() {

  gulp.watch(['client/js/*.js'], ['jshint','js']);
  gulp.watch(['client/css/**/*.scss'], ['sass']);
  gulp.watch(['*.html'], ['html','bs-reload']);

});
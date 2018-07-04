var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    cache = require('gulp-cache'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass');

gulp.task('browser-sync', function () {
  browserSync({
    server: {
      baseDir: 'app'
    },
    notify: true
  });
});

//Sass Task
gulp.task('scss', function () {
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer(['last 15 versions']))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({ stream: true }))
});

//Task for removing 'dist' folder before every 'build' task
gulp.task('clean', function () {
  return del.sync('build');
});

//Task for clearing cache
gulp.task('clear', function () {
  return cache.clearAll();
})

//Task for building production html
gulp.task('buildHtml', function() {
	return gulp.src('app/*.html')
		.pipe(gulp.dest('build/'));
}); //DONE

//Task for compressing Images
gulp.task('imageMin', function() {
	return gulp.src('app/img/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		})))
		.pipe(gulp.dest('build/img'));
});

// //Copy main.js
// gulp.task('js', function() {
// 	return gulp.src('app/js/main.js')
// 		.pipe(gulp.dest('build/js/'));
// }); //DONE

//Script Task for concat and minifying base jquery plgs
gulp.task('libs', function() {
	return gulp.src([
		'app/js/libs/html5shiv.js',
		'app/js/libs/selectivizr-min.js',
		'app/js/libs/respond.min.js',
		'app/js/plugins.js'
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'))
});



// Watch Task Scss
gulp.task('watch', ['browser-sync', 'scss'], function () {
  gulp.watch('app/js/**/*.js', browserSync.reload);
  gulp.watch('app/**/*.html', browserSync.reload);
  gulp.watch('app/scss/**/*.scss', ['scss']);
}); //,'scss','libs'

gulp.task('build', ['clean', 'imageMin', 'scss', 'buildHtml', 'libs'], function () {

  var buildCss = gulp.src([
    // 'app/css/fonts.min.css',
    'app/css/style.css'
  ]).pipe(gulp.dest('build/css'));

  var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('build/fonts'));

  var buildJs = gulp.src([
    'app/js/libs.min.js*',
    'app/js/main.js'
  ]).pipe(gulp.dest('build/js'));
});

//Default Task
gulp.task('default', ['watch']);
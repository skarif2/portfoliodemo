var gulp = require('gulp'),
	 jade = require('gulp-jade'),
	 uglify = require('gulp-uglify'),
	 gulpif = require('gulp-if'),
	 sass = require('gulp-sass'),
	 sourcemaps = require('gulp-sourcemaps'),
	 browserSync = require('browser-sync');

var env = process.env.NODE_ENV || 'development';
var outputDir = 'builds/development';

gulp.task('jade', function(){
	return gulp.src('src/templates/*.jade')
		.pipe(jade())
		.pipe(gulp.dest(outputDir));
});

gulp.task('js', function(){
	return gulp.src('src/js/main.js')		
		.pipe(sourcemaps.init())
		.pipe(gulpif(env === 'production', uglify()))	
		.pipe(gulpif(env === 'development', sourcemaps.write()))
		.pipe(gulp.dest(outputDir + '/js'));
});

gulp.task('sass', function(){
	var style;
	if(env === 'development'){
		style = 'map';
	}
	if(env === 'production'){
		style = 'compressed';
	}
	return gulp.src('src/sass/*.sass')
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle : style}).on('error', sass.logError))
		.pipe(gulpif(env === 'development', sourcemaps.write()))
		.pipe(gulp.dest( outputDir + '/css'));
});

gulp.task('reloadBrowser',['jade','js','sass'], browserSync.reload);

gulp.task('watch', function(){
	browserSync({
		server:{
			baseDir: 'builds/development'
		}
	})
	gulp.watch('src/templates/**/*.jade', ['reloadBrowser']);
	gulp.watch('src/js/main.js', ['reloadBrowser']);
	gulp.watch('src/sass/**/*.sass', ['reloadBrowser']);
});

gulp.task('default', ['jade', 'js', 'sass', 'reloadBrowser', 'watch']);
const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const cache = require('gulp-cache');
const babel = require('gulp-babel');
const clean = require('gulp-clean');

//browser-sync

gulp.task('browserSync', function () {
	browserSync({
		server: {
			baseDir: 'src'
		},
		notify: false
	})
});

//sass

gulp.task('sass', function () {
	gulp.src('src/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('src/css/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

//concat

gulp.task('scripts', function () {
	gulp.src('src/js/assest/*.js')
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('src/js/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

//autoprefixer

gulp.task('autoprefixer', () => {
	gulp.src('src/css/**/*.css')
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: true
		}))
		.pipe(gulp.dest('dist/css/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

//imagemin

gulp.task('imagemin', () => {
	gulp.src('src/img/*')
		.pipe(cache(imagemin({
			progressive: true,
			use: [pngquant()],
			interlaced: true
		})))
		.pipe(gulp.dest('src/img/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// babel

gulp.task('babel', () => {
	gulp.src('src/js/*.js')
		.pipe((babel({
			presets: ['@babel/preset-env']
		})))
		.pipe(gulp.dest('dist/js/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// build

gulp.task('cleandist', function () {
	return gulp.src('dist/**', {
			read: false
		})
		.pipe(clean());
})
gulp.task('copyfile', ['cleandist'], function () {
	return gulp.src('src/**/*')
		.pipe(gulp.dest('dist/'))
});
gulp.task('build', ['copyfile']);

//watch

gulp.task('watch', ['browserSync', 'sass', 'scripts', 'autoprefixer', 'imagemin', 'babel', 'build'], function () {
	gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/js/**/*.js', ['scripts']);
	gulp.watch('src/css/**/*.css', ['autoprefixer']);
	gulp.watch('src/img/*', ['imagemin']);
	gulp.watch('src/js/*.js', ['babel']);
});
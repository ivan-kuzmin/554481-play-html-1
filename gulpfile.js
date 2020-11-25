var gulp       = require('gulp'),
	browserSync  = require('browser-sync'),
  del          = require('del'),
	imagemin     = require('gulp-imagemin'),
	pngquant     = require('imagemin-pngquant'),
  cache        = require('gulp-cache'),
  inlineCss    = require('gulp-inline-css'),
  htmlmin      = require('gulp-htmlmin');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app',
		},
		notify: false,
	});
});

gulp.task('code', function() {
	return gulp.src('app/**/*')
	  .pipe(browserSync.reload({ stream: true }))
});

gulp.task('inline-css', async function() {
  return gulp.src('app/**/*.html', { base: './app' })
    .pipe(inlineCss({
      applyStyleTags: true,
      applyLinkTags: true,
      removeStyleTags: true,
      removeLinkTags: true,
      removeHtmlSelectors: true,
      applyTableAttributes: true,
      preserveMediaQueries: true,
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', async function() {
	return del.sync('dist');
});

gulp.task('img', async function() {
	return gulp.src('app/**/img/**/*', { base: './app' })
		.pipe(cache(imagemin({
      interlaced: true,
      progressive: true,
      use: [pngquant()]
    })))
		.pipe(gulp.dest('dist'));
});

gulp.task('prebuild', async function() {
  return gulp.src('app/**/*.html', { base: './app' })
    .pipe(gulp.dest('dist'));
});

// gulp.task('optimize', async function() {
//   return gulp.src('app/**/*.html', { base: './app' })
//     .pipe(htmlmin())
//     .pipe(gulp.dest('dist'));
// });

gulp.task('clear', function (callback) {
	return cache.clearAll();
});

gulp.task('watch', function() {
	gulp.watch('app', gulp.parallel('code'));
});
gulp.task('default', gulp.parallel('browser-sync', 'inline-css', 'watch'));
gulp.task('build', gulp.parallel('prebuild', 'clean', 'img', 'inline-css'));

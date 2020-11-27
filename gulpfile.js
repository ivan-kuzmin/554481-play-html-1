const gulp     = require('gulp'),
  sass         = require('gulp-sass'),
  autoprefixer = require('autoprefixer'),
  inlineCss    = require('gulp-inline-css'),
  connect      = require('gulp-connect')
  removeFiles  = require('gulp-remove-files')
  htmlmin      = require('gulp-htmlmin');

gulp.task('sass', function(callback) {
  return gulp.src('app/**/*.scss', { base: './app' })
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(gulp.dest('app'));
});

gulp.task('inlineCss', function() {
  return gulp.src('app/**/*.html')
    .pipe(
      inlineCss({
        applyStyleTags: true,
        applyLinkTags: true,
        removeStyleTags: true,
        removeLinkTags: true,
        removeHtmlSelectors: true,
        applyTableAttributes: true,
        preserveMediaQueries: true,
      })
    )
    // .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('clearCss', async function () {
  return gulp.src('app/*/*.css')
    .pipe(removeFiles());
});

gulp.task('connect', async function() {
  connect.server({
    port: 8000,
    root: 'dist',
    livereload: true,
  });
});

gulp.task('watch', async function() {
  gulp.watch(['app/**/*', '!app/**/*.css'], gulp.series('build'));
});

gulp.task('default', gulp.series('connect', 'watch'));
gulp.task('build', gulp.series('sass', 'inlineCss', 'clearCss'));

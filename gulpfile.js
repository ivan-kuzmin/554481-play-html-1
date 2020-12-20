const gulp     = require('gulp'),
  sass         = require('gulp-sass'),
  autoprefixer = require('autoprefixer'),
  inlineCss    = require('gulp-inline-css'),
  connect      = require('gulp-connect')
  removeFiles  = require('gulp-remove-files')
  htmlmin      = require('gulp-htmlmin');

const IS_DEV = process.env.NODE_ENV !== 'production';

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
        removeHtmlSelectors: !IS_DEV,
        applyTableAttributes: true,
        preserveMediaQueries: true,
      })
    )
    // .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('html-css', function() {
  return gulp.src(['app/**/*.html', 'app/**/*.css'])
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('images', async function() {
  return gulp.src('app/**/*.png')
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('removeCss', async function () {
  return gulp.src(['app/*/*.css', 'dist/*/*.css'])
    .pipe(removeFiles());
});

gulp.task('clean', async function () {
  return gulp.src('dist/**/*')
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

gulp.task('build', gulp.series('clean' , 'images', 'sass', IS_DEV ? 'html-css' : ['inlineCss', 'removeCss']));

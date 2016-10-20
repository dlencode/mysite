// ==================================================
// Init gulp
// ==================================================

var gulp = require(`gulp`);

var server = require('browser-sync').create();
var $ = require('gulp-load-plugins')({
  pattern: [`gulp-*`, `gulp.*`],
  replaceString: /\bgulp[\-.]/,
});

var del = require(`del`);

// ==================================================
// Set paths to all folders in project
// ==================================================
var paths = {
  app: {
    src: 'app/',
    js: 'app/js/',
    jade: 'app/pages/',
    styles: 'app/styles/',
    images: 'app/images/',
  },
  dist: {
    src: 'dist/',
    js: 'dist/js/',
    jade: 'dist/pages/',
    styles: 'dist/styles/',
    images: 'dist/images/',
  },
};

// ==================================================
// Task JADE
// Compile .jade to .html
// ==================================================
gulp.task('jade', function () {
  $.watch(`${paths.app.jade}*.jade`)
      .pipe($.jade({ pretty: true }))
      .pipe(gulp.dest(`${paths.dist.src}`))
      .pipe($.notify(`<%= file.relative %> was compiled`))
      .pipe(server.stream())
      .on('change', server.reload);
});

gulp.task('jade:build', function () {
  gulp.src(`${paths.app.jade}*.jade`)
      .pipe($.jade({ pretty: true }))
      .pipe(gulp.dest(`${paths.dist.src}`))
      .pipe($.notify(`<%= file.relative %> was compiled`))
      .pipe(server.stream())
      .on('change', server.reload);
});

// ==================================================
// Task SASS
// Compile .sass to .css
// ==================================================
gulp.task('sass', function () {
  $.watch(`${paths.app.styles}**/*.sass`)
      .pipe($.sass())
      .pipe($.rename('main.css'))
      .pipe(gulp.dest(`${paths.dist.styles}`))
      .pipe($.notify(`<%= file.relative %> was compiled`))
      .pipe(server.stream())
      .on('change', server.reload);
});

gulp.task('sass:build', function () {
  gulp.src(`${paths.app.styles}*.sass`)
      .pipe($.sass())
      .pipe($.rename('main.css'))
      .pipe(gulp.dest(`${paths.dist.styles}`))
      .pipe($.notify(`<%= file.relative %> was compiled`))
      .pipe(server.stream())
      .on('change', server.reload);
});

// ==================================================
// Task JS
// Transpile by Babel from ES6 to ES5
// ==================================================
gulp.task('js', function () {
  $.watch(`${paths.app.js}**/*.js`)
      .pipe($.babel({
        presets: ['es2015'],
      }))
      .pipe(gulp.dest(`${paths.dist.js}`))
      .pipe($.notify(`<%= file.relative %> was transpiled`))
      .pipe(server.stream())
      .on('change', server.reload);
});

gulp.task('js:build', function () {
  gulp.src(`${paths.app.js}**/*.js`)
      .pipe($.babel({
        presets: ['es2015'],
      }))
      .pipe(gulp.dest(`${paths.dist.js}`))
      .pipe($.notify(`<%= file.relative %> was transpiled`))
      .pipe(server.stream())
      .on('change', server.reload);
});

// ==================================================
// Images
// Optimize images
// ==================================================
gulp.task('images', function () {
  $.watch(`${paths.app.images}**/*`)
    .pipe($.imagemin())
    .pipe(gulp.dest(`${paths.dist.images}`))
    .pipe($.notify(`<%= file.relative %> was optimized`))
    .pipe(server.stream())
    .on('change', server.reload);
});

gulp.task('images:build', function () {
  gulp.src(`${paths.app.images}**/*`)
    .pipe($.imagemin())
    .pipe(gulp.dest(`${paths.dist.images}`))
    .pipe($.notify(`<%= file.relative %> was optimized`))
    .pipe(server.stream())
    .on('change', server.reload);
});

// ==================================================
// Clean
// Clean all files before compile project
// ==================================================
gulp.task('clear', function () {
  del.sync([`${paths.dist.src}`]);
});

// ==================================================
// Build
// Build all project to /dist
// ==================================================
gulp.task('build', ['js:build', 'sass:build', 'jade:build', 'images:build']);

// ==================================================
// Task SERVE
// Listen to folders and if data was changed - reload page
// ==================================================
gulp.task('serve', ['js', 'sass', 'jade', 'images'], function () {
  server.init({
    server: `${paths.dist.src}`,
  });
});

gulp.task('default', ['clear', 'build', 'serve']);

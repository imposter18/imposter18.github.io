var { watch, src, dest, parallel, series } = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
/*
  Опционально можно описать и передать в Пламбер свой
  обработчик ошибок. Например, чтобы красиво выводить их в консоль
  или показывать системные оповещения (см. gulp-notify)
 */
function errorHandler(errors) {
    console.warn('Error!');
    console.warn(errors);
  }
  
  function buildSomething() {
    return src('src/pages/*.html')
      // Пламбер вешается в самом начале потока
      .pipe(plumber({ errorHandler }))
      .pipe(someTransformation())
      .pipe(anotherTransformation())
      .pipe(dest('build/'));
  }

// Девсервер
function devServer(cb) {
  var params = {
    watch: true,
    reloadDebounce: 150,
    notify: false,
    server: { baseDir: './build' },
  };

  browserSync.create().init(params);
  cb();
}

// Сборка
function buildPages() {
  return src('src/pages/*.html')
    .pipe(dest('build/'));
}

function buildStyles() {
  return src('src/styles/*.css')
    .pipe(dest('build/styles/'));
}

function buildScripts() {
  return src('src/scripts/**/*.js')
    .pipe(dest('build/scripts/'));
}

function buildAssets() {
  return src('src/assets/**/*.*')
    .pipe(dest('build/assets/'));
}
function clearBuild() {
    return del('build/');
  }
  function buildStyles() {
    return src('src/styles/*.scss')
      .pipe(sass())
      .pipe(dest('build/styles/'));
  }

// Отслеживание
function watchFiles() {
  watch('src/pages/*.html', buildPages);
  watch('src/styles/*.css', buildStyles);
  watch('src/scripts/**/*.js', buildScripts);
  watch('src/assets/**/*.*', buildAssets);
  watch('src/styles/*.scss', buildStyles);
}



exports.default =
  series(
    clearBuild,
    parallel(
      devServer,
      series(
        parallel(buildPages, buildStyles, buildScripts, buildAssets),
        watchFiles
      )
    )
  );
var { watch, src, dest, parallel, series } = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var pug = require('gulp-pug');
var imagemin = require('gulp-imagemin');


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
// Шаблонизатор 

function buildPages() {
  // Пути можно передавать массивами
  return src('src/pages/*.pug')
    .pipe(pug())
    .pipe(dest('build/'));
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

function buildAssets(cb) {
  // Уберём пока картинки из общего потока
  src(['src/assets/**/*.*', '!src/assets/img/**/*.*'])
    .pipe(dest('build/assets/'));

  src('src/assets/img/**/*.*')
    .pipe(imagemin())
    .pipe(dest('build/assets/img'));

  // Раньше функция что-то вовзращала, теперь добавляем вместо этого искусственый колбэк
  // Это нужно, чтобы Галп понимал, когда функция отработала и мог запустить следующие задачи
  cb();
}

function clearBuild() {
    return del('build/');
  }
  // function buildStyles() {
  //   return src('src/styles/*.scss')
  //     .pipe(sass())
  //     .pipe(dest('build/styles/'));
  // }
  function buildStyles() {
    return src('src/styles/*.scss')
      .pipe(sass())
      .pipe(postcss([
        autoprefixer(),
        cssnano()
      ]))
      .pipe(dest('build/styles/'));
  }

// Отслеживание
function watchFiles() {
  watch(['src/pages/**/*.pug', 'src/blocks/**/*.pug'], buildPages);
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
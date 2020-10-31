
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
const webpack = require('webpack-stream');
// const typograf = require('gulp-typograf');

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
//  function typografText () {
//   gulp.src('build/*.html')
//       .pipe(typograf({ locale: ['ru', 'en-US'] }))
//       .pipe(gulp.dest('build/'));
// }

// function buildTypograf(){
//   return src('build/.html')
//   .pipe(Typograf({locale: ['ru', 'en-US']}))
//   .pipe(dest('build/'))
// }
// Шаблонизатор 
function buildPages() {
  return src('src/pages/*.pug' )
    .pipe(pug({pretty: true}))
    .pipe(dest('build/'));
}

// postCSS
function buildStyles() {
  return src(['src/styles/*.scss','src/styles/*.css'])
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      cssnano()
    ]))
    .pipe(dest('build/styles/'));
}

function buildScripts() {
  return src('src/scripts/index.js')
    .pipe(webpack({mode: 'development', output: { filename: 'bundle.js' } }))
    .pipe(dest('build/scripts/'));
}

function buildFonts() {
  return src('src/font/**/*.*')
    .pipe(dest('build/font/'));
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

// Отслеживание
function watchFiles() {
  watch(['src/pages/**/*.pug', 'src/blocks/**/*.pug','src/pages/*.pug'], buildPages);
  watch('src/styles/*.css', buildStyles);
  watch('src/scripts/**/*.js', buildScripts);
  watch('src/assets/**/*.*', buildAssets);
  watch('src/styles/*.scss', buildStyles);
}

// Прамблер
function errorHandler(errors) {
  console.warn('Error!');
  console.warn(errors);
}

function buildSomething() {
  return src('src/pages/*.html')
    // Пламбер вешается в самом начале потока
    .pipe(plumber({ errorHandler }))
    .pipe(dest('build/'));
}
exports.buildSomething = buildSomething

 
function clearBuild() {
  return del('build/' );
}



exports.default =
  series(
    buildSomething,
    clearBuild,
    parallel(
      devServer,
      series(
        parallel( buildPages, buildStyles, buildScripts, buildAssets,buildFonts,),
        watchFiles
      )
    )
  );
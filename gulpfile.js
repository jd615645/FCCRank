var gulp = require('gulp');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var gulpPlumber = require('gulp-plumber');
var nodemon = require('gulp-nodemon');

gulp.task('sass', function(){
  gulp.src('./public/styles/scss/*.scss') /*來源檔案*/
      .pipe(gulpPlumber())
      .pipe(sass()) /*編譯sass成css*/
      .pipe(prefix()) /* prefix()加入廠商前綴，()內不加屬性則使用autoprefix的預設值 */
      .pipe(gulp.dest('./public/styles/css')); /*要輸出的檔案,讓它輸出到source文件夾的上層*/
});

/* gulp copy task */
// gulp.task('cp', function(){
// gulp.src('index.html') /* 要copy的來源檔案 */
// .pipe(gulp.dest('..')); /* 要複製到..的目的檔案位置,如將index.html 複製到上一層的外面*/
// });

/* gulp watch task */
gulp.task('watch', function(){
// gulp.watch(['*.html'],['cp']); /* 監聽所有 *.html 和 cp task的檔案 */
gulp.watch(['./public/styles/scss/*.scss'],['sass']); /* 監聽style資料夾下所有scss的檔案 */
});

gulp.task('nodemon', function(cb) {
  var called = false;
  return nodemon({
    script: './bin/www',
    ext: 'js',
    ignore: ['./public/**'],
    nodeArgs: ['--debug']
  }).on('start', function() {
    if (!called) {
      called = true;
      cb();
    }
  });
});


gulp.task('default', ['sass', 'watch']); /*執行gulp時一併執行sass cp 和watch的指令 */

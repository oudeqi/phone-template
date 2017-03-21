
var gulp = require('gulp'),
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin'),
    spritesmith = require('gulp.spritesmith'),
    browserSync = require('browser-sync').create(),
    autoprefixer = require('gulp-autoprefixer'),
    changed = require('gulp-changed'),
    clean = require('gulp-clean'),
    htmlmin = require('gulp-htmlmin'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    watch = require('gulp-watch'),
    merge = require('merge-stream'),
    runSequence = require('run-sequence');

// 开发流程
gulp.task('sprite', function() {
    var spriteData = gulp.src('src/sprite/*.png')
    // 文件名不能包含 @ 符号
    .pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../img/sprite.png',
        cssName: '_sprite.scss',
        cssFormat: 'scss',
        cssTemplate: 'scss.template.mustache',
        cssOpts: 'spriteSrc',//定义变量名
        padding: 20,
        cssVarMap: function(sprite) {
            sprite.name = "icon-" + sprite.name;
        }
    }));
    var imgStream = spriteData.img
        .pipe(gulp.dest('src/img'));
    var cssStream = spriteData.css
        .pipe(gulp.dest('src/scss/helper/'));
    return merge(imgStream, cssStream);
});

gulp.task('scss', function() {
    // console.log(gulp.env.all);
    return gulp.src("src/scss/*.scss")
        // .pipe(gulpif(!gulp.env.all, changed('./src/css', {extension: '.css'})))
        .pipe(changed('./src/css', {extension: '.css'}))
        // .pipe(sourcemaps.init())
        //nested expanded compact compressed
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['Android >= 4.0', 'last 3 Safari versions', 'iOS 7', 'ie >= 9'],
            cascade: true, //是否美化属性值 默认：true
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        // .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('scss:all', function() {
    return gulp.src("src/scss/*.scss")
        // .pipe(sourcemaps.init())
        //nested expanded compact compressed
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['Android >= 4.0', 'last 3 Safari versions', 'iOS 7', 'ie >= 9'],
            cascade: true, //是否美化属性值 默认：true
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        // .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('watch', function(cb) {
    // 监听sprite文件夹，制作雪碧图
    watch("src/sprite/*.*")
        .on('add', function() {
            runSequence('sprite', 'scss:all', browserSync.reload);
        })
        .on('change', function() {
            runSequence('sprite', 'scss:all', browserSync.reload);
        })
        .on('unlink', function() {
            runSequence('sprite', 'scss:all', browserSync.reload);
        });
    // 监听scss 编译scss
    gulp.watch("src/scss/**/*.scss", ['scss']);
    // 监听html 刷新浏览器
    gulp.watch("src/*.html").on('change', browserSync.reload);
    // 监听js 刷新浏览器
    gulp.watch("src/js/*.js").on('change', browserSync.reload);
    cb();
});
gulp.task('server:dev',function(cb){
    // 启动本地服务器
    browserSync.init({
        server: "src/",
        // proxy: "http://192.168.0.200:80/src/", //代理
        files: ["src/css/**/*.css"]
    });
    cb();
});

gulp.task('default', ['sprite'], function(cb) {
    runSequence('scss:all', ['watch', 'server:dev'], cb);
});


// 打包流程
gulp.task('rev', function() {
    return gulp.src(['./dist/css/*.css', './dist/js/*.js', './dist/img/*.*'], {base: 'dist'})
    .pipe(rev())
    .pipe(gulp.dest('./dist'))
    .pipe(rev.manifest({merge: true}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('replacerev:html', function(){
  var manifest = gulp.src('dist/rev-manifest.json');
  return gulp.src('dist/*.html')
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('replacerev:css', function(){
  var manifest = gulp.src('dist/rev-manifest.json');
  return gulp.src('dist/css/*.css')
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('dist/css/'));
});

gulp.task('replacerev:js', function(){
  var manifest = gulp.src('dist/rev-manifest.json');
  return gulp.src('dist/js/*.js')
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('htmlmin', function() {
    return gulp.src('src/*.html')
        .pipe(htmlmin({
           removeComments: true,//清除HTML注释
           collapseWhitespace: true,//压缩HTML
           collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
           removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
           removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
           removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
           minifyJS: true,//压缩页面JS
           minifyCSS: true//压缩页面CSS
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('imagemin', function(){
    return gulp.src('src/img/*.*')
        // .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'));
});


gulp.task('css', function(){
    return gulp.src('src/css/*.css')
        .pipe(minifyCss())
        .pipe(gulp.dest('dist/css/'));
});
gulp.task('js', function(){
    return gulp.src('src/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});


gulp.task('clean', function() {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});

gulp.task('server:build',function(){
    // 启动本地服务器
    browserSync.init({
        server: "dist/",
        // proxy: "http://192.168.0.200:80/dist/", //代理
        files: ["dist/css/*.css"]
    });
    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('build', ['clean'], function(cb) {
    runSequence(
        'scss:all',
        'imagemin',
        'css',
        'js',
        'htmlmin',
        'rev',
        'replacerev:html',
        'replacerev:css',
        'replacerev:js',
        'server:build'
    );
});

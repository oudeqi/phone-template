
var gulp = require("gulp");
var sass = require("gulp-sass");
var imagemin = require("gulp-imagemin");
var spritesmith = require("gulp.spritesmith");
var browserSync = require("browser-sync").create();
var autoprefixer = require("gulp-autoprefixer");
var changed = require("gulp-changed");
var clean = require("gulp-clean");
var htmlmin = require("gulp-htmlmin");
var rev = require("gulp-rev");
var revReplace = require("gulp-rev-replace");
var uglify = require("gulp-uglify");
var minifyCss = require("gulp-clean-css");
var watch = require("gulp-watch");
var merge = require("merge-stream");
var useref = require("gulp-useref");
var gulpif = require("gulp-if");
var runSequence = require("run-sequence");

/*开发流程*/
gulp.task("sprite", function() {
    var spriteData = gulp.src("./src/sprite/*.png")
    .pipe(spritesmith({
        imgName: "sprite.png",
        imgPath: "../img/sprite.png",
        cssName: "_sprite.scss",
        cssFormat: "scss",
        cssTemplate: "scss.template.mustache",
        cssOpts: "spriteSrc",//定义变量名
        padding: 20,
        cssVarMap: function(sprite) {
            sprite.name = "icon-" + sprite.name;
        }
    }));
    var imgStream = spriteData.img
        .pipe(gulp.dest("./src/img"));
    var cssStream = spriteData.css
        .pipe(gulp.dest("./src/scss/helper"));
    return merge(imgStream, cssStream);
});

gulp.task("scss", function() {
    // console.log(gulp.env.all);
    return gulp.src("./src/scss/*.scss")
        // .pipe(gulpif(!gulp.env.all, changed('./src/css', {extension: '.css'})))
        .pipe(changed("./src/css", {extension: ".css"}))
        // .pipe(sourcemaps.init())
        //nested expanded compact compressed
        .pipe(sass({
            outputStyle: "expanded"
        }).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["Android >= 4.0", "last 3 Safari versions", "iOS 7", "ie >= 9"],
            cascade: true, //是否美化属性值 默认：true
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        // .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./src/css"));
});

gulp.task("scss:all", function() {
    return gulp.src("./src/scss/*.scss")
        // .pipe(sourcemaps.init())
        //nested expanded compact compressed
        .pipe(sass({
            outputStyle: "expanded"
        }).on("error", sass.logError))
        .pipe(autoprefixer({
            browsers: ["Android >= 4.0", "last 3 Safari versions", "iOS 7", "ie >= 9"],
            cascade: true, //是否美化属性值 默认：true
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        // .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest("./src/css"));
});

gulp.task("server:dev",function(cb){
    // 启动本地服务器
    browserSync.init({
        server: "./src",
        // https: true,
        // proxy: "http://192.168.0.200:80/src/", //代理
        files: ["./src/css/**/*.css"]
    });
    cb();
});

gulp.task("default", ["sprite"], function() {
    staticWatch();
    runSequence("scss:all", "server:dev");
});

function staticWatch(){
    watch("./src/img/*.*")
        .on("add", function(){console.log("图片增加");browserSync.reload();})
        .on("unlink", function(){console.log("图片删除");browserSync.reload();});

    watch("./src/sprite/*.*")
        .on("add", function() {console.log("雪碧图增加");runSequence("sprite", "scss:all", browserSync.reload);})
        .on("unlink", function() {console.log("删除雪碧图");runSequence("sprite", "scss:all", browserSync.reload);});

    watch(["./src/scss/**/*.scss"])
        .on("add", function() {gulp.start("scss");})
        .on("change", function() {gulp.start("scss");})
        .on("unlink", function() {gulp.start("scss");});

    // gulp.watch("./src/scss/**/*.scss", ['scss']);

    gulp.watch("./src/*.html").on('change', browserSync.reload);
    gulp.watch("./src/js/*.js").on('change', browserSync.reload);
}


/*打包流程*/
gulp.task("rev", function() {
    return gulp.src(["./dist/css/*.css", "./dist/js/*.js", "./dist/img/*.*"], {base: "./dist"})
    .pipe(rev())
    .pipe(gulp.dest("./dist"))
    .pipe(rev.manifest({merge: true}))
    .pipe(gulp.dest("./dist"));
});

gulp.task("replacerev:html", function(){
  var manifest = gulp.src("./dist/rev-manifest.json");
  return gulp.src("./dist/*.html")
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest("./dist"));
});

gulp.task("replacerev:css", function(){
  var manifest = gulp.src("./dist/rev-manifest.json");
  return gulp.src("./dist/css/*.css")
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest("./dist/css"));
});

gulp.task("replacerev:js", function(){
  var manifest = gulp.src("./dist/rev-manifest.json");
  return gulp.src("./dist/js/*.js")
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest("./dist/js"));
});

gulp.task("htmlmin", function() {
    return gulp.src("./src/*.html")
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
        .pipe(gulp.dest("./dist"));
});

gulp.task("imagemin", function(){
    return gulp.src("./src/img/**/*.*")
        // .pipe(imagemin())
        .pipe(gulp.dest("./dist/img"));
});

gulp.task("css", function(){
    return gulp.src("./src/css/*.css")
        .pipe(minifyCss())
        .pipe(gulp.dest("./dist/css"));
});
gulp.task("js", function(){
    return gulp.src("./src/js/*.js")
        .pipe(uglify())
        .pipe(gulp.dest("./dist/js"));
});

gulp.task("clean", function() {
    return gulp.src("./dist", {read: false})
        .pipe(clean());
});

gulp.task("server:build",function(){
    // 启动本地服务器
    browserSync.init({
        server: "./dist",
        // https: true,
        // proxy: "http://192.168.0.200:80/dist/", //代理
        files: ["./dist/css/*.css"]
    });
    gulp.watch("./src/*.html").on("change", browserSync.reload);
});

gulp.task("build", ["clean"], function() {
    runSequence(
        "scss:all",
        "imagemin",
        "css",
        "js",
        "htmlmin",
        "rev",
        "replacerev:html",
        "replacerev:css",
        "replacerev:js",
        "server:build"
    );
});


/*单独合并构建一个页面*/
gulp.task("onepage:useref", function() {
    return gulp.src("./src/art.multpic.share.html")
        .pipe(useref())
        .pipe(gulp.dest("./onepage"));
});
gulp.task("onepage:clean", function() {
    return gulp.src("./onepage", {read: false})
        .pipe(clean());
});
gulp.task("onepage:imagemin", function(){
    return gulp.src("./src/img/*.*")
        .pipe(gulp.dest("./onepage/img"));
});
gulp.task("onepage:rev", function() {
    return gulp.src(["./onepage/css/*.css", "./onepage/js/*.js", "./onepage/img/*.*"], {base: "./onepage"})
    .pipe(rev())
    .pipe(gulp.dest("./onepage"))
    .pipe(rev.manifest({merge: true}))
    .pipe(gulp.dest("./onepage"));
});
gulp.task("onepage:replacerev", function(){
    var manifest = gulp.src("./onepage/rev-manifest.json");
    return gulp.src(["./onepage/*.html", "./onepage/js/*.js", "./onepage/css/*.css"], {base: "./onepage"})
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest("./onepage"));
});

gulp.task("onepage:min", function(){
    return gulp.src(["./onepage/*.html", "./onepage/js/*.js", "./onepage/css/*.css"], {base: "./onepage"})
    .pipe(gulpif("*.js", uglify()))
    .pipe(gulpif("*.css", minifyCss()))
    .pipe(gulpif("*.html", htmlmin({
       removeComments: true,//清除HTML注释
       collapseWhitespace: true,//压缩HTML
       collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
       removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
       removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
       removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
       minifyJS: true,//压缩页面JS
       minifyCSS: true//压缩页面CSS
    })))
    .pipe(gulp.dest("./onepage"));
});
gulp.task("onepage:server",function(){
    // 启动本地服务器
    browserSync.init({
        server: "./onepage",
        // https: true,
        // proxy: "http://192.168.0.200:80/dist/", //代理
        files: ["./onepage/css/*.css"]
    });
    gulp.watch("src/*.html").on("change", browserSync.reload);
});
gulp.task("onepage", ["onepage:clean"], function() {
    runSequence(
        "onepage:useref",
        "onepage:imagemin",
        "onepage:rev",
        "onepage:replacerev",
        "onepage:min",
        "onepage:server"
    );
});









/////////////////////////////////////////////////

var gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    sourcemaps  = require('gulp-sourcemaps'),
    notify = require('gulp-notify'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    watchify = require('watchify'),
    babelify = require('babelify'),
    minifyHtml = require('gulp-minify-html'),
    bower = require('main-bower-files'),
    plumber = require('gulp-plumber'),
    minimist = require('minimist'),
    watch = require('gulp-watch'),
    changed = require('gulp-changed');

var sourcepath  = './';
var destpath    = './';

gulp.task('serve', function() {
    return browserSync({
        server: destpath + 'dist'
    });
});


gulp.task('watch', function() {

    watchify(getBrowserifyBundler(), { delay: 0 }).on('update', bundle);

    watch( sourcepath + 'src/scss/**/*', function () {
        gulp.start('scss');
    });

    watch( sourcepath + 'src/img/**/*', function () {
        gulp.start('images');
    });

    watch( sourcepath + 'src/html/**/*', function () {
        gulp.start('html');
    });

    watch( sourcepath + 'src/assets/**/*', { readDelay: 1000 }, function () {
        gulp.start('assets');
    });


});

var getBrowserifyBundler = (function () {
    var bundler;
    return function () {

        if ('undefined' === typeof bundler) {
            var bfy = browserify(destpath + 'src/js/app.js', {
                debug: true,
                cache: {}, packageCache: {}, fullPaths: true,
                paths: [
                    destpath + 'src/js/'
                ]
            });
            bfy.plugin('stringify', ['json','fs','vs']);
            bfy = bfy.transform(babelify);
            bundler = bfy;
        }
        return bundler;
    }
})();

var bundle = function() {
    var bundleStream = getBrowserifyBundler().bundle();
    return bundleStream
        .on('error', notify.onError("Error: <%= error.message %>"))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(destpath + 'dist/js'))
        .pipe(browserSync.reload({ stream: true }));
};

gulp.task('js', bundle);

gulp.task('scss', function() {
    return gulp.src( sourcepath + 'src/scss/app.scss')
        .pipe(sass())
        .pipe(gulp.dest(destpath + 'dist/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('html', function() {
    return gulp.src(sourcepath + 'src/html/**.html')
        .pipe(minifyHtml({ empty: true }))
        .pipe(gulp.dest(destpath + 'dist'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('images', function() {
    return gulp.src(sourcepath + 'src/img/**/*')
        .pipe(gulp.dest(destpath + 'dist/img'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('assets', function () {
    return gulp.src(sourcepath + 'src/assets/**/*')
        .pipe(plumber())
        .pipe(gulp.dest(destpath + 'dist/assets/'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('build', [ 'assets', 'js', 'scss', 'html', 'images']);
gulp.task('default', ['build', 'watch', 'serve']);

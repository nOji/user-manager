/*
|--------------------------------------------------------------------------
| Require Modules
|--------------------------------------------------------------------------
|
*/
var gulp            = require('gulp'),
    svgstore        = require('gulp-svgstore'),
    svgmin          = require('gulp-svgmin'),
    path            = require('path'),
    sass            = require('gulp-sass'),
    watch           = require('gulp-watch'),
    cheerio         = require('gulp-cheerio'),
    browserSync     = require('browser-sync'),
    autoprefixer    = require('gulp-autoprefixer'),
    uglify          = require('gulp-uglify'),
    concat          = require('gulp-concat'),
    imagemin        = require('gulp-imagemin'),
    sourcemaps      = require('gulp-sourcemaps'),
    rename          = require('gulp-rename'),
    kit             = require('gulp-kit'),
    plumber         = require("gulp-plumber"),
    order           = require("gulp-order");

/*
|--------------------------------------------------------------------------
| GLOBAL CONFIG
|--------------------------------------------------------------------------
|
*/
var config = {

    publicDir: './',
    buildDir: './build/',
    appDir: './app/',
    fontsDir: 'fonts/',
    sassCompression: true,
    
    autoPrefixBrowserList: [
        'last 2 version',
        'safari 5',
        'ie 9',
        'opera 12.1',
        'ios 6',
        'android 4'
    ],

    svgicons: [
        './build/img/-svg/**/*.svg'
    ]

};

/*
|--------------------------------------------------------------------------
| DEFAULT TASK
|--------------------------------------------------------------------------
|
*/
gulp.task('default', ['watch'],function() {});

/*
|--------------------------------------------------------------------------
| WATCH TASK
|--------------------------------------------------------------------------
|
*/
gulp.task('watch', ['browserSync', 'svg-generate', 'sass', 'kit', 'scripts'], function() {
    // WATCHING SASS TEMPLATES
    gulp.watch(config.buildDir+'scss/**/*.scss', ['sass']);
    
    // WATCHING JS TEMPLATES
    gulp.watch(config.buildDir+'js/**/*.js', ['scripts'], reload);

    // SVG WATCH
    gulp.watch(config.buildDir+'img/-svg/**/*.svg', ['svg'], reload);

    // KIT WATCH
    gulp.watch(config.buildDir+'**/*.kit', ['kit'], reload);
});

/*
|--------------------------------------------------------------------------
| BROWSERSYNC TASK
|--------------------------------------------------------------------------
|
*/
gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: config.appDir
        }
    });
});

var reload = browserSync.reload;

/*
|--------------------------------------------------------------------------
| SASS TASK
|--------------------------------------------------------------------------
|
*/
gulp.task('sass', function() {
    return gulp.src(config.buildDir+'scss/*.scss')
        .pipe(plumber())
        //.pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: (config.sassCompression ? 'compressed' : 'expanded') }))
        .pipe(autoprefixer({
            browsers: config.autoPrefixBrowserList,
            cascade:  true
        }))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(config.appDir+'css'))
        .pipe(reload({
            stream: true
        }));
});

/*
|--------------------------------------------------------------------------
| SCRIPT TASK
|--------------------------------------------------------------------------
|
*/
gulp.task('scripts', function() {
    return gulp.src( config.buildDir+'js/**/*.js' )
        .pipe(plumber())
        .pipe(order([
            'helpers/*.js',
            'model/*.js',
            'controller/*.js',
            'view/*.js',
            '*.js'
        ]))
        //.pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('app.js'))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(config.appDir+'js'))
        .pipe(reload({
            stream: true
        }));
});

/*
|--------------------------------------------------------------------------
| KIT TASK
|--------------------------------------------------------------------------
|
*/
gulp.task('kit', function(){
    return gulp.src(config.buildDir+'**/*.kit')
    .pipe(plumber())
    .pipe(kit())
    .pipe(gulp.dest(config.appDir))
    .pipe(reload({
        stream: true
    }));
});

/*
|--------------------------------------------------------------------------
| SVG TASK
|--------------------------------------------------------------------------
|
*/
gulp.task('svg', ['svg-generate', 'kit']);

gulp.task('svg-generate', function() {
    return gulp
        .src(config.svgicons)
        .pipe(plumber())
        .pipe(svgmin(function (file) {
            var prefix = path.basename(file.relative, path.extname(file.relative));
            return {
                plugins: [{
                    cleanupIDs: {
                        prefix: prefix + '-',
                        minify: true
                    }
                }]
            }
        }))
        .pipe(svgstore({inlineSvg: true}))
        .pipe(cheerio({
            run: function ($, file)
            {
                $('svg').attr('style','display:none !important;position:absolute;width:0;height:0;');
                $('[fill]').removeAttr('fill');
                $('style').remove();
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(rename(function (path) {
            path.basename = 'svg-sprite';
        }))        
        .pipe(gulp.dest( config.appDir+'fonts/' ));
});

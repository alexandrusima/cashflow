var gulp   = require('gulp');
var args   = require('yargs').argv;
var del    = require('del');
var config = require('./gulp-config')();
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('template-cache', ['clean-build-code'], function () {
    log('Creating AngularJs $templateCache');
    return gulp.src(config.dev.htmltemplates)
               .pipe($.minifyHtml({empty: true}))
               .pipe($.angularTemplatecache(
                        config.templateCache.file,
                        config.templateCache.options
                ))
               .pipe(gulp.dest(config.temp))
});

gulp.task('clean-build-code', function (done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.buildPath + '**/*.html',
        config.buildPath + 'js/**/*.js'
    );
    clean(files, done);
});

gulp.task('build-fonts', ['clean-build-fonts'], function () {
    log('Copying fonts to build folder.');
    return gulp.src(config.dev.fonts)
               .pipe(gulp.dest(config.build.fontsDest));
});
gulp.task('build-images', ['clean-build-images'], function () {
    log('Copying and compressing images for production env.');
    return gulp.src(config.dev.images)
               .pipe($.imagemin({optimizationLevel: 4}))
               .pipe(gulp.dest(config.build.imagesDest));
});

gulp.task('clean-all', function (done) {
    var delconfig = [].concat(config.build.fontsDest, config.build.imagesDest, config.temp);
    log('Cleaning : ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

gulp.task('clean-build-fonts', function (done) {
    clean(config.build.fontsDest + '**/*.*', done);
});

gulp.task('clean-build-images', function (done) {
    clean(config.build.imagesDest + '**/*.*', done);
});

gulp.task('vet', function () {
    log('Analyzing source with JSHint and JSCS');
    return gulp
        .src(config.jsPath)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('clean-styles', function (done) {
    var files = config.temp + '**/*.css';
    clean(files, done);

});

gulp.task('styles', function () {
    log('Compiling Less --> CSS');
    return gulp
          .src(config.less)
          .pipe($.less())
          .on('error', errorLogger)
          .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
          .pipe(gulp.dest(config.temp));

});

gulp.task('less-watcher', function () {
    gulp.watch([config.less], ['styles']);
});

gulp.task('inject', function() {
    log('working on Dependencies');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp.src(config.index)
           .pipe(wiredep(options))
           .pipe($.inject(gulp.src(config.js)))
           .pipe($.inject(gulp.src(config.css)))
           .pipe(gulp.dest(config.indexDest));
});

gulp.task('serve-dev', ['inject'], function () {
    var options = config.getWebserverOptions();
    return $.nodemon(options)
            .on('restart', function (ev) {
                log('**** nodemon restarted');
                log('files changed on restart:\n' + ev);
                setTimeout(function () {
                    browserSync.notify('reloading now ...');
                    browserSync.reload({stream: false});
                }, config.browserReloadDelay);
            })
            .on('start', function () {
                log('*** nodemon started')
                startBrowserSync(options.env['PORT']);
            })
            .on('crash', function () {
                log('*** nodemon crashed for some reson');
            })
            .on('exit', function () {
                log('*** nodemon exited cleanly.');
            })
    ;
});

function startBrowserSync(port) {
    if (args.nosync || browserSync.active) {
        log('Browser sync is active');
        return;
    }

    log(' **** starting browser-sync on port ' + port);
    gulp.watch([config.less], ['styles'])
        .on('change', function (event) {
            changeEvent(event)
        })
    var options = {
        proxy: 'localhost:' + port,
        port: 8080,
        files: [
            config.client + '**/*.*',
            './index.html',
            '!./**/*.less',
            config.client + '.tmp/**/*.css'
        ],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'cashFlowApp',
        notify: true,
        reloadDelay: 0
    };
    return browserSync(options);
}

function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

function errorLogger(error) {
    log('************* start of error ************');
    log(error);
    log('************* end of error ************');
    this.emit('end');
}

function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.green(msg[item]));
            }
        }
    }
    else {
        $.util.log($.util.colors.green(msg));
    }
}

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.red(path));
    del(path, done);
}

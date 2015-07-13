var gulp   = require('gulp');
var args   = require('yargs').argv;
var del    = require('del');
var config = require('./gulp-config')();
var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

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

// version number control
gulp.task('bump', function () {
    var msg = 'Bumping version control';
    var options = {};
    var type = args.type;
    var version = args.version;
    if (version) {
        msg += ' for version ' + $.util.colors.green(version);
        options.version = version;
    }
    else if (type) {
        msg += ' for type ' + $.util.colors.green(type);
        options.type = type;
    }

    log(msg);
    return gulp.src(config.packages)
               .pipe($.bump(options))
               .pipe(gulp.dest(config.root));
});

gulp.task('clean-build-code', function (done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.buildPath + '**/*.html',
        config.buildPath + 'js/**/*.js'
    );
    clean(files, done);
});
gulp.task('clean-all', function (done) {
    var delconfig = [].concat(
            config.build.fontsDest,
            config.build.imagesDest,
            config.temp,
            config.buildPath + 'js/**/*.js',
            config.buildPath + 'css/**/*.css'
    );
    log('Cleaning : ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

gulp.task('clean-build-fonts', function (done) {
    clean(config.build.fontsDest + '**/*.*', done);
});

gulp.task('clean-build-images', function (done) {
    clean(config.build.imagesDest + '**/*.*', done);
});

gulp.task('clean-styles', function (done) {
    var files = config.temp + '**/*.css';
    clean(files, done);

});

gulp.task('compile-less', ['clean-styles'], function () {
    log('Compiling Less --> CSS');
    return gulp
          .src(config.less)
          .pipe($.less())
          .on('error', errorLogger)
          .pipe($.autoprefixer({browsers: ['last 2 version', '> 5%']}))
          .pipe(gulp.dest(config.temp));

});

gulp.task('inject', ['compile-less', 'template-cache'], function() {
    log('working on Dependencies');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;

    return gulp.src(config.index)
           .pipe(wiredep(options))
           .pipe($.inject(gulp.src(config.js)))
           .pipe($.inject(gulp.src(config.css)))
           .pipe(gulp.dest(config.indexDest));
});

gulp.task('less-watcher', function () {
    gulp.watch([config.less], ['compile-less']);
});

gulp.task('optimize', ['inject', 'build-fonts', 'build-images'], function () {
    log('Optimizing code (js, css, html) for the built version of cashFlowApp.');
    var templateCache = config.temp + config.templateCache.file;
    var assets        = $.useref.assets({searchPath: './'});
    var cssFilter     = $.filter('**/*.css');
    var jsLibFilter   = $.filter('**/lib.js');
    var jsAppFilter   = $.filter('**/app.js');
    return gulp.src(config.index)
            .pipe($.plumber())
            .pipe($.inject(gulp.src(templateCache, {read:false}), {
                starttag: '<!-- inject:templates:js -->'
            }))
            .pipe(assets)
            .pipe(cssFilter)
            .pipe($.cssUrlAdjuster({
                replace:  ['../', '../assets/']
             }))
            .pipe($.minifyCss({
                keepSpecialComments: false
             }))
            .pipe(cssFilter.restore())
            .pipe(jsLibFilter)
            .pipe($.uglify())
            .pipe(jsLibFilter.restore())
            .pipe(jsAppFilter)
            .pipe($.ngAnnotate())
            .pipe($.uglify())
            .pipe(jsAppFilter.restore())
            .pipe($.rev())
            .pipe(assets.restore())
            .pipe($.useref())
            .pipe($.revReplace())
            .pipe(gulp.dest(config.buildPath))
            .pipe($.rev.manifest())
            .pipe(gulp.dest(config.buildPath))
});

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

gulp.task('test', ['vet', 'template-cache'], function (done) {
    startTests(true, done);
});

gulp.task('serve-build', ['optimize'], function () {
    return serve(false);
});

gulp.task('serve-dev', ['inject'], function () {
    return serve(true);
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

gulp.task('build-specs', ['template-cache'], function () {
    log('building spec file')
    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();
    var specs = config.specs;
    options.devDependencies = true;

    if (args.startServers) {
        log('also adding server integration specs');
        specs = [].concat(specs, config.serverIntegrationSpecs);
    }

    return gulp.src(config.specRunner)
               .pipe(wiredep(options))
               .pipe($.inject(gulp.src(config.testlibraries), {name: 'inject:testlibraries', read: false}))
               .pipe($.inject(gulp.src(config.js)))
               .pipe($.inject(gulp.src(config.specHelpers), {name: 'inject:spechelpers', read: false}))
               .pipe($.inject(gulp.src(specs), {name: 'inject:specs', read: false}))
               .pipe($.inject(gulp.src(config.temp + config.templateCache.file), {name: 'inject:templates', read: false}))
               .pipe(gulp.dest(config.tests));
});

gulp.task('serve-specs', ['build-specs'], function (done) {
    log('run the spec runner');
    serve(true, true);
    done();
});
gulp.task('start-apache', function (done) {
    log('Attempting to start apache');
    startApache(done);
});

function startApache(done) {
 //"C:\xampp\apache\bin\httpd.exe" -k runservice
    var spawn = require('child_process').spawn;
    var child = spawn('httpd', [], {cwd: process.cwd()});
    var stdout = '';
    var stderr = '';

    child.stdout.setEncoding('utf8');

    child.stdout.on('data', function (data) {
        stdout += data;
        gutil.log(data);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
        stderr += data;
        gutil.log(gutil.colors.red(data));
        gutil.beep();
    });

    child.on('close', function(code) {
        gutil.log('Done with exit code', code);
        gutil.log('You access complete stdout and stderr from here'); // stdout, stderr
    });
    done();
}
function serve(isDev, specRunner) {
    var options = config.getWebserverOptions(isDev);
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
                startBrowserSync(isDev, options.env['PORT'], specRunner);
            })
            .on('crash', function () {
                log('*** nodemon crashed for some reson');
            })
            .on('exit', function () {
                log('*** nodemon exited cleanly.');
            });
}
function startBrowserSync(isDev, port, specRunner) {
    if (args.nosync || browserSync.active) {
        log('Browser sync is active');
        return;
    }

    log(' **** starting browser-sync on port ' + port);
    if (isDev) {
        gulp.watch([config.less], ['compile-less'])
            .on('change', function (event) {
                changeEvent(event)
            });
    }
    else {
        gulp.watch([config.less, config.jsPath, config.dev.htmltemplates], ['optimize'])
            .on('change', function (event) {
                changeEvent(event)
            });
    }

    var options = {
        proxy: 'localhost:' + port,
        port: 8080,
        files: isDev ? [
            config.client + '**/*.*',
            './index.html',
            '!./**/*.less',
            config.client + '.tmp/**/*.css'
        ] : [],
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
    if (specRunner) {
        options.startPath = config.specRunner;
    }
    return browserSync(options);
}

function startTests(singleRun, done) {
    var karma = require('karma').server;
    var excludeFiles = [];
    var serverSpecs = config.serverIntegrationSpecs;
    excludeFiles = serverSpecs;

    karma.start({
        configFile: __dirname + '/karma.config.js',
        exclude: excludeFiles,
        singleRun: !!singleRun
    }, karmaCompleted);

    function karmaCompleted(karmaResult) {
        log('Karma completed!');
        if (karmaResult === 1) {
            done('karma: tests failed with code ' + karmaResult);
        } else {
            done();
        }
    }
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

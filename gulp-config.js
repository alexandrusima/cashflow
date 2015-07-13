module.exports = function () {
    var build        = './build/';
    var buildAssets  = build + 'assets/';

    var client       = './src/client/';
    var clientApp    = client + 'app/';
    var clientAssets = client + 'assets/';
    var lib          = client + 'lib/';
    var report       = './report/';
    var root         = './';
    var wiredep      = require('wiredep');
    var bowerFiles   = wiredep({devdependencies:true})['js'];
    var tests        = client + 'tests/';

    var specRunnerFile = 'specrunner.html';

    var config = {
        bower: {
            json: require('./bower.json'),
            directory: client + 'bower_components',
            ignorePaths: '../..'
        },
        build: {
            fontsDest: buildAssets + 'fonts/',
            imagesDest: buildAssets + 'img/'

        },
        buildPath: build,
        buildAssets: buildAssets,
        dev: {
            fonts: [
                clientAssets + 'fonts/**/*.*',
                client + 'bower_components/font-awesome/fonts/**/*.*'
            ],
            images: [
                clientAssets + 'img/**/*.*'
            ],
            htmltemplates: [
                client + '**/*.html'
            ]
        },
        client: client,
        clientAssets: clientAssets,
        css: [
            clientAssets + 'css/**/*.css*',
            client + '.tmp/main.css',
            '!' + clientAssets + 'css/**/*.min.css*'
        ],
        index: './index.html',
        indexDest: './',
        js: [
            client + 'assets/js/requirejs.js',
            client + 'assets/js/charts.js',
            client + 'assets/js/charts/jquery.flot.animator.js',
            client + 'assets/js/maps/romania.js',
            client + 'assets/js/functions.js',
            client + 'app/cashFlowApp.module.js',
            client + 'app/services/gravatar.js',
            client + 'app/controllers/sidebarController.js',
            client + 'app/directives/sidebarDirective.js',
            client + 'app/directives/toogle.js',
            client + 'app/directives/widgets.js',
            client + 'app/directives/widgets/profile.js',
            client + 'lib/modal-confirm/confirm-modal.controller.js',
        ],
        jsPath : [
            client + '**/*.js',
            '!' + client + '/**/*.min.js',
            '!' + client + '/assets/**/*.js',
            '!' + client + '/bower_components/**/*.js',
            '!' + tests + '**/*.js',
            '!**/gravatar.js'
        ],
        less: client + '/assets/less/main.less',
        packages: [
            './bower.json',
            './package.json'
        ],
        report: report,
        root: root,
        specHelpers: [client + 'tests/test-helpers/*.js'],
        serverIntegrationSpecs: [
            tests + 'server-integration/**/*.spec.js'
        ],
        temp: client + '.tmp/',
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'cashFlowApp',
                standAlone: false,
                root: client
            }
        },
        tests: tests,
        webserver: {
            host: '127.0.0.1',
            delayTime: 1,
            script: './src/server/app.js',
            watch: ['./src/server']
        },
        browserReloadDelay: 1000,
        
        /**
        HTML testing spec runner
        */
        specRunner: tests + specRunnerFile,
        specRunnerFile: tests + specRunnerFile,
		testlibraries: [
			'node_modules/mocha/mocha.js',
			'node_modules/chai/chai.js',
			'node_modules/mocha-clean/index.js',
			'node_modules/sinon-chai/lib/sinon-chai.js',
			'node_modules/qunit/qunit/qunit.js',
		],
		specs: tests + 'app/**/*.spec.js',

    };
    config.getWiredepDefaultOptions = function () {
        return {
            bower: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
    };

    config.getWebserverOptions = function (isDev) {
        var options     = config.webserver;
        options.env = {
                'PORT': 7203,
                'NODE_ENV': isDev ? 'dev' : 'build'
            };
        return options;
    };

    config.karma = getKarmaOptions();
    return config;

    function getKarmaOptions() {
        var options = {
            files: [].concat(
                bowerFiles,
                config.specHelpers,
                clientApp + '**/*.module.js',
                clientApp + '**/*.js',
                config.temp + config.templateCache.file,
                config.serverIntegrationSpecs,
                tests + 'app/**/*.spec.js'
            ),
            exclude: [
                clientAssets + '**/*.js',
            ],
            coverage: {
                dir: report + 'coverage',
                reporters: [
                    {type: 'html', subdir: 'report-html'},
                    {type: 'lcov', subdir: 'report-lcov'},
                    {type: 'text-summary'}
                ]
            },
            prepocessors: []
        };
        options.prepocessors[client + '**/!(.spec)+(*.js)'] = ['coverage'];
        return options;
    }
};

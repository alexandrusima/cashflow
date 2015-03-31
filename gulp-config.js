module.exports = function () {
    var client = './src/client/';
    var clientApp    = client + 'app/';
    var clientAssets = client + 'assets/';
    var lib          = client + 'lib/';
    var build        = './build/';
    var buildAssets  = build + 'assets/';
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
            client + 'app/js/cashFlowApp.js',
            client + 'app/js/services/gravatar.js',
            client + 'app/js/controllers/sidebarController.js',
            client + 'app/js/directives/sidebarDirective.js',
            client + 'app/js/directives/toogle.js',
            client + 'app/js/directives/widgets.js',
            client + 'app/js/directives/widgets/profile.js',
            client + 'lib/modal-confirm/confirm-modal.controller.js',
        ],
        jsPath : [
            client + '**/*.js',
            '!' + client + '/**/*.min.js',
            '!' + client + '/assets/**/*.js',
            '!' + client + '/bower_components/**/*.js',
            '!**/gravatar.js'
        ],
        less: client + '/assets/less/main.less',
        temp: client + '.tmp/',
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'cashFlowApp',
                standAlone: false,
                root: client
            }
        },
        webserver: {
            host: '127.0.0.1',
            delayTime: 1,
            script: './src/server/app.js',
            watch: ['./src/server']
        },
        browserReloadDelay: 1000
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
    return config;
};

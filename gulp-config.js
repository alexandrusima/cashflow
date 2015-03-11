module.exports = function () {
    var client = './src/';
    var clientApp    = client + 'app/';
    var clientAssets = client + 'assets/';
    var lib          = client + 'lib/';
    var config = {
        temp: client + '.tmp/',
        jsPath : [
            client + '**/*.js',
            '!' + client + '/**/*.min.js',
            '!' + client + '/assets/**/*.js',
            '!' + client + '/bower_components/**/*.js',
            '!**/gravatar.js'
            ],
        less: client + '/assets/less/main.less',
        css: [
            clientAssets + 'css/**/*.css*',
            '!' + clientAssets + 'css/**/*.min.css*'

        ],
        bower: {
            json: require('./bower.json'),
            directory: client + 'bower_components',
            ignorePaths: '../..'
        },
        index: './index.html',
        indexDest: './',
        client: client,
        js: [
                client + 'assets/js/charts/jquery.flot.animator.js',
                client + 'assets/js/sparkline.min.js',
                client + 'assets/js/charts.js',
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
        ]
    };
    config.getWiredepDefaultOptions = function () {
        return {
            bower: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };
    };
    return config;
};

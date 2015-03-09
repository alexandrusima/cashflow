module.exports = function () {
    var client = './public/';
    var config = {
        temp: client + ".tmp/",
        jsPath : [ 
            client + "**/*.js",
            "!"+ client +"/**/*.min.js",
            "!"+ client +"/assets/**/*.js",
            "!"+ client +"/bower_components/**/*.js",
            "!**/gravatar.js"
            ],
        less: "public/assets/less/main.less",
        allCss: []
    }
    return config;
};
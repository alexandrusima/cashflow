(function () {
    angular.module('cashFlowApp').
        directive('sidebar', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'src/client/templates/directives/sidebar.html',
        };
    });
})();

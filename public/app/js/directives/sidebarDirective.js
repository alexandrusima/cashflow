(function () {
    angular.module('cashFlowApp').
        directive('sidebar', function () {
        return {
            restrict: 'E',
            transclude: true, 
            replace: true,
            templateUrl: 'templates/directives/sidebar.html',
        };
    });
})();
(function () {
    angular.module('cashFlowApp').directive('widgets', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'templates/directives/widgets.html'
        };
    });
})();

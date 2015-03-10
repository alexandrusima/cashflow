(function () {
    angular.module('cashFlowApp').directive('widgets', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'src/templates/directives/widgets.html'
        };
    });
})();

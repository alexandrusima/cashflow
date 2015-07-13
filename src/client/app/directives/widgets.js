(function () {
    angular.module('cashFlowApp').directive('widgets', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'src/client/templates/directives/widgets.html'
        };
    });
})();

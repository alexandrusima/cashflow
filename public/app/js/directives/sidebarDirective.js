(function () {
    angular.module('cashFlowApp').
        directive('sidebarMenu', function () {
        return {
            restrict: 'E',
            transclude: true, 
            replace: true,
            templateUrl: 'templates/directives/sidebar.html',
            priority: 2, 
            scope: {
                toogle: '@'
            },
            controller: 'sidebarController',
        };
    });
})();
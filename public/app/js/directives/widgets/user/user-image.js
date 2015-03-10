(function () {
    angular.module('cashFlowApp').directive('userImage', function () {
        return {
            restrict: 'E',
            transclude: false,
            replace: true,
            templateUrl: 'templates/directives/user/user-image.html'
        };
    });
})();

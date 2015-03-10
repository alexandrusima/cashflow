(function () {
    angular.module('cashFlowApp').directive('userImage', function () {
        return {
            restrict: 'E',
            transclude: false,
            replace: true,
            templateUrl: 'src/templates/directives/user/user-image.html'
        };
    });
})();

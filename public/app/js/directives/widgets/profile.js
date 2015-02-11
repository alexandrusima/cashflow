    angular.module('cashFlowApp').controller('profileWidgetController', ['$scope', 'gravatarUrlBuilder', function ($scope, gravatarUrlBuilder) {
        $scope.user = { 
            firstName: 'Alexandru',
            lastName: 'Sima',
            email: 'alexandru.sima20@gmail.com' 
        };
        $scope.getGravatarImage = function (email) {
            return gravatarUrlBuilder.getGravatarImage(email);
        }
    }]);


    angular.module('cashFlowApp').directive('profileWidget', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'templates/directives/widgets/profileWidget.html',
            controller: 'profileWidgetController',

        };
    });

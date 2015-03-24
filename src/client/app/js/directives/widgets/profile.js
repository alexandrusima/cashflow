(function() {
    angular.module('cashFlowApp').controller('profileWidgetController', profileWidgetController);

    profileWidgetController.$inject = ['$scope', '$modal', 'gravatarUrlBuilder'];
    function profileWidgetController($scope, $modal, gravatarUrlBuilder) {
        var vm = this;
        vm.user = {
            firstName: 'Alexandru',
            lastName: 'Sima',
            email: 'alexandru.sima20@gmail.com'
        };
        vm.menu = {
            isopen: false,
            toogle: function () {
                vm.menu.isopen = !vm.menu.isopen;
            }
        };
        vm.getGravatarImage = function (email) {
            return gravatarUrlBuilder.getGravatarImage(email);
        };
        vm.confirm = function () {
            var modalInstance = $modal.open({
                templateUrl: 'src/client/templates/directives/confirm-modal.html',
                controller: 'ConfirmModalController',
                controllerAs: 'vm',
                resolve: {
                    data: function() {
                        return {
                            title: 'Delete',
                            message: 'Are you sure?!',
                            buttons: ['OK', 'Cancel']
                        };
                    }
                },
                windowClass: 'huge'
            });
        };
    }

    angular.module('cashFlowApp').directive('profileWidget', function () {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'src/client/templates/directives/widgets/profileWidget.html',
            controller: 'profileWidgetController',
            controllerAs: 'vm'
        };
    });
})();

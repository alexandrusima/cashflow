(function (){
    angular.module('cashFlowApp').directive('sidebarToggle', function () {
        return {
            restrict: 'A',
            scope: {
                toggle: '@',
            },
            link: function (scope, iElement, iAttrs) {
                iElement.on('click', function (e) {
                    var el = angular.element('#' + scope.toggle);
                    el.toggleClass('toggled');
                    angular.element('html').toggleClass('menu-active');
                });
            }
        };
    });
})();

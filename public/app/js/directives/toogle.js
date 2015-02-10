(function () {
    angular.module('cashFlowApp').directive('sidebarToggle', function () {
        return {
            restrict: 'A',
            scope: {
                toogle: '@toogle'
            },
            link: function (scope, iElement, iAttrs) {
                iElement.on('click', function (e) {
                    var el = angular.element('#'+scope.toogle);
                    el.toggleClass('toggled');
                    // angular.element('html').toggleClass('menu-active');
                    
                });
                
            }
        };
    });
})();
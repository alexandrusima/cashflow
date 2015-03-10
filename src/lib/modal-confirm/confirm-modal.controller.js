(function () {
    'use strict';

    angular.module('cashFlowApp').controller('ConfirmModalController', ConfirmModalController);
    ConfirmModalController.$inject = ['$modalInstance', 'data'];

    function ConfirmModalController($modalInstance, data) {
        var vm = this;
        vm.cancel = cancel;
        vm.ok = ok;
        vm.properties = data;

        function cancel() {
            $modalInstance.dismiss();
        }

        function ok() {
            $modalInstance.close();
        }
    }
})();

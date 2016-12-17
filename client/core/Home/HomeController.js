'use strict';
RegistrationModule = angular.module('RegistrationModule');
RegistrationModule.controller('HomeController', ['mySocket', '$scope', '$alert', function(mySocket, $scope, $alert) {
    $scope.$on('socket:error', function (ev, data) {
        console.log('test');
    });

    var showError = false;

    var alerts = {};

    alerts.errorConnect = $alert({title: 'Error 404:', content: 'Unable to connect to server. Please email usgit@wasmun.org immediately.', placement: 'top', type: 'danger', show: false});
    alerts.successConnect = $alert({title: 'Connection Verified:', content: 'Server uplink has been established.', placement: 'top', type: 'success', show: false, duration: 5});

    mySocket.on('connect_error', function() {
        alerts.successConnect.hide();
        alerts.errorConnect.show();
    });

    mySocket.on('connect', function() {
        console.log('socket connected');
        alerts.errorConnect.hide();
        alerts.successConnect.show();
        mySocket.emit('getMatrix');
    });

    $scope.matrix = {};
    mySocket.on('sendMatrix', function(data) {
        $scope.matrix = JSON.parse(data);
        console.log($scope.matrix);
    });

    // Form
    $('#form').validate(
        {
            rules: {
                schoolName: {
                    minlength: 2,
                    required: true
                },
                adviserEmail: {
                    required: true,
                    email: true
                }
            },
            highlight: function(element) {
                $(element).closest('.control-group').removeClass('success').addClass('has-error');
            },
            success: function(element) {
                element = element.closest('.control-group');
                console.log(element);
                if (element.hasClass('has-error')) {
                    element.addClass('valid').removeClass('has-error').addClass('has-success');
                }
            }
        });

    $scope.registration = {};

    $scope.submit = function(data) {
        $scope.registration = angular.copy(data);

        mySocket.emit('sendRegistration', $scope.registration);
    };

    $scope.clear = function(form) {
        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.data = angular.copy($scope.registration);
    };
}]);
'use strict';

app.controller('ResetCtrl', ['$scope', '$auth', '$http', '$templateCache', '$state', '$stateParams',
  function($scope, $auth, $http, $templateCache, $state, $stateParams) {

    $scope.reset = function(email) {
      $http.get('/api/users/reset/' + email).then(function(response) {
        $('h4.error').text('We have sent you a new password on your e-mail. Please check your mailbox.');
        $('div#show-error').modal();
        $state.go('storefront');
      }, function(err) {
        if (err.status === 401) {
          $('h4.error').text('E-mail is not registered.');
          $('div#show-error').modal();
        }
        else {
          $('h4.error').text('We were not able to reset your account.');
          $('div#show-error').modal();
        }
      });
    }

    $scope.reset_p = function(phone) {
      phone = '+' + phone.replace(/\D/g,'');
      $http.get('/api/users/reset-p/' + phone).then(function(response) {
        $('h4.error').text('We have sent you a new password on your mobile. Please check your phone messages.');
        $('div#show-error').modal();
        $state.go('storefront');
      }, function(err) {
        if (err.status === 401) {
          $('h4.error').text('The phone is not registered.');
          $('div#show-error').modal();
        }
        else {
          $('h4.error').text('We were not able to reset your account.');
          $('div#show-error').modal();
        }
      });
    }
}]);


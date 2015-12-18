'use strict';

app.controller('ActivCtrl', ['$scope', '$auth', '$http', '$templateCache', '$state', '$stateParams',
  function($scope, $auth, $http, $templateCache, $state, $stateParams) {

    $scope.init = function() {
      if ($stateParams.token) {
        $auth.setToken($stateParams.token);

        $http.post('/api/users/activate').then(function(response) {
          $('h4.error').text('We have activated your account.');
          $('div#show-error').modal();
          $state.go('storefront');
        }, function(err) {
          if (err.status === 401) {
            $('h4.error').text('Your activation token is invalid.');
            $('div#show-error').modal();
          }
          else {
            $('h4.error').text('We were not able to activate your account.');
            $('div#show-error').modal();
          }
        });
      }
    }

    $scope.send = function(email) {
      $http.get('/api/users/activate/' + email).then(function(response) {
        $('h4.error').text('We have sent you another activation e-mail. Please check your mailbox.');
        $('div#show-error').modal();
        $state.go('storefront');
      }, function(err) {
        if (err.status === 403) {
          $('h4.error').text('User is already activated.');
          $('div#show-error').modal();
        }
        else if (err.status === 401) {
          $('h4.error').text('E-mail is not registered.');
          $('div#show-error').modal();
        }
        else {
          $('h4.error').text('We were not able to activate your account.');
          $('div#show-error').modal();
        }
      });
    }
}]);


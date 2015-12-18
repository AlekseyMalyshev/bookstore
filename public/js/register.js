'use strict';

app.controller('RegCtrl', ['$scope', '$http', '$state',
  function($scope, $http, $state) {

    $scope.user = {};

    $scope.register = function(valid) {

      if (!valid) {
        $('h4.error').text('Passwords do not match.');
        $('div#show-error').modal();
        return;
      }

      $http.post('/api/users/register', $scope.user).then(function(response) {
        $('h4.error').text('Congratulations, you have registered as a Book Store customer.');
        $('div#show-error').modal();
        $state.go('login');
      }, function(err) {
        var text;
        if (err.status === 409) {
          text = 'The e-mail is already used. If you have registered and forgot your password, please proceed to password reset.';
          $('h4.error').text(text);
          $('div#show-error').modal();
        }
        else {
          console.error(err);
          text = 'We were not able to register you at this time. Please try again later.';
          $('h4.error').text(text);
          $('div#show-error').modal();
        }
      });
    };
  }]);

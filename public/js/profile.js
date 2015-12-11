'use strict';

app.controller('ProfCtrl', ['$scope', '$http',
  function($scope, $http) {

    $scope.init = function() {
      $http.get('/api/users/me').then(function(response) {
        $scope.user = response.data;
      }, function(err) {
        if (err.status !== 401) {
          console.error(err);
        }
      });
    };

    $scope.save = function() {
      $http.put('/api/users/me', $scope.user).then(function(response) {
        $('h4.error').text('Profile has been saved.');
        $('div#show-error').modal();
      }, function(err) {
        var text;
        if (err.status === 409) {
          text = 'The e-mail is already used. If you have registered and forgot your password, please proceed to password reset.';
          $('h4.error').text(text);
          $('div#show-error').modal();
        }
        else {
          console.error(err);
          text = 'We were not able to update your details at this time. Please try again later.';
          $('h4.error').text(text);
          $('div#show-error').modal();
        }
      });
    };
  }]);

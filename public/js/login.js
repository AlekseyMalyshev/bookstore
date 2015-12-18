'use strict';

app.controller('LoginCtrl', ['$scope', '$auth', '$http', '$templateCache', '$state', '$stateParams',
  function($scope, $auth, $http, $templateCache, $state, $stateParams) {

    $scope.user = {};

    $scope.login = function() {
      $auth.login($scope.user, { url: '/api/users/authenticate' })
        .then(function(response) {
          combineCarts(response.data.user);
          $state.go('storefront');
        })
        .catch(function(err) {
          var text;
          if (err.status === 403) {
            text = 'Your account is not yeat active. Please check your e-mail or resend confirmation.';
          }
          else if (err.status === 401) {
            text = 'Authentication failed, try again.';
          }
          else {
            text = 'We we not able to log you in at this time.';
          }
          $('h4.error').text(text);
          $('div#show-error').modal();
        });
    }

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider)
        .then(function(response) {
          combineCarts(response.data.user);
          $state.go('storefront');
        })
        .catch(function(err) {
          console.log('auth error: ', err)
        });
    };

    var combineCarts = function(user) {
      if (user) {
        var cart = JSON.parse(localStorage.cartContent || '[]');
        cart.forEach(function(book) {
          user.cart.push(book._id);
        });
        $http.put('/api/users/me', user).then(function(response) {
        }, function(err) {
          console.log('Could not save user');
        });
      }
    }
  }
]);


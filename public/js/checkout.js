'use strict';

app.controller('CheckoutCtrl', ['$scope', '$state', '$http', '$auth',
  function($scope, $state, $http, $auth) {

    $scope.total

    $scope.init = function() {
      if ($auth.isAuthenticated()) {
        $http.get('/api/users/me').then(function(response) {
          $scope.cart = response.data.cart;
          $scope.total = $scope.cart.reduce(function(total, book) { return total + book.price; }, 0);
        }, function(err) {
          if (err.status !== 401) {
            console.error(err);
          }
        });
      }
      else {
        $state.go('login');
      }
    };

    $scope.payNow = function(tokenObj) {
      $http.post('/api/checkout', {
        token: tokenObj,
        cart: $scope.cart
      })
      .then(function(res) {
        $scope.cart = [];
        localStorage.cartContent = JSON.stringify('[]');
        $('h4.error').text('Your payment has been processed. Thank you for placing the order.');
        $('div#show-error').modal();
        $state.go('storefront');
      }, function(err) {
        $('h4.error').text('There has been an error trying to process your order. You may need to contact your bank for further information.');
        $('div#show-error').modal();
      })
    };

  }]);

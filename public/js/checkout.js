'use strict';

app.controller('CheckoutCtrl', ['$scope', '$state', '$http', '$auth',
  function($scope, $state, $http, $auth) {

    $scope.total

    var userCart = [];

    function fixCart(cart) {
      userCart = cart;
      cart.sort(function(b1, b2) {
        if (b1._id < b2._id) {
          return -1;
        }
        else if (b1._id > b2._id) {
          return 1;
        }
        else {
          return 0;
        }
      });
      var prev;
      $scope.cart = cart.filter(function(book) {
        if (prev && book._id === prev._id) {
          prev.qty = prev.qty + 1;
          return false;
        }
        else {
          prev = book;
          prev.qty = 1;
          return true;
        }
      });
    }

    $scope.init = function() {
      if ($auth.isAuthenticated()) {
        $http.get('/api/users/me').then(function(response) {
          fixCart(response.data.cart);
          $scope.total = userCart.reduce(function(total, book) { return total + book.price; }, 0);
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

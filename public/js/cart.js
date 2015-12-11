'use strict';

app.controller('CartCtrl', ['$scope', '$http', '$state', '$auth',
  function($scope, $http, $state, $auth) {

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
        fixCart(JSON.parse(localStorage.cartContent || '[]'));
        $scope.total = userCart.reduce(function(total, book) { return total + book.price; }, 0);
      }
    };

    $scope.remove = function(bookId) {
      if ($auth.isAuthenticated()) {
        $http.delete('/api/users/remove-from-cart/' + bookId)
          .then(function(response) {
            fixCart(response.data.cart);
            $scope.total = userCart.reduce(function(total, book) { return total + book.price; }, 0);
          }, function(err) {
            if (err.status !== 401) {
              console.error(err);
            }
          });
      }
      else {
        for (var i = 0; i < userCart.length; i++) {
          if (userCart[i]._id === bookId) {
            userCart.splice(i, 1);
            break;
          }
        };
        localStorage.cartContent = JSON.stringify(userCart);
        $scope.total = userCart.reduce(function(total, book) { return total + book.price; }, 0);
      }
    }

  }]);

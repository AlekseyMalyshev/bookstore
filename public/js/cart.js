'use strict';

app.controller('CartCtrl', ['$scope', '$http', '$state', '$auth',
  function($scope, $http, $state, $auth) {

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
        $scope.cart = JSON.parse(localStorage.cartContent || '[]');
        $scope.total = $scope.cart.reduce(function(total, book) { return total + book.price; }, 0);
      }
    };

    $scope.remove = function(bookId) {
      if ($auth.isAuthenticated()) {
        $http.delete('/api/users/remove-from-cart/' + bookId)
          .then(function(response) {
            $scope.cart = response.data.cart;
            $scope.total = $scope.cart.reduce(function(total, book) { return total + book.price; }, 0);
          }, function(err) {
            if (err.status !== 401) {
              console.error(err);
            }
          });
      }
      else {
        for (var i = 0; i < $scope.cart.length; i++) {
          if ($scope.cart[i]._id === bookId) {
            $scope.cart.splice(i, 1);
            break;
          }
        };
        localStorage.cartContent = JSON.stringify($scope.cart);
        $scope.total = $scope.cart.reduce(function(total, book) { return total + book.price; }, 0);
      }
    }

  }]);

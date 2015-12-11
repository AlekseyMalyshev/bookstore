'use strict';

app.controller('StorefrontCtrl', ['$scope', '$http', '$state', '$auth',
  function($scope, $http, $state, $auth) {

    $scope.init = function() {
      $http.get('/api/books').then(function(response) {
        $scope.books = response.data;
      }, function(err) {
        if (err.status !== 401) {
          console.error(err);
        }
      });
    };

    $scope.addToCart = function(book) {
      if ($auth.isAuthenticated()) {
        $http.put('/api/users/add-to-cart/' + book._id)
          .then(function(response) {
            $scope.cart = response.data.cart;
            console.log($scope.cart);
          }, function(err) {
            if (err.status !== 401) {
              console.error(err);
            }
          });
      }
      else {
        var cart = JSON.parse(localStorage.cartContent || '[]');
        cart.push(book);
        localStorage.cartContent = JSON.stringify(cart);
      }
    }
  }]);

app.filter('books', function() {
  return function(input, size, current, waiting) {
    input = input || [];
    return input.filter(function(v) {
      return v.size === size &&
       (!current || v.state === 1 || v.state === 2) &&
       (!waiting || v.state === 0);
    });
  };
})

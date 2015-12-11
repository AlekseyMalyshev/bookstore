'use strict';

app.controller('NavbarCtrl', ['$scope', '$auth', '$templateCache', '$state', '$stateParams',
  function($scope, $auth, $templateCache, $state, $stateParams) {

    $scope.isLogged = function() {
      return $auth.isAuthenticated();
    }

    $scope.logout = function() {
      $templateCache.removeAll();
      $state.go('login', $stateParams, {
        reload: true,
        inherit: false,
        notify: true
      });
      $auth.logout();
    }

  }
]);

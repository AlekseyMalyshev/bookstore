'use strict';

var app = angular.module('Store', ['satellizer', 'btford.socket-io', 'ui.router', 'stripe.checkout']);

app.config(function($stateProvider, $urlRouterProvider, $authProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('storefront', {
      url: '/',
      templateUrl: 'partials/storefront',
      controller: 'StorefrontCtrl'
    })
    .state('cart', {
      url: '/cart',
      templateUrl: 'partials/cart',
      controller: 'CartCtrl'
    })
    .state('reset', {
      url: '/reset',
      templateUrl: 'partials/reset',
      controller: 'ResetCtrl'
    })
    .state('checkout', {
      url: '/checkout/:id',
      templateUrl: 'partials/checkout',
      controller: 'CheckoutCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: 'partials/login',
      controller: 'LoginCtrl'
    })
    .state('activate', {
      url: '/activate',
      templateUrl: 'partials/activate',
      controller: 'ActivCtrl'
    })
    .state('activate2', {
      url: '/activate/:token',
      templateUrl: 'partials/activate',
      controller: 'ActivCtrl'
    })
    .state('orders', {
      url: '/orders',
      templateUrl: 'partials/orders',
      controller: 'OrdersCtrl'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'partials/profile',
      controller: 'ProfCtrl'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'partials/register',
      controller: 'RegCtrl'
    });

  $authProvider.facebook({
    clientId: '924337914326712'
  });

  $authProvider.linkedin({
    clientId: '77reigersixrfn'
  });

  $authProvider.twitter({
    clientId: 'T4Q5ltrRgY0svVhr56RCAbc1c'
  });
}).
run(['$rootScope', '$auth', '$state', function($rootScope, $auth, $state) {

  $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams) {
      if (toState.name === 'checkout' ||
          toState.name === 'orders') {
        if (!$auth.isAuthenticated()) {
          event.preventDefault();
          $state.go('login');
        }
      }
    });
}]).factory('socket', function (socketFactory) {
  return socketFactory();
});

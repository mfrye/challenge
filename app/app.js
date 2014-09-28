(function(){
  'use strict';

  angular.module('challenge', [
    'ngRoute',
    'challenge-main',
    'templates',

    // 3rd party
    'famous.angular'
  ])
    .config(function ($routeProvider) {
      $routeProvider
        .otherwise({
          redirectTo: '/'
        });
    });
    
})();
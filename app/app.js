(function () {
  'use strict';

  angular
    .module('app', [ 'ngRoute', 'ui.bootstrap' ])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'app/views/home.html',
          controller: 'HomeController',
          controllerAs: 'home'
        });
    });
})();

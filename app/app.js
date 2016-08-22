(function () {
  'use strict';

  angular
    .module('app', [ 'ngRoute', 'ui.bootstrap', 'nvd3'])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'app/views/home.html',
          controller: 'HomeController',
          controllerAs: 'home'
        });
    });
})();

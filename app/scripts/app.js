'use strict';

angular.module('twaAutocompletionApp', ['ui.bootstrap'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/carousel',{
        templateUrl: 'views/carousel.html',
        controller: 'CarouselDemoCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

'use strict';

angular.module('twaAutocompletionApp', ['ngResource','ui.bootstrap'])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .when('/about',{
    templateUrl: 'views/about.html',
    controller: 'AboutCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
})
.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }])
.run(function($rootScope, $location, $anchorScroll, $routeParams) {
  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    $location.hash($routeParams.scrollTo);
    $anchorScroll();  
  });
});

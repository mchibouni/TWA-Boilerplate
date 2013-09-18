'use strict';

angular.module('twaAutocompletionApp', ['ui','ngCookies','ngResource','ui.bootstrap','BlockUI','stellar.directives','timer'])
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
  .when('/contact', {
    templateUrl: 'views/contact.html',
    controller: 'MediaCtrl'
  })
  .when('/jury', {
    templateUrl: 'views/jury.html',
    controller: 'JuryCtrl'
  })
  .when('/media', {
    templateUrl: 'views/media.html',
    controller: 'MediaCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
})
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.useXDomain = true;
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])
.directive('uiScroll',['ui.config', function(uiConfig) {
  'use strict';
  uiConfig.uiScrollr = uiConfig.uiSCroll || {}; 
  return {
    restrict: 'A',
    transclude: true,
    scope: {
      values: '=ngModel',
    },
    template: '<div class="scroll-pane"><div ng-transclude></div></div>',
    link:function(scope,elm,$attrs,uiEvent ) {

     var expression,
     options = {
     };
     if ($attrs.uiScroll) {
      expression = scope.$eval($attrs.uiScroll);
    } else {
      expression = {};
    }

             //Set the options from the directive's configuration
             angular.extend(options, uiConfig.uiScroll, expression);
             console.log(options);
             elm.jScrollPane(options);

           },
           replace: true

         }
       }]).
run(function($rootScope, $location, $anchorScroll, $routeParams) {
  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    $location.hash($routeParams.scrollTo);
    $anchorScroll();  
    $rootScope.location = $location;
  });
});

'use strict';

angular.module('twaAutocompletionApp', ['ui','ezfb','ngCookies','ngResource','ui.bootstrap','BlockUI','stellar.directives','timer'])
.config(function ($routeProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'views/main.html'
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
  .when('/soirée', {
    templateUrl: 'views/party.html',
    controller: 'PartyCtrl'
  })
  .when('/media', {
    templateUrl: 'views/media.html',
    controller: 'MediaCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
})
.config(function ($FBProvider) {
  $FBProvider.setInitParams({
    // This is my FB app id for plunker demo app
    appId: '452487374865553'
  });  
})
.config(['$httpProvider', function($httpProvider) {
//  $httpProvider.defaults.useXDomain = true;
//  delete $httpProvider.defaults.headers.common['X-Requested-With'];
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
run(function($window, $FB, $rootScope, $location, $anchorScroll, $routeParams) {

  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    $rootScope.routeList = ['Home','About','Media','Jury','Soirée','Contact'];
    $location.hash($routeParams.scrollTo);
    $anchorScroll();  
    $rootScope.initViewIndex = function(){     
     /* angular.forEach(this.routeList,function(v,k){
       if (angular.lowercase(v) === $location.path().replace('/',''))
        {
          console.warn("MATCH" + angular.lowercase(v));
          return k + 1 ; 
        }
      })
      return 1;
      */
      return this.routeList.indexOf(_.find(this.routeList,function(elt){
        if ($location.path() === '/') return 'home';
        return angular.lowercase(elt) ===  $location.path().replace('/','');
      })) + 1 ;
    }

    $rootScope.invokeDialog = function(item){
      $FB.ui(
      {
        show_error : true,  
        method: 'feed',
      name: 'Tunisiana Web Awards 2013', // name of the product or content you want to share
      link: 'https://tunisiana.web.awards:9000', // link back to the product or content you are sharing
      picture: 'http://fbrell.com/f8.jpg', // path to an image you would like to share with this content
      caption: 'Phase de soumissions : ', // caption
      description: "J'ai soumis le candidat" + item.name // description of your product or content
    },
    function(response) {
      if (response && response.post_id) {
        alert('Post was published.');
      } else {
        alert('Post was not published.');
      }
    }
    );
    }


    $rootScope.viewIndex = $rootScope.initViewIndex();
    console.warn("VIEWINDEX" + $rootScope.viewIndex);
    $rootScope.location = $location;
  });
});

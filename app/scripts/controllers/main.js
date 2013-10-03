/*Author Mehdi Chibouni
  TWA 2013 - Built w/ AngularJS 
  */


  'use strict';

  var app = angular.module('twaAutocompletionApp')
  .service('authStrategyService',[function(){

    return [
    {
      provider:"facebook", 
      regex: /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/,
      RestNameURI : function(name){
        return ('http://graph.facebook.com/'+name+'?fields=name');
      },
      RestPictureURI: function(name){
        return ('http://graph.facebook.com/'+name+'/picture?type=normal');
      }
    }
    ];
  }])
  .service('processURLService', ['$resource','authStrategyService', '$http', function($resource,authStrategyService,$http){
    return { 

      submitData : function (url,hashtags, metadata, imgurl, count) {
        $resource("http://www.kanalabs.com\\:8080/twa/check/:url").get({url:url},function(data){
          if ( data.callback === true ) {
            console.warn("in there");

            $http.post('http://www.kanalabs.com:8080/wines',{"url":url,"name":metadata,"hashtags":hashtags, imguri: imgurl, "count": 1 }).success(function(data){
              $('<div/>',{class:"alert"}).addClass('alert-success').html("Votre soumission a été reçue, Merci d'avoir participé !")
              .css({
                'z-index' : '9999',
                'text-align' : 'center',
                'opacity' : '1',
                'position' : 'fixed',
                'display' : 'none',
                'width' : '60%',
                'right' : '20%',
                'top' : '10%'
              })
              .appendTo($('body')).fadeIn('fast',function(){
                $(this).fadeOut(6000);
              });
              console.log("success");
            });
          }
          else {
            $('<div/>',{class:"alert"}).addClass('alert-danger').html('Vous avez déjà soumis cette URL')
            .css({
              'z-index' : '9999',
              'text-align' : 'center',
              'opacity' : '1',
              'position' : 'fixed',
              'display' : 'none',
              'width' : '60%',
              'right' : '20%',
              'top' : '10%'
            })
            .appendTo($('body')).fadeIn('fast',function(){
              $(this).fadeOut(5000);
            })
          }
        });
} 
}
}])
.service('submitDataService', ['$rootScope','authStrategyService','processURLService','$http','$resource',function ($rootScope,authStrategyService,processURLService,$http,$resource) {
  return {  processURL : function (url, hashes) {

    _.each(authStrategyService,function(element){
      console.warn(element);
      if (element.regex.test(url)){
        console.warn("PROVIDER FOUND " + element.provider);
        $http.get(element.RestNameURI(url.match(element.regex)[1])).error(function(){
          alert("Ce profile n'existe pas, veuillez saisir une URL Facebook Valide");
          console.warn("ERROR!");
        })
        .then(function(response){
          console.warn("ACCESSING PROVIDER FIRST TIME");
          processURLService.submitData(url,hashes,response.data.name,element.RestPictureURI(url.match(element.regex)[1]));
        });
      }
      else {
        $resource("http://www.kanalabs.com\\:8080/meta/:url").get({url:url},function(response){
          console.warn("ACCESSING PROVIDER SECOND TIME");
          processURLService.submitData(url,hashes,response.profile,response.image);
        })
      }
    });
  }
}
}])
.service('navMenuRawData', [function () {
  this.navHash = function(){
    return [
    {  name:"HOME", state : true },
    {  name:"ABOUT", state : false },
    {  name:"MEDIA", state : false },
    {  name:"JURY", state : false },
    {  name:"SOIRÉE", state : false },
    {  name:"CONTACT", state : false },
    ];
  }
}])
.service('twaHashTagService',[function(){
  this.getHashList = function() {
    return [
    {name:'#musique',state:false},
    {name:'#politique',state:false},
    {name:'#geek',state:false} , 
    {name:'#lifestyle',state:false},
    {name:'#tanbir',state:false},
    {name:'#caricature',state:false},
    {name:'#art',state:false},
    {name:'#blog',state:false},
    {name:'#siteweb',state:false},
    {name:'#satire',state:false},
    {name:'#sport',state:false},
    {name:'#photo',state:false},
    {name:'#video',state:false},
    {name:'#redaction',state:false},
    {name:'#humour',state:false},
    {name:'#mode',state:false},
    {name:'#startup',state:false},
    {name:'#citoyen',state:false},
    {name:'+ Proposez un hashtag',state:false},
    ];
  }
}])
.service('twaCategoryService', [function () {
  this.getCategoryList = function () {
    return [
    {name:'#sport',state:false},
    {name:'#photo',state:false},
    {name:'#video',state:false},
    {name:'#rédaction',state:false},
    {name:'#humour',state:false},
    {name:'#mode',state:false},
    {name:'#wtf',state:false},
    {name:'#même',state:false},
    {name:'#citoyen',state:false}
    ]
  }
}])
.directive('ngSubmitDone', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      iElement.on('click',function(){
        iElement.fadeOut('fast',function(){
          $("#share-area").hide().fadeIn();
        })
      });
    }
  };
}])
.directive('ngFade', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      iElement.hide().fadeIn('fast');
    }
  };
}])
.directive('ngExpand', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      iElement.find('button').on('click',function(){
        //iElement.find('hr').animate({'margin-top':'6%'},200,'swing');
        iElement.animate({'height':'47%'},200,'swing'); 
        iElement.find('.obstrusive-shr').fadeIn();       
      })
    }
  };
}])
.directive('ngSmooth', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      iElement.css({'text-shadow':'0 0 1px rgba(0,0,0,0.3)'});
    }
  };
}])
.directive('ngOverlay', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      console.warn(iElement.data('index'));
    }
  };
}])
.directive('ngFaulty', [function(){
  // Runs during compile
  return {
    restrict: 'A',
    // name: '',
    // priority: 1,
    // terminal: true,
    // scope: {}, // {} = isolate, true = child, false/undefined = no change
    // cont­rol­ler: function($scope, $element, $attrs, $transclue) {},
    // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
    // restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
    // template: '',
    // templateUrl: '',
    // replace: true,
    // transclude: true,
    // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
    link: function($scope, iElm, iAttrs, controller) {
      iElm.error(function(){
        iElm.attr('src',iElm.css('background-image').match(/\((.*)\)/)[1]);
        iElm.css('background-image','none');
      })
    }
  };
}])
.directive('ngMotivic', [function () {
  return {
    link: function (scope, element, iAttrs) {
      element.parent().bind('mouseenter', function() {
        element.addClass('rotate-motive');
        console.warn("enter");
      });
      element.parent().bind('mouseleave', function() {
        element.removeClass('rotate-motive');
        console.warn("leave");
      });      
    }
  };
}])
.directive('plax', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      iElement.plaxify().fadeIn();
      $.plax.enable();
    }
  };
}])
.factory('twaRestAPI', ['$resource','$http', function($resource,$http)
{
  return {
    retrieveAll : function() {
      return $resource('http://www.kanalabs.com\\:8080/wines',{
        query: {
          method:'GET',          
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          isArray:true,
        }
      });
    },
    addHashTag : function(hashtag){
      $http.post('http://www.kanalabs.com:8080/hashtags',{"hashtag":hashtag}).success(function(data){
        console.log("success");
      });
    },
    retrieveAllHashTags : function() {
      return $resource('http://www.kanalabs.com\\:8080/hashtags',{
        query: {
          method:'GET',          
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          isArray:true,
        }
      });
    },
    postEntry: function(){
      return $resource('http://www.kanalabs.com\\:8080/wines',{
        update: {
          method:'POST'          
        }
      });      
    },
  }
}])
.controller('PartyCtrl', ['$scope', function ($scope) {
  $scope.presCollection = [
  {name:"Nejib Belkadhi",meta:"Présentateur"},
  {name:"Kenza Fourati",meta:"Model"}
  ];
  $scope.juryCollection = [
  {name:"DJ anonimus", meta: "DJ"},
  {name: "Bendir man", meta: "Chanteur"},
  {name: "Si Lemhaf", meta: "Artist"},
  {name: "Dub mel kabba", meta: "Music band"}
  ];
}])
.controller('JuryCtrl', ['$scope', function ($scope) {
  $scope.juryCollection = [
  {name:"Denzel Washington", meta: "Actor"},
  {name: "John Doe", meta: "Who cares"},
  {name: "Sean Connery", meta: "Photographer"},
  {name: "Johnny Depp", meta: "Blogger"},
  {name: "Will Smith", meta: "Designer"},
  {name: "Catherine Zeta Jones", meta: "Journaliste"}
  ];
}])
.controller('ContactCtrl', function ($scope) {
  $scope.timerRunning = true;

  $scope.startTimer = function (){
    $scope.$broadcast('timer-start');
    $scope.timerRunning = true;
  };

  $scope.stopTimer = function (){
    $scope.$broadcast('timer-stop');
    $scope.timerRunning = false;
  };
})
.controller('MainCtrl', function ($http,$q,$scope, $cookies, $document, $blockUI, $route, $routeParams, $location, navMenuRawData,twaRestAPI, twaCategoryService) {

  $scope.hashtags = twaRestAPI.retrieveAllHashTags().query(null);




  $scope.$route = $route;
  $scope.$location = $location;


  $scope.navHash = navMenuRawData.navHash();
  $scope.navCategoryList = twaCategoryService.getCategoryList();


  $scope.lowercase = angular.lowercase;

  var blockUI ;  


  $scope.invokeNag = function() {
    console.warn("In there");
    blockUI = $blockUI.createBlockUI({

      // Angular Gurus, I beg for your vehemence.
      innerHTML: "<div class='nag-primary nag-first'></div><div class='nag-primary nag-second'></div><div class='nag-primary nag-last'></div>"

    });
    blockUI.blockUI();

    // Hack to stop click propagation. Dirt.

    setTimeout(function(){
      $('body').click(function(){$scope.dispatchNag();$(this).unbind("click")});
    },200);
  }

  if (!$cookies.firstLogin){
    $scope.invokeNag();
    $cookies.firstLogin = "true";  
  }



  $scope.dispatchNag = function () {
    blockUI.unblockUI();
    console.log('Dispatched Nag Screen');
  }

  $scope.easeInQuart = function (x, t, b, c, d) {
    return c*(t/=d)*t*t*t + b;
  }

  $scope.safeApply = function(fn) {
    var phase = this.$root.$$phase;
    if(phase == '$apply' || phase == '$digest') {
      if(fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };


  $scope.deferTransition = function(view,which){
    console.warn($scope.viewIndex);
/*  $('.fancy').fadeTo(300,0.5,$scope.easeInQuart);
  $('.main-container').animate({'left':'-75%'},function(){
    $(this).css('left','0%').animate({'left':'21%'});
    console.warn ($scope.viewIndex);
    $scope.safeApply();  */

    $scope.changeView(view,which);
  };


  $scope.changeView = function(view,which){


    console.warn(this.viewIndex);

    if (which === "next") {
      this.viewIndex ++ ;
    }
    else if (which === "prev") {
      this.viewIndex -- ;
    }
    else {
      this.viewIndex = which ; 
    }


    angular.element('.twa-next').html(this.routeList[this.viewIndex % this.routeList.length]);
    angular.element('.twa-prev').html(this.routeList[this.viewIndex -2 % this.routeList.length]);   
            $location.path(view); // path not hash
          };
          $scope.currentView = ($location.path() === "/") ? "home" : $location.path();


          $scope.getNextViewByName = function($scope){

            var navHash = this.navHash;
            var currentIdx;
            angular.forEach(navHash,function(v,k){
              console.log(v);
              if (v.state === true) {
                currentIdx = k ; 
                return;
              }
            });
            console.log(currentIdx);
            navHash[ currentIdx % navHash.length].state = false ;     
            navHash[(currentIdx + 1) % navHash.length].state = true ; 
            return angular.lowercase(navHash[(currentIdx + 1) % navHash.length].name);
          }
          $scope.getPrevViewByName = function($scope){
           var navHash = this.navHash;
           var currentIdx;
           angular.forEach(navHash,function(v,k){
            console.log(v);
            if (v.state === true) {
              currentIdx = k ; 
              return;
            }
          });
           console.log(currentIdx);
           if (currentIdx === 0) return ; 
           navHash[ currentIdx % navHash.length].state = false ;     
           navHash[(currentIdx - 1) % navHash.length].state = true ; 
           console.log(navHash[(currentIdx + 1) % navHash.length].name);
           return angular.lowercase(navHash[(currentIdx - 1) % navHash.length].name);
         }
       })
.controller('TWASubmitCtrl', ['$scope', '$window','twaHashTagService','twaRestAPI', 'submitDataService', function ($scope,$window,twaHashTagService,twaRestAPI, submitDataService) {


  $scope.hashFilter = {
    hashtags : []
  };

  $scope.toggleFilter = function(hashElement){
    console.warn(hashElement);
    (hashElement.state === true) ? (this.hashFilter.hashtags.push(hashElement.name)) : this.hashFilter.hashtags = (_.reject(this.hashFilter.hashtags, function(elt){
      return elt === hashElement.name;
    })) ;
  };

  $scope.$window = $window;
  $scope.clicked = false;  


  $scope.lazyLoadCandidates = twaRestAPI.retrieveAll().query(null,function(response){
    console.log(response); 
  });


  $scope.validHashTagFilter = {state:true};


  $scope.submitData = submitDataService.processURL ; 







  $scope.postEntry = function () {
    twaRestAPI.postEntry().save(null,function(response){
    });
  }
  $scope.keyword = "http://www.facebook.com/OfficialChuckNorris";


  $scope.assertHash = function(kw){
    return $scope.keyword.indexOf(kw.replace('#','')) !== -1 ; 
  }


  // Hashtags are hence a Singelton, for general purpose queries ; 


  $scope.twaHashTags = twaHashTagService.getHashList();
  $scope.notify = function (){
    console.log("You typed : " + $scope.keyword);
    var validHash ; 
    if ($scope.keyword !== undefined) { 
     validHash = _.find(this.twaHashTags,function(element){
      return $scope.keyword.indexOf(element.name.replace('#','')) !== -1;
    });
     console.warn(validHash);
   }
   if (validHash !== undefined)
    validHash.state = true ; 
}

}])
.controller('AboutCtrl', ['$scope', function ($scope) {

}])

.controller('MediaCtrl', ['$scope', function ($scope) {

}])
var ModalCtrl = function ($scope, $modal, $log, twaHashTagService,$window) {




  $scope.openGallery = function () {

    var modalInstance = $modal.open({
      templateUrl: 'gallery.html',
      controller: ModalInstanceCtrl,
      windowClass: 'twa-gallery-modal',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };




  $scope.addHashTagModal = function () {

    var modalInstance = $modal.open({
      templateUrl: 'hashtag.html',
      controller: ModalInstanceCtrl,
      windowClass: 'twa-hashtag-input',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: ModalInstanceCtrl,
      windowClass: 'twa-modal',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

var ModalInstanceCtrl = function ($scope, $log, $modalInstance, items, twaHashTagService, twaRestAPI,submitDataService,$window) {

  $scope.submitData = submitDataService.processURL;
  console.warn($scope.submitData);

  $scope.$log = $log;  

  $scope.SUBMIT_STRING = "J'ai soumis";


  $scope.hashfilter = {}; 

  $scope.candidateName = "";

  $scope.hashTags = twaHashTagService.getHashList(); 
  $scope.items = twaRestAPI.retrieveAll().query(null,function(response){
    console.log(response);
  });
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.submitHashTag = function (hashtag) {
    this.twaRestAPI.addHashTag(hashtag);
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};


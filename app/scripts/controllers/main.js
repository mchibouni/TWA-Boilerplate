'use strict';

var app = angular.module('twaAutocompletionApp')
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
    {name:'#facebook',state:false},
    {name:'#twitter',state:false} , 
    {name:'#instragram',state:false},
    {name:'#foursquare',state:false},
    {name:'#dessin',state:false},
    {name:'#soundcloud',state:false},
    {name:'#blog',state:false},
    {name:'#siteweb',state:false},
    {name:'#satire',state:false},

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
      return $resource('http://localhost\\:3000/wines',{
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
      $http.post('http://localhost:3000/hashtags',{"hashtag":hashtag}).success(function(data){
        console.log("success");
      });
    },
    retrieveAllHashTags : function() {
      return $resource('http://localhost\\:3000/hashtags',{
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
      return $resource('http://localhost\\:3000/wines',{
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


  console.warn("THIS IS EXECUTED TWICE");


  $scope.hashtags = twaRestAPI.retrieveAllHashTags().query(null);

  twaRestAPI.retrieveAll().query(null,function(response){
    console.log(response); 
  });
  $http.get('http://graph.facebook.com/kanaseed?fields=name').success(function(data){
    console.log(data);
  })



  $scope.$route = $route;
  $scope.$location = $location;


  $scope.navHash = navMenuRawData.navHash();
  $scope.navCategoryList = twaCategoryService.getCategoryList();


  $scope.lowercase = angular.lowercase;
  var blockUI;

  $scope.invokeNag = function() {
    blockUI = $blockUI.createBlockUI({

      // Angular Gurus, I beg for your vehemence.
      innerHTML: "<div class='nag-primary nag-first'></div><div class='nag-primary nag-second'></div><div class='nag-primary nag-last'></div>"

    });
    blockUI.blockUI();
    angular.element(document).bind('click', function() {
      blockUI.unblockUI();
      console.log("Success callback - unblocking");
    });
  };
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

  $scope.deferTransition = function(view,which){
    console.warn($scope.viewIndex);
    $('.fancy').fadeTo(300,0.5,$scope.easeInQuart);
    $('.main-container').animate({'left':'-75%'},function(){
      $scope.changeView(view,which);
      $(this).css('left','0%').animate({'left':'30%'});
      console.warn ($scope.viewIndex);
      $scope.$apply();  
    });

  };


  $scope.changeView = function(view,which){


    console.warn(this.viewIndex);

    if (which === 1) {
      this.viewIndex ++ ;
    }
    else if (which === 0) {
      this.viewIndex -- ;
    }
    else {

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
.controller('TWASubmitCtrl', ['$scope', 'twaHashTagService','twaRestAPI','$http', function ($scope,twaHashTagService,twaRestAPI,$http) {




  $scope.processURL = function (url) {

    FACEBOOK_STRATEGY_REGEX = /(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/;  
    TWITTER_STRATEGY_REGEX = undefined;
    FOURSQUARE_STRATEGY_REGEX = undefined; 
    INSTAGRAM_STRATEGY_REGEX = undefined; 
    SOUNDCLOUD_STRATEGY_REGEX = undefined ; 



    strategyContainer = [
    {
      provider:"facebook", regex: FACEBOOK_STRATEGY_REGEX, restAPI : function(name){
        return ('http://graph.facebook.com/'+name+'?fields=name');
      }
    },
    {
      provider:"twitter", regex: TWITTER_STRATEGY_REGEX
    },
    {
      provider:"foursquare", regex: FOURSQUARE_STRATEGY_REGEX
    },
    {
      provider:"instagram", regex: INSTAGRAM_STRATEGY_REGEX
    },
    {
      provider:"soundcloud", regex: SOUNDCLOUD_STRATEGY_REGEX
    },
    {
      provider:"noname", regex : WTF_REGEX
    }
    ];


    _.each(strategyContainer,function(element){
      if (element.regex.test(url)){
        console.warn("test");
      }
    });




    //Assuming Facebook
    $http.get('http://graph.facebook.com/'+url.match(FACEBOOK_STRATEGY_REGEX)[1]+'?fields=name');
  }


  $scope.submitData = function (url,hashtags, metadata) {
    $http.post('http://localhost:3000/wines',{"url":url,"name":metadata,"hashtags":hashtags}).success(function(data){
      console.log("success");
    });
  } 



  $scope.foo = function (event) {
    console.log(event.offsetX);
  }

  $scope.postEntry = function () {
    twaRestAPI.postEntry().save(null,function(response){
    });
    console.log('done');
  }
  console.log("DEBUG INFO");
  $scope.keyword = "http://www.facebook.com/OfficialChuckNorris";


  $scope.assertHash = function(kw){
    return $scope.keyword.indexOf(kw.replace('#','')) !== -1 ; 
  }


  // Hashtags are hence a Singelton, for general purpose queries ; 


  $scope.twaHashTags = twaHashTagService.getHashList();
  $scope.notify = function (){
    console.log("You typed : " + $scope.keyword);
    angular.forEach($scope.twaHashTags, function(value, key){
      if (value.name !== "undefined" && value.name.indexOf($scope.keyword) !== -1){
        $scope.twaHashTags[key].state = true; 
        console.log("DEBUG INFO : might work ");
      }
      else{
        $scope.twaHashTags[key].state = false; 
      }
    }
    );
  }

}])
.controller('AboutCtrl', ['$scope', function ($scope) {

}])

.controller('MediaCtrl', ['$scope', function ($scope) {

}])
var ModalCtrl = function ($scope, $modal, $log, twaHashTagService) {



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

var ModalInstanceCtrl = function ($scope, $modalInstance, items, twaHashTagService, twaRestAPI) {



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


'use strict';

var app = angular.module('twaAutocompletionApp')
.service('navMenuRawData', [function () {
  this.navHash = function(){
    return [
    {  name:"HOME", state : true },
    {  name:"ABOUT", state : false },
    {  name:"MEDIA", state : false },
    {  name:"JURY", state : false },
    {  name:"CATEGORIES", state : false },
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
.factory('twaRestAPI', ['$resource', function($resource)
{
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
.controller('MainCtrl', function ($scope, $cookies, $document, $blockUI, $route, $routeParams, $location, navMenuRawData,twaRestAPI, twaCategoryService, stellar) {


  twaRestAPI.query(null,function(response){
    console.log(response);
  });
  stellar.against(window);
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;


  $scope.navHash = navMenuRawData.navHash();
  $scope.navCategoryList = twaCategoryService.getCategoryList();


  $scope.lowercase = angular.lowercase;
  var blockUI;

  $scope.invokeNag = function() {
    blockUI = $blockUI.createBlockUI({
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

  $scope.changeView = function(view){
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
            console.log(navHash[(currentIdx + 1) % navHash.length].name);
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
.controller('TWASubmitCtrl', ['$scope', 'twaHashTagService', function ($scope,twaHashTagService) {
  console.log("DEBUG INFO");
  $scope.fitHashTag = false; 
  $scope.keyword = "test";


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
  $scope.items = twaRestAPI.query(null,function(response){
    console.log(response);
  });
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};


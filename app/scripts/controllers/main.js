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
.controller('MainCtrl', function ($scope, $route, $routeParams, $location, navMenuRawData,twaRestAPI) {
  twaRestAPI.query(null,function(response){
    console.log(response);
  });
  $scope.$route = $route;
  $scope.$location = $location;
  $scope.$routeParams = $routeParams;
  $scope.navHash = navMenuRawData.navHash();
  $scope.lowercase = angular.lowercase;
  $scope.changeView = function(view){
            $location.path(view); // path not hash
          };
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
          $scope.getPrevViewByName = function(){
            return angular.lowercase($scope.navHash[parseInt(angular.element(".parentnav-active")
              .parent().attr("data-index")) - 1 % $scope.navHash.length].name);
          }
        })
.controller('TWASubmitCtrl', ['$scope', function ($scope) {
  console.log("DEBUG INFO");
  $scope.fitHashTag = false; 
  $scope.keyword = "test";
  $scope.twaHashTags = [
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
  {name:'#sport',state:false},
  {name:'#sportphoto',state:false},
  {name:'#video',state:false},
  {name:'#rédaction',state:false},
  {name:'#humour',state:false},
  {name:'#mode',state:false},
  {name:'#wtf',state:false},
  {name:'#même',state:false},
  {name:'#citoyen',state:false}
  ];
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

}]);


var ModalCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

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

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
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


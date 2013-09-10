'use strict';

angular.module('twaAutocompletionApp')
  .controller('MainCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  })
  .controller('TWASubmitCtrl', ['$scope', function ($scope) {
  	$scope.keyword = "test";
  	$scope.twaHashTags = [
  	  '#Facebook',
  	  '#Twitter' , 
  	  '#Instragram'
  	];
  	$scope.notify = function (){
  		console.log("You typed : " + $scope.keyword);
  		angular.forEach($scope.twaHashTags, function(value, key){
  			if (value.indexOf($scope.keyword) !== -1){
  				console.log("DEBUG INFO : might work ");
  			}
  		});
  	}

  }]);

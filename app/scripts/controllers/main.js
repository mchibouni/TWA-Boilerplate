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
.controller('CarouselDemoCtrl', ['$scope', function ($scope) {
  $scope.myInterval = 5000;
  var slides = $scope.slides = [];
  $scope.addSlide = function() {
    var newWidth = 200 + ((slides.length + (25 * slides.length)) % 150);
    slides.push({
      image: 'http://placekitten.com/' + newWidth + '/200',
      text: ['More','Extra','Lots of','Surplus'][slides.length % 4] + ' ' +
        ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
    });
  };
  for (var i=0; i<4; i++) {
    $scope.addSlide();
  }
}]);

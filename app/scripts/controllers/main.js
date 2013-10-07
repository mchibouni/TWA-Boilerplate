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
  .service('processURLService', ['$resource','authStrategyService', '$http', '$rootScope', function($resource,authStrategyService,$http,$rootScope){
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
              $rootScope.submissionSent = true ; 
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
              $(this).fadeOut(8000);
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
          $('<div/>',{class:"alert"}).addClass('alert-danger').html("Ce profil semble inexistant, veuillez revérifier votre URL")
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
          });          console.warn("ERROR!");
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
    {name:'#citoyen',state:false}
//    {name:'+ Proposez un hashtag',state:false},
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
.directive('ngFocus', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      $("input[type='text'],input[type='url']").on("click", function () {
       $(this).select();
     });
    }
  };
}])
.directive('ngEnter', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
})
.directive('ngPrettyPhoto', ['$location', function($location){
  // Runs during compile
  return {
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
      iElm.on('click',function(){
        $.prettyPhoto.open("http://"+$location.host()+":"+$location.port()+iElm.data('pp'));
      });
    }
  };
}])
.directive('ngCandidate', [function () {
  return {
    restrict: 'A',
    scope : '=',
    link: function (scope, iElement, iAttrs) {
      iElement.bind('mouseenter',function(){
        switch (iElement.parent().data('index')) {
          case 0 : 
          console.warn("IN there");
          $('#prompt').scope().selection_0 = "meta"; 
          break;
          case 1 : 
          $('#prompt').scope().selection_1 = "meta"; 
          break;
          case 2 :
          $('#prompt').scope().selection_2 = "meta"; 
          break;
        }
        $('#prompt').scope().$apply();
      });
    }
  };
}])
.directive('validateBlankHashes', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      scope.$watch('zeroHash',function(newV,oldV){
        console.warn("WARNING");
      }); 
    }
  };
}])
.directive('ngReverseCandidate', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      console.warn("sdfsdf");
      iElement.on('mouseleave',function(){
        switch (iElement.parent().data('index')) {
          case 0 : 
          $('#prompt').scope().selection_0 = ""; 
          break;
          case 1 : 
          $('#prompt').scope().selection_1 = ""; 
          break;
          case 2 :
          $('#prompt').scope().selection_2 = ""; 
          break;
        }
        $('#prompt').scope().$apply();
      });
    }
  };
}])
.directive('ngSubmitDone', [function () {
  return {
    restrict: 'A',
    scope: {
      loaded : '='
    },
    link: function (scope, iElement, iAttrs) {
      scope.$watch('loaded',function(newValue,oldValue){
        console.warn("ISOLATESCOPE");
        if (newValue === true ){
          $(".submit-result").fadeOut('fast',function(){
            $("#share-area").hide().fadeIn();
          })          
        }
      })
    }
  }
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
      var plaxifyOptions = (iElement.data('reverse') === "1") ? {"invert":true} : {};
      iElement.plaxify(plaxifyOptions).fadeIn();
      $.plax.enable();
    }
  };
}])
.directive('invertPlax', [function () {
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs) {
      iElement.plaxify({"invert":true}).fadeIn();
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
  {name:"Nejib Belkadhi",meta:"Présentateur", src:"/images/nejib-belkadhi.png"},
  {name:"Kenza Fourati",meta:"Model", src:"/images/kenza-fourati.png"}
  ];
  $scope.juryCollection = [
  {name:"Amine Nouri", meta: "DJ",src:"/images/amine-nouri.png"},
  {name: "Katybon", meta: "Chanteur",src:"/images/katybon.png"},
  {name: "Taha Nouri", meta: "Artist", src:"/images/taha-nouri.png"},
  {name: "Zein", meta: "Music band", src:"/images/zein.png"}
  ];
}])
.controller('JuryCtrl', ['$scope', function ($scope) {


  $scope.juryCollection = [
  {name:"Amel Smaoui", meta: "Journaliste", desc:"Journaliste et animatrice chez RTCI", src:"/images/amel-smaoui.png"},
  {name: "Fatma Ben Hadj Ali", meta: "RRP", desc:"Responsable Relations Presse chez Tunisiana", src:"/images/fatma-ben-haj-ali.png"},
  {name: "Karim Ben Amor", meta: "Entrepreneur", desc:"Co-fondateur d'Alternative Production Communication Conseil", src:"/images/karim-ben-amor.png"},
  {name: "Med Ali Souissi", meta: "Animateur", desc:"Journaliste-Animateur chez Mosaique-FM", src:"/images/mohamed-ali-souissi.png"},
  {name: "Khaled Koubaa", meta: "Manager", desc:"Public Policy & Gov't Relations Manager chez Google" ,src:"/images/khaled-koubaa.png"},
  {name: "Amina Abdellatif", meta: "Graphic Designer", desc:"Freelance Graphic Designer", src:"/images/amina-abdellatif.png"}
  ];
}])
.controller('ContactCtrl', function ($scope, $resource) {

  $scope.senderName = "";
  $scope.email= ""; 
  $scope.message= "";

  $scope.timerRunning = true;

  $scope.startTimer = function (){
    $scope.$broadcast('timer-start');
    $scope.timerRunning = true;
  };

  $scope.stopTimer = function (){
    $scope.$broadcast('timer-stop');
    $scope.timerRunning = false;
  };

  $scope.sendMail = function (){
    $resource('http://localhost\\:3000/sendMail').save({from:this.email,msg:this.message, sendername:this.senderName});
    $('<div/>',{class:"alert"}).addClass('alert-success').html("Message envoyé avec succès.")
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
  }

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
      innerHTML: "<div class='nag-primary nag-first'></div><div class='nag-primary nag-second'></div><div class='nag-primary nag-last'></div><div class='nag-primary nag-wtf'></div>"

    });
    blockUI.blockUI();

    // Hack to stop click propagation. Dirt.

    setTimeout(function(){
      $('body').click(function(){$scope.dispatchNag();$(this).unbind("click")});
    },200);
  }

  /*if (!$cookies.firstLogin){
    $scope.invokeNag();
    $cookies.firstLogin = "true";  
  }*/



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

    if (view === 'home') view = '/'; //RouteChange Hack


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
.controller('TWASubmitCtrl', ['$scope', '$window','twaHashTagService','twaRestAPI', 'submitDataService', '$resource', function ($scope,$window,twaHashTagService,twaRestAPI, submitDataService, $resource) {

  $scope.showLoad = function () {
    $(".submit-result").fadeOut('fast',function(){
      $(this).html("Envoi en cours..").css('background-image','none').addClass('blink').fadeIn();
    })
    return true;  
  }


  $scope.hashFilter = {
    hashtags : []
  };

  $scope.enableHashInput = false ; 

  $scope.selection_0 = "";
  $scope.selection_1 = "";
  $scope.selection_2 = "";

  $scope.suggestHash = "#";


  $scope.sendHashtag = function(){
    console.warn(this.suggestHash);

    var hashRegex = /\S*#(?:\[[^\]]+\]|\S+)/
    if (hashRegex.test(this.suggestHash)){
      $('<div/>',{class:"alert"}).addClass('alert-success').html("Hashtag " + this.suggestHash + " soumis. Merci pour votre proposition")
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


      $scope.twaHashTags.push({name:this.suggestHash,state:"false"}); 
      $scope.$apply();

      $("#fake-input,.fake-hashtag-entry").css('opacity','0');

      $resource('http://www.kanalabs.com\\:3000/hashtags').save({hashtag:this.suggestHash});
    }
    else {
      $('<div/>',{class:"alert"}).addClass('alert-danger').html("Hashtag Invalide, veuillez revérifier.")
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
    }
    $scope.enableHashInput = false ;                
  }


  $scope.assertZeroLength = function(collection){
    if (collection.length) return true ; 
    $('<div/>',{class:"alert"}).addClass('alert-warning').html("Veuillez associer au moins un HashTag à votre candidat")
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
    return false;  
  }

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


  $scope.shareModal = function () {

    var modalInstance = $modal.open({
      templateUrl: 'share-modal.html',
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


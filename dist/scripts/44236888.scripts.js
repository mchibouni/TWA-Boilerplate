;"use strict";angular.module("twaAutocompletionApp",["ui","ezfb","ngCookies","ngResource","ui.bootstrap","BlockUI","stellar.directives","timer"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/contact",{templateUrl:"views/contact.html",controller:"MediaCtrl"}).when("/jury",{templateUrl:"views/jury.html",controller:"JuryCtrl"}).when("/soirée",{templateUrl:"views/party.html",controller:"PartyCtrl"}).when("/media",{templateUrl:"views/media.html",controller:"MediaCtrl"}).otherwise({redirectTo:"/"})}]).config(["$FBProvider",function(a){a.setInitParams({appId:"536088209798325"})}]).config(["$httpProvider",function(){}]).directive("uiScroll",["ui.config",function(a){return a.uiScrollr=a.uiSCroll||{},{restrict:"A",transclude:!0,scope:{values:"=ngModel"},template:'<div class="scroll-pane"><div ng-transclude></div></div>',link:function(b,c,d){var e,f={};e=d.uiScroll?b.$eval(d.uiScroll):{},angular.extend(f,a.uiScroll,e),console.log(f),c.jScrollPane(f)},replace:!0}}]).run(function(a,b,c,d,e,f){c.routeList=["Home","About","Media","Jury","Soirée","Contact"],c.$on("$locationChangeStart",function(){}),c.$on("$routeChangeSuccess",function(){console.warn("ROOT CHANGE ! "),$(".fancy").fadeTo(300,.5,"swing"),$(".main-container").animate({left:"-75%"},function(){$(this).css("left","15%").animate({left:"25%"})}),d.hash(f.scrollTo),e(),c.initViewIndex=function(){return this.routeList.indexOf(_.find(this.routeList,function(a){return"/"===d.path()?"home":angular.lowercase(a)===d.path().replace("/","")}))+1},c.sendSelectedHashes=function(a){return _.pluck(_.where(a,{state:!0}),"name")},c.twitterShare=function(a,b){return console.warn(this.sendSelectedHashes(b).join(",").replace(/#/g,"")),"https://twitter.com/intent/tweet?url="+a+"&text=J'ai+Soumis&hashtags="+this.sendSelectedHashes(b).join(",").replace(/#/g,"")+",TWA"},c.invokeDialog=function(a){b.ui({show_error:!0,method:"feed",name:"Tunisiana Web Awards 2013",link:"https://tunisiana.web.awards:9000",picture:"http://kanalabs.com:9000/images/main-logo.png",caption:"Phase de soumission : ",description:"J'ai soumis le candidat "+a+"#TWA"},function(a){a&&a.post_id?alert("Post was published."):alert("Post was not published.")})},c.viewIndex=c.initViewIndex(),console.warn("VIEWINDEX"+c.viewIndex),c.location=d})}),angular.module("BlockUI",[]).provider("$blockUI",function(){var a;a={innerHTML:"Loading ...",blockUIClass:"blockui-blocked"},this.$get=["$document",function(b){var c,d,e;return d=b.find("body"),e=function(a){return angular.element("<div>").addClass(a)},c=function(b){var c,d,f;f=this.options=angular.extend({},a,b),console.log("blockuiservice::constructor() - options:",f),null!=f.backdropClass?this.backdropEl=e(f.backdropClass):(c={"z-index":10001,border:"none",margin:0,padding:0,width:"100%",height:"100%",top:0,left:0,"background-color":"#000",opacity:.4,cursor:"wait",position:"fixed"},this.backdropEl=angular.element("<div>").css(c)),null!=f.messageClass?this.messageEl=e(f.messageClass):(d={"z-index":10002,position:"fixed",opacity:.5},this.messageEl=angular.element("<div>").css(d).html(f.innerHTML))},c.prototype.isBlocked=function(){return this._blocked},c.prototype.blockUI=function(){var a;this._blocked||(a=this,a._addElementsToDom(),d.addClass(a.options.blockUIClass))},c.prototype.unblockUI=function(){var a;a=this,d.removeClass(a.options.blockUIClass),this._removeElementsFromDom()},c.prototype._addElementsToDom=function(){d.append(this.messageEl),d.append(this.backdropEl),this._blocked=!0},c.prototype._removeElementsFromDom=function(){this.messageEl.remove(),this.backdropEl.remove(),this._blocked=!1},{createBlockUI:function(a){return new c(a)}}}]}),angular.module("stellar.directives",[]).factory("stellar",function(){return{window:function(){jQuery(window).stellar()},against:function(a){jQuery(a).stellar()}}}).directive("stellarBackground",function(){return{restrict:"A",compile:function(a,b){return a.attr("data-stellar-background-ratio",b.stellarBackground),function(){}}}}).directive("stellar",function(){return{restrict:"A",compile:function(a,b){return a.attr("data-stellar-ratio",b.stellar),function(){}}}}).directive("stellarHor",function(){return{restrict:"A",compile:function(a,b){return a.attr("data-stellar-horizontal-offset",b.stellarHor),function(){}}}}).directive("stellarVert",function(){return{restrict:"A",compile:function(a,b){return a.attr("data-stellar-vertical-offset",b.stellarVert),function(){}}}});var app=angular.module("twaAutocompletionApp").service("authStrategyService",[function(){return[{provider:"facebook",regex:/(?:(?:http|https):\/\/)?(?:www.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/,RestNameURI:function(a){return"http://graph.facebook.com/"+a+"?fields=name"},RestPictureURI:function(a){return"http://graph.facebook.com/"+a+"/picture?type=normal"}}]}]).service("processURLService",["$resource","authStrategyService","$http",function(a,b,c){return{submitData:function(b,d,e,f){a("http://www.kanalabs.com\\:8080/twa/check/:url").get({url:b},function(a){a.callback===!0?(console.warn("in there"),c.post("http://www.kanalabs.com:8080/wines",{url:b,name:e,hashtags:d,imguri:f,count:1}).success(function(){$("<div/>",{"class":"alert"}).html("Votre soumission a été reçue, Merci d'avoir participé !").css({"z-index":"9999","text-align":"center",opacity:"1",position:"fixed",display:"none",width:"60%",right:"20%",top:"10%"}).appendTo($("body")).fadeIn("fast",function(){$(this).fadeOut(6e3)}),console.log("success")})):$("<div/>",{"class":"alert"}).html("Vous avez déjà soumis cette URL").css({"z-index":"9999","text-align":"center",opacity:"1",position:"fixed",display:"none",width:"60%",right:"20%",top:"10%"}).appendTo($("body")).fadeIn("fast",function(){$(this).fadeOut(5e3)})})}}}]).service("submitDataService",["$rootScope","authStrategyService","processURLService","$http","$resource",function(a,b,c,d,e){return{processURL:function(a,f){_.each(b,function(b){console.warn(b),b.regex.test(a)?(console.warn("PROVIDER FOUND "+b.provider),d.get(b.RestNameURI(a.match(b.regex)[1])).error(function(){alert("Ce profile n'existe pas, veuillez saisir une URL Facebook Valide"),console.warn("ERROR!")}).then(function(d){console.warn("ACCESSING PROVIDER FIRST TIME"),c.submitData(a,f,d.data.name,b.RestPictureURI(a.match(b.regex)[1]))})):e("http://www.kanalabs.com\\:8080/meta/:url").get({url:a},function(b){console.warn("ACCESSING PROVIDER SECOND TIME"),c.submitData(a,f,b.profile,b.image)})})}}}]).service("navMenuRawData",[function(){this.navHash=function(){return[{name:"HOME",state:!0},{name:"ABOUT",state:!1},{name:"MEDIA",state:!1},{name:"JURY",state:!1},{name:"SOIRÉE",state:!1},{name:"CONTACT",state:!1}]}}]).service("twaHashTagService",[function(){this.getHashList=function(){return[{name:"#musique",state:!1},{name:"#politique",state:!1},{name:"#geek",state:!1},{name:"#lifestyle",state:!1},{name:"#tanbir",state:!1},{name:"#caricature",state:!1},{name:"#art",state:!1},{name:"#blog",state:!1},{name:"#siteweb",state:!1},{name:"#satire",state:!1}]}}]).service("twaCategoryService",[function(){this.getCategoryList=function(){return[{name:"#sport",state:!1},{name:"#photo",state:!1},{name:"#video",state:!1},{name:"#rédaction",state:!1},{name:"#humour",state:!1},{name:"#mode",state:!1},{name:"#wtf",state:!1},{name:"#même",state:!1},{name:"#citoyen",state:!1}]}}]).directive("ngExpand",[function(){return{restrict:"A",link:function(a,b){b.find("button").on("click",function(){b.animate({height:"47%"},200,"swing"),b.find(".obstrusive-shr").fadeIn()})}}}]).directive("ngSmooth",[function(){return{restrict:"A",link:function(a,b){b.css({"text-shadow":"0 0 1px rgba(0,0,0,0.3)"})}}}]).directive("ngOverlay",[function(){return{restrict:"A",link:function(a,b){console.warn(b.data("index"))}}}]).directive("ngFaulty",[function(){return{restrict:"A",link:function(a,b){b.error(function(){b.attr("src",b.css("background-image").match(/\((.*)\)/)[1]),b.css("background-image","none")})}}}]).directive("ngMotivic",[function(){return{link:function(a,b){b.parent().bind("mouseenter",function(){b.addClass("rotate-motive"),console.warn("enter")}),b.parent().bind("mouseleave",function(){b.removeClass("rotate-motive"),console.warn("leave")})}}}]).directive("plax",[function(){return{restrict:"A",link:function(a,b){b.plaxify().fadeIn(),$.plax.enable()}}}]).factory("twaRestAPI",["$resource","$http",function(a,b){return{retrieveAll:function(){return a("http://www.kanalabs.com\\:8080/wines",{query:{method:"GET",headers:{"Content-Type":"application/json",Accept:"application/json"},isArray:!0}})},addHashTag:function(a){b.post("http://www.kanalabs.com:8080/hashtags",{hashtag:a}).success(function(){console.log("success")})},retrieveAllHashTags:function(){return a("http://www.kanalabs.com\\:8080/hashtags",{query:{method:"GET",headers:{"Content-Type":"application/json",Accept:"application/json"},isArray:!0}})},postEntry:function(){return a("http://www.kanalabs.com\\:8080/wines",{update:{method:"POST"}})}}}]).controller("PartyCtrl",["$scope",function(a){a.presCollection=[{name:"Nejib Belkadhi",meta:"Présentateur"},{name:"Kenza Fourati",meta:"Model"}],a.juryCollection=[{name:"DJ anonimus",meta:"DJ"},{name:"Bendir man",meta:"Chanteur"},{name:"Si Lemhaf",meta:"Artist"},{name:"Dub mel kabba",meta:"Music band"}]}]).controller("JuryCtrl",["$scope",function(a){a.juryCollection=[{name:"Denzel Washington",meta:"Actor"},{name:"John Doe",meta:"Who cares"},{name:"Sean Connery",meta:"Photographer"},{name:"Johnny Depp",meta:"Blogger"},{name:"Will Smith",meta:"Designer"},{name:"Catherine Zeta Jones",meta:"Journaliste"}]}]).controller("ContactCtrl",function(a){a.timerRunning=!0,a.startTimer=function(){a.$broadcast("timer-start"),a.timerRunning=!0},a.stopTimer=function(){a.$broadcast("timer-stop"),a.timerRunning=!1}}).controller("MainCtrl",function(a,b,c,d,e,f,g,h,i,j,k,l){c.hashtags=k.retrieveAllHashTags().query(null),k.retrieveAll().query(null,function(a){console.log(a)}),c.$route=g,c.$location=i,c.navHash=j.navHash(),c.navCategoryList=l.getCategoryList(),c.lowercase=angular.lowercase;var m;c.invokeNag=function(){console.warn("In there"),m=f.createBlockUI({innerHTML:"<div class='nag-primary nag-first'></div><div class='nag-primary nag-second'></div><div class='nag-primary nag-last'></div>"}),m.blockUI(),setTimeout(function(){$("body").click(function(){c.dispatchNag(),$(this).unbind("click")})},200)},d.firstLogin||(c.invokeNag(),d.firstLogin="true"),c.dispatchNag=function(){m.unblockUI(),console.log("Dispatched Nag Screen")},c.easeInQuart=function(a,b,c,d,e){return d*(b/=e)*b*b*b+c},c.safeApply=function(a){var b=this.$root.$$phase;"$apply"==b||"$digest"==b?a&&"function"==typeof a&&a():this.$apply(a)},c.deferTransition=function(a,b){console.warn(c.viewIndex),c.changeView(a,b)},c.changeView=function(a,b){console.warn(this.viewIndex),"next"===b?this.viewIndex++:"prev"===b?this.viewIndex--:this.viewIndex=b,angular.element(".twa-next").html(this.routeList[this.viewIndex%this.routeList.length]),angular.element(".twa-prev").html(this.routeList[this.viewIndex-2%this.routeList.length]),i.path(a)},c.currentView="/"===i.path()?"home":i.path(),c.getNextViewByName=function(){var a,b=this.navHash;return angular.forEach(b,function(b,c){return console.log(b),b.state===!0?(a=c,void 0):void 0}),console.log(a),b[a%b.length].state=!1,b[(a+1)%b.length].state=!0,angular.lowercase(b[(a+1)%b.length].name)},c.getPrevViewByName=function(){var a,b=this.navHash;return angular.forEach(b,function(b,c){return console.log(b),b.state===!0?(a=c,void 0):void 0}),console.log(a),0!==a?(b[a%b.length].state=!1,b[(a-1)%b.length].state=!0,console.log(b[(a+1)%b.length].name),angular.lowercase(b[(a-1)%b.length].name)):void 0}}).controller("TWASubmitCtrl",["$scope","$window","twaHashTagService","twaRestAPI","submitDataService",function(a,b,c,d,e){a.$window=b,a.clicked=!1,a.submitData=e.processURL,a.postEntry=function(){d.postEntry().save(null,function(){})},a.keyword="http://www.facebook.com/OfficialChuckNorris",a.assertHash=function(b){return-1!==a.keyword.indexOf(b.replace("#",""))},a.twaHashTags=c.getHashList(),a.notify=function(){console.log("You typed : "+a.keyword);var b;void 0!==a.keyword&&(b=_.find(this.twaHashTags,function(b){return-1!==a.keyword.indexOf(b.name.replace("#",""))}),console.warn(b)),void 0!==b&&(b.state=!0)}}]).controller("AboutCtrl",["$scope",function(){}]).controller("MediaCtrl",["$scope",function(){}]),ModalCtrl=function(a,b,c){a.openGallery=function(){var d=b.open({templateUrl:"gallery.html",controller:ModalInstanceCtrl,windowClass:"twa-gallery-modal",resolve:{items:function(){return a.items}}});d.result.then(function(b){a.selected=b},function(){c.info("Modal dismissed at: "+new Date)})},a.addHashTagModal=function(){var d=b.open({templateUrl:"hashtag.html",controller:ModalInstanceCtrl,windowClass:"twa-hashtag-input",resolve:{items:function(){return a.items}}});d.result.then(function(b){a.selected=b},function(){c.info("Modal dismissed at: "+new Date)})},a.open=function(){var d=b.open({templateUrl:"myModalContent.html",controller:ModalInstanceCtrl,windowClass:"twa-modal",resolve:{items:function(){return a.items}}});d.result.then(function(b){a.selected=b},function(){c.info("Modal dismissed at: "+new Date)})}},ModalInstanceCtrl=function(a,b,c,d,e,f,g){a.submitData=g.processURL,console.warn(a.submitData),a.$log=b,a.SUBMIT_STRING="J'ai soumis",a.hashfilter={},a.candidateName="",a.hashTags=e.getHashList(),a.globalItems=f.retrieveAll().query(null,function(a){console.log(a)}),a.selected={item:a.items[0]},a.ok=function(){c.close(a.selected.item)},a.submitHashTag=function(a){this.twaRestAPI.addHashTag(a)},a.cancel=function(){c.dismiss("cancel")}};app.factory("MediaService",function(a){return a("https://itunes.apple.com/:action",{action:"search",callback:"JSON_CALLBACK"},{get:{method:"JSONP"}})}),WebFontConfig={google:{families:["Titillium+Web::latin"]}},function(){var a=document.createElement("script");a.src=("https:"==document.location.protocol?"https":"http")+"://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js",a.type="text/javascript",a.async="true";var b=document.getElementsByTagName("script")[0];b.parentNode.insertBefore(a,b)}();

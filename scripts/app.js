(function(){
	var app = angular.module('Boggro', []);
	
	app.controller('MainCtrl', ['$scope', '$http', function ($scope, $http){
		var main = this;
		
		$scope.sounds = [];
		$scope.isLoaded = [];
		$scope.col = [];
		(function(){
			$http.get('sounds.json').success(function (data){
				$scope.sounds = data;
				data.forEach(function(item,index){
					$scope.isLoaded.push(false);
					if(index==0){
						$scope.col.push(true);
					}else{
						$scope.col.push(false);
					}
				});
			});
		})();

		main.collapse = function ($event,_id){
			var col = angular.element($event.currentTarget),
				panel = col.parent().find('#collapse_'+_id);
			$scope.col[_id] = !panel.hasClass('in');
		}
	}]);

	app.directive('coll',[function(){
		return{
			restrict: 'A',
			scope:{
				sound: '=sound',
				col: '=cl'
			},
			controller: function($scope){
				var coll = this;

				coll.play = function ($event){
					var audioWrap = angular.element($event.currentTarget),
						audioEle = audioWrap.find('audio'),
						audio = audioWrap.find('audio')[0],
						progress = audioWrap.find('.progress'),
						icon = audioWrap.find('.icon');
					
					if (audio && audio.readyState >= audio.HAVE_FUTURE_DATA) audio.paused ? audio.play() : audio.pause();
					
					audioEle.bind('play', function (){
						icon.removeClass('pause');
						icon.addClass('play');
						progress.animate({height: 100+'%'}, (audio.duration - audio.currentTime)*1000, 'linear');
					});
					audioEle.bind('pause', function (){
						progress.stop();
						icon.removeClass('play');
						icon.addClass('pause');
					});
					audioEle.bind('ended', function (){
						progress.stop();
						progress.css('height', 0);
						icon.removeClass('play');
						icon.removeClass('pause');
						audio.load();
					});
				};
			},
			controllerAs: 'coll',
			link: function (scope, ele, attrs){
				var index = scope.$parent.$index;

				if (scope.$parent.$index == 0){
					angular.element(ele).addClass('in');
				}
				
				scope.$watch('col['+index+']', function(){
					if(scope.col[index]){
						scope.contentUrl = 'view/col.html';
						scope.$parent.isLoaded[index] = true;
					}else if(!scope.col[index] && !scope.$parent.isLoaded[index]){
						scope.contentUrl = 'view/default.html';
					}
				})
			},
			template: '<div ng-include="contentUrl"></div>'
		}
	}]);

})();


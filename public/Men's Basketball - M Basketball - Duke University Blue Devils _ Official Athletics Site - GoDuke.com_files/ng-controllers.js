'use strict';

/**
 * Calendar controller
 * 
 * For executing different calendar operations/calls
 * 
 * @param $scope
 * @param $http
 * @param Calendar
 */
function BoxCtrl($scope, $http, $compile, $window, $location, Calendar, Modal, CalendarTags){
	$scope.purl = REFERRER;
	$scope.data = [];
	$scope.selCalNamesStr = '';
	$scope.selCalIdsStr = '';
	$scope.selCalNames = [];
	$scope.selCalIds = [];
	$scope.calendarsStrHtml = '';
	$scope.calendarsStr;
	$scope.calendarNameStr;
	$scope.lastCalIdC = '';
	$scope.lastCalIdUC = '';
	$scope.lastCName   = '';
	$scope.selectTimeout;
	$scope.isShowCal = false;
	$scope.inital    = true;
	$scope.events	 = [];
	$scope.startView = 'calendar';
	$scope.dataUrl   = CALENDAR_API_URL;
	
	$scope.$on('post-select-calendar', function() {
		$scope.safeApply(function() {
			if ($scope.initial == false) {
				$scope.selCalNamesStr 	= '';
				$scope.selCalIdsStr 	= '';
				$($scope.selCalNames).each(function(index, value) {
					$scope.selCalNamesStr   += ($scope.selCalNamesStr == '') ? value : ',' + value;
				});
				$scope.calendarNameStr   = $scope.selCalNamesStr;
				$($scope.selCalIds).each(function(index, value) {
					$scope.selCalIdsStr += ($scope.selCalIdsStr == '') ? value : ',' + value;
				});
				$scope.calendarsStr = $scope.selCalIdsStr;
				$.jStorage.set(PAGE_NAME + '-' + ORG_ID + '-selected-calendarids', $scope.selCalIdsStr, 365);
				$.jStorage.set(PAGE_NAME + '-' + ORG_ID + '-selected-calendarnames', $scope.selCalNamesStr, 365);
				//Animate bubble
				$('#action-nav-list .bubble-2 span.count').html($scope.selCalIds.length);
				if ($scope.selCalIds.length > 0) $('#cal-popover').effect( "shake", {distance : 5} );
				
			}
		});
	});
	
	
	$scope.loadData = function(url) {
		$scope.$emit('pre-load-data');
		$.ajax({
			url: $scope.dataUrl,
			type: 'GET',
			data: {pubOrgId: ORG_ID},
			async: false,
			success: function(data){
				$scope.data = data;
				$scope.$emit('post-load-data');
			}
		});
	};
	
	$scope.$on('pre-load-data', function() {
		$scope.safeApply(function() {
			$scope.startView = $('#box-widget').attr('data-start-view');
			if ($scope.startView == 'calendar') {
				$scope.dataUrl   = CALENDAR_API_URL;
			} else if($scope.startView == 'events') {
				$scope.dataUrl   = ALL_EVENTS_API_URL;
			}
		});
	});

	$scope.$on('post-load-data', function() {
		$scope.safeApply(function() {
			$(function() {
				$scope.$emit('pre-init');
				
				adjustEventListBox();
				var _selectedCals 		= $.trim($.jStorage.get(PAGE_NAME + '-' + ORG_ID + '-selected-calendarids'));
				var _selectedCalNames 	= $.trim($.jStorage.get(PAGE_NAME + '-' + ORG_ID + '-selected-calendarnames'));
				$scope.calendarsStr 	= $scope.selCalIdsStr 	= _selectedCals;
				$scope.calendarNameStr 	= $scope.selCalNamesStr = _selectedCalNames;
				if(_selectedCals != '0' && _selectedCals != '') {
					var calIds = _selectedCals.split(',');				
					for(var _index in calIds) {
						$('.cid-' + calIds[_index]).iCheck('check');
						if ($.inArray(calIds[_index], $scope.selCalIds) == -1) {							
							$scope.selCalIds.push(calIds[_index]);
						}
					}
					$('#action-nav-list .bubble-2 span.count').html(calIds.length);
				} else {
					$('input.custom-checkbox:first').iCheck('check');
					$scope.selCalIds.push($('input.custom-checkbox:first').attr('data-cal-id'));
					$('#action-nav-list .bubble-2 span.count').html(1);
				}
				
				if(_selectedCalNames != '0' && _selectedCalNames != ''){
					var calNames = _selectedCalNames.split(',');
					for(var _index in calNames){
						if ($.inArray(calNames[_index], $scope.selCalNames) == -1) {
							$scope.selCalNames.push(calNames[_index]);
						}
					}
				} else {
					$scope.selCalNames.push($('input.custom-checkbox:first').attr('data-cal-name'));
				}
				$scope.initial = false;
				$scope.$emit('post-select-calendar');
				if($scope.startView == 'events') {
					var loaded_events = $.jStorage.get(PAGE_NAME + '-' + ORG_ID + '-loaded-events');
					if (!loaded_events) {
						loaded_events = {};
					}
					loaded_events = angular.fromJson(loaded_events);
					angular.forEach($scope.data, function(value, key){
						if (!loaded_events['ALL']) {
							loaded_events['ALL'] = [];
						}
						loaded_events['ALL'][key] = value['_id']['$id'];
					});
					$.jStorage.set(PAGE_NAME + '-' + ORG_ID + '-loaded-events', loaded_events);
				}
				
				$scope.$emit('post-init');
			});
		});		
	});
	
	$scope.$on('pre-init', function(e) {
		$('input.custom-checkbox').iCheck({
		    checkboxClass: 'icheckbox_square',
		    radioClass: 'iradio_square',
		    increaseArea: '20%' // optional
		});
		
		if ($scope.data.length == 0) {
			$('.no-data').show();
		} else {
			$('.no-data').hide();
		}
		
		e.stopPropagation();
	});
	
	$scope.$on('post-init', function() {
		$('input.custom-checkbox').on('ifChecked', function(event){
			$scope.safeApply(function() {
				$(event.target).attr('checked','checked');
				var cId   = $(event.target).attr('data-cal-id');
				var cName = $(event.target).attr('data-cal-name');	
				if ($scope.lastCalIdC != cId) {
					$scope.lastCalIdC = cId;
					$scope.lastCalIdUC = '';
					$('.cid-' + cId).iCheck('check');
					$scope.$emit('select-calendar', {cId: cId,cName :cName, '$event' : event});
				}
			});
			
		});
		$('input.custom-checkbox').on('ifUnchecked', function(event){
			$scope.safeApply(function() {
				$(event.target).removeAttr('checked');
				var cId   = $(event.target).attr('data-cal-id');
				var cName = $(event.target).attr('data-cal-name');
				if ($scope.lastCalIdUC != cId) {
					$scope.lastCalIdUC = cId;
					$scope.lastCalIdC = '';
					$('.cid-' + cId).iCheck('uncheck');
					$scope.$emit('select-calendar', {cId: cId,cName :cName, '$event' : event});
				}
			});

		});
	});
	
	$scope.$on('notify-user-select-calendar', function(event, args) {
		if ($scope.initial == false) {
			$('#action-nav-list #add-to-cal').hide();
			$('#action-nav-list li:gt(0)').hide();
			$('.cur-cal-name').html(args.cName).fadeToggle("slow", "linear");
			clearTimeout($scope.selectTimeout);
			$scope.selectTimeout = setTimeout(function() {
				$('.cur-cal-name').hide();
				$('#action-nav-list #add-to-cal').fadeIn();
				$('#action-nav-list li:gt(0)').fadeIn();
				$scope.device 	 = Modernizr.Detectizr.device;
				if ($scope.device.type != 'desktop') {
					$('#action-menu li:eq(2)').hide();
				}
			
			}, 2000);
		}
	});
	
	$scope.$on('list-events', function(event, args) {
		args.targetEvent.preventDefault();
		$scope.lastCName = args.cName;
		$location.path("/events-list/" + args.cId);
		event.stopPropagation();
		args.targetEvent.stopPropagation();
	});
	
	$scope.$on('select-calendar' , function(event, args) {
		var cId    = args.cId, 
		    cName  = args.cName, 
		    $event = args.$event, 
		    force  = args.force;
		$scope.safeApply(function() {
			$scope.$emit('pre-select-calendar');
			if(($event && $($event.target).is(':checked')) || force){				
				if ($.inArray(cId, $scope.selCalIds) == -1) {					
					$scope.selCalIds.push(cId);
					$scope.selCalNames.push(cName);		
					$scope.$emit('notify-user-select-calendar', {cName : cName});	
				}
			} else if($event && $($event.target).not(':checked')) {
				
				var idIndex = $scope.selCalIds.indexOf(cId);
				if(idIndex != -1){
					$scope.selCalIds.splice(idIndex, 1);
				}
				$($scope.selCalNames).each(function(index, value) {
					if (value == cName) {
						$scope.selCalNames.splice(index, 1);
					}
				});
			}
			$scope.$emit('post-select-calendar');
			$event.stopPropagation();
		});
	});
	
	
	/*
	$.ajax({
		url: ALL_EVENTS_API_URL,
		type: 'GET',
		data: {pubOrgId: ORG_ID},
		async: false,
		success: function(events){
			$scope.events = events;
		}
	});
	*/
	
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
	
	$scope.$on('$routeChangeSuccess', function(event, currentRoute, previousRoute) { 
		$scope.safeApply(function() {	
			$(function() {
				setTimeout(function() {
					if (!currentRoute.redirectTo) {
						if (currentRoute.$$route.controller.name == 'BoxCtrl') {
							$('.back-button').hide();
							var icon_src = $('.back-button img').attr('src');    		    
			    		    icon_src = icon_src.replace(/home/g, 'arrow_left');
			    		    $('.back-button img').attr('src', icon_src);
						} else {
							$('.back-button').show();
						}
						adjustEventListBox();
					}
				}, 200);
			});
		});
	});
	
	$scope.$on('go-back',function(event,args) {
		args.targetEvent.preventDefault();
		$scope.safeApply(function() {
			$('#box-widget .views.opaque').height(0);
			$('.viewport .views').removeClass('next').removeClass('prev').removeClass('opaque');
			$scope.isShowCal = false;
			if ($('.back-button').hasClass('go-home')) {
				$location.path('/').replace();
				$('.back-button').removeClass('go-home')
			} else {
				$window.history.back();
			}
		});
		args.targetEvent.stopPropagation();
	});
	
	$scope.$on('show-calendars',function() {
		if ($scope.isShowCal == true) {
			$scope.isShowCal = false;
			$window.history.back();			
		} else {
			$scope.isShowCal = true;
			$scope.calendarsStrHtml = '<div class="sel-cal-name sel-cal-header">Selected Calendars</div>';
			$($scope.selCalNames).each(function(index, value) {
				$scope.calendarsStrHtml += '<div class="sel-cal-name reg-font">' + value +'</div>';
			});
			$location.path("/events/showcal");
		}
	});
	
	
	
	$scope.expandEvent = function(event, $event){
		var detailsDiv    = $('.event-details-div-' + event._id.$id);
		
		if(detailsDiv.find('.loading').length){
			$.ajax({
				url: '/w/' + PAGE_NAME + '/' + event.type + '/' + event._id.$id,
				type: 'GET',
				success: function(details){
					detailsDiv.html(details);
				}
			});
		}

		var displayStatus = detailsDiv.css('display') == 'block' ? 'none' : 'block';
		var iconStatus    = detailsDiv.css('display') == 'block' ? 'icon-chevron-down' : 'icon-chevron-up';
		
		detailsDiv.closest('li')
		          .find('.choose-event-list-row a')
		          .removeClass('icon-chevron-up')
		          .removeClass('icon-chevron-down')
		          .addClass(iconStatus);
		
		$('.event-details').css('display', 'none');
		detailsDiv.css('display', displayStatus);
	};
	
	$scope.$on('expand-event', function(e, args){
		args.targetEvent.preventDefault();
		var path = '/event-details/' + args.type + '/' + args.id + '/' + args.index + '-' + args.length;
		$location.path(path);
		e.stopPropagation();
		args.targetEvent.stopPropagation();
	});
	
	$scope.loadData();
	
	
}

function BoxEventsCtrl($scope, $routeParams, $location, $compile) {
	//$scope.events   = [];
	$scope.loadData = function() {
		var params = 'location_id=&location_field=';
		params	   += '&tz=' + encodeURI(TIME_ZONE);
		params     += '&calIds[]=' + $routeParams.cid;
		$scope.$emit('pre-load-data');
		$.ajax({url: EVENTS_API_URL, data: params, type: "POST", headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Range' : "items=0-99"} })
		 .done(function(response, textStatus, jqXHR) {
			$scope.events = response;
			$scope.$emit('post-load-data');
		 });
	};
	
	
	$scope.$on('expand-event', function(e, args){
		args.targetEvent.preventDefault();
		var path = '/event-details/' + args.type + '/' + args.id + '/' + args.index + '-' + args.length;
		$location.path(path);
		e.stopPropagation();
		args.targetEvent.stopPropagation();
	});
	
	$scope.$on('post-load-data', function(){		
		$scope.safeApply(function() {
			setTimeout(function() {
				$scope.$emit('pre-init');
				adjustEventListBox();
				$('#event-add-opt').height($('#box-widget .viewport').height());
				$('#event-add-opt .span12').height($('#box-widget .viewport').height() - 2);
				if ($scope.selCalIds.indexOf($routeParams.cid) != -1) {
					$('.cid-' + $routeParams.cid).iCheck('check');
				}
				var loaded_events = $.jStorage.get(PAGE_NAME + '-' + ORG_ID + '-loaded-events');
				if (!loaded_events) {
					loaded_events = {};
				}
				loaded_events = angular.fromJson(loaded_events);
				angular.forEach($scope.events, function(value, key){
					if (!loaded_events[$routeParams.cid]) {
						loaded_events[$routeParams.cid] = [];
					}
					loaded_events[$routeParams.cid][key] = value['id'];
				});
				$.jStorage.set(PAGE_NAME + '-' + ORG_ID + '-loaded-events', loaded_events);
				$scope.$emit('post-init');
			}, 100);
		});

	});
	
	$scope.$on('pre-init', function(e) {
		$scope.safeApply(function() {
			$('input.custom-event-checkbox').iCheck({
			    checkboxClass: 'icheckbox_square',
			    radioClass: 'iradio_square',
			    increaseArea: '20%' // optional
			 });
			if ($scope.events.length == 0) {
				$('.no-events').show();
			} else {
				$('.no-events').hide();
			}
			e.stopPropagation();
		});
	});
	
	$scope.$on('post-init', function() {
		$scope.safeApply(function() {
			$('input.custom-event-checkbox').on('ifChecked', function(event){
				$scope.safeApply(function() {
					$(event.target).attr('checked','checked');
					var cId   = $(event.target).attr('data-cal-id');
					$('.cid-' + cId).iCheck('check');
				});
				
			});
			$('input.custom-event-checkbox').on('ifUnchecked', function(event){
				$scope.safeApply(function() {
					$(event.target).removeAttr('checked');
					var cId   = $(event.target).attr('data-cal-id');
					$('.cid-' + cId).iCheck('uncheck');
				});
	
			});
		});
	});
	$scope.loadData();
}

function BoxShowCalendarCtrl($scope, $routeParams, $location, $compile) {

	$('#event-add-opt').height($('#box-widget .viewport').height());
	$('#event-add-opt .span12').height($('#box-widget .viewport').height() - 2);
	
	
}
function BoxEventDetailCtrl($scope, $rootScope, $routeParams, $location, $compile){
	$scope.loaded_events = [];
	$scope.init = function(fn) {
		$scope.safeApply(function() {
			setTimeout(function() {
				$scope.$emit('pre-init');
				adjustEventListBox();
				$scope.startView = $('#box-widget').attr('data-start-view');
				var cId          = $('#event-details-' + $routeParams.pageId).attr('data-cal-id');
				if ($('.cid-' + cId).is(':checked')) {
					$('#event-details-' + $routeParams.pageId).iCheck('check');
					$('#event-details-' + $routeParams.pageId).attr('checked','checked');
				}
				
				$('#event-details-title a.icon-chevron-up.icon-black.expander').click(function(e) {
					e.preventDefault();
					$('#box-widget .views.opaque').height(0);
					$('.viewport .views').removeClass('next').removeClass('prev').removeClass('opaque');
					$location.path('/events-list/' + cId);
					e.stopPropagation();
				});
				
				var l_e = $.jStorage.get(PAGE_NAME + '-' + ORG_ID + '-loaded-events');
				l_e 	= angular.fromJson(l_e);
				
				if ($scope.startView == 'calendar') {
					if (!l_e[cId]) {
						l_e[cId] = [];
					}
					$scope.loaded_events = l_e[cId];
				} else {
					$scope.loaded_events = l_e['ALL'];
				}				 
				$scope.$emit('post-init');
			},100);
		});
	};
	
	$scope.$on('back-to-event-list', function(e){
		if ($scope.startView == 'calendar') {
			var cId   = $('#event-details-' + $routeParams.pageId).attr('data-cal-id');
			$location.path("/events-list/" + cId);
		} else {
			$location.path("/");
		}
		e.stopPropagation();
	});
	

	$scope.$on('event-detail-nav', function(e, args){
		$scope.safeApply(function() {	
			var direction = args.direction;
			if (!$('#event-detail').hasClass('disable-' + direction)) {
				$('.viewport .views').removeClass('next').removeClass('prev').addClass('opaque');
				$('#box-widget .views.opaque').height($('#box-widget .viewport').height());
				$('.viewport .views').addClass(direction);
				var range = $routeParams.fl;
				var page  = range.split('-');
				var index = page[0];
				var total = page[1];
				var next  = parseInt(index) + 1;
				var prev  = parseInt(index) - 1;
				var path  = '';
				if (direction == 'next' && next < total) {
					path = '/event-details/' + $routeParams.type + '/' + $scope.loaded_events[next] + '/' + next + '-' + total;
				} else if (direction == 'prev' && prev >= 0) {
					path = '/event-details/' + $routeParams.type + '/' + $scope.loaded_events[prev] + '/' + prev + '-' + total;
				}
				$location.path(path).replace();
			}
		});
		e.stopPropagation();
	});
	
	$scope.$on('pre-init', function(e) {
		$('#event-details-' + $routeParams.pageId).iCheck({
		    checkboxClass: 'icheckbox_square',
		    radioClass: 'iradio_square',
		    increaseArea: '20%' // optional
		});
		
		$('#event-details-' + $routeParams.pageId).on('ifChecked', function(event){
			$scope.safeApply(function() {	
				var cId   = $(event.target).attr('data-cal-id');
				$('.cid-' + cId).iCheck('check');
				$(event.target).attr('checked','checked');
			});		
		});
		
		$('#event-details-' + $routeParams.pageId).on('ifUnchecked', function(event){
			$scope.safeApply(function() {	
				var cId   = $(event.target).attr('data-cal-id');
				$('.cid-' + cId).iCheck('uncheck');
				$(event.target).removeAttr('checked');
			});
		});	
		e.stopPropagation();
	});
	$scope.$on('post-init', function(e) {
		$scope.safeApply(function() {	
			$('#event-details-fields-row').css('position', 'initial');						
		});
		e.stopPropagation();
	});
	$scope.init();
}

function BoxSubscribeToAppCtrl($scope, $routeParams, $location, $compile,$http){
	$scope.selCalIdsStr = $('#sel-cal-name-str').val(); 
	$scope.selCalIdsStr = $('#sel-cal-ids-str').val();
	$scope.subform      = '';

	$scope.device 		= Modernizr.Detectizr.device;
	$('#event-add-opt').height($('#box-widget .viewport').height());
	$('#event-add-opt .span12').height($('#box-widget .viewport').height() - 2);
	
	
	
	
	$http.get('/widget/subscribe?p=' + $routeParams.p + '&a=' + $routeParams.a + '&t=' + $routeParams.t + '&cn=' + $('#sel-cal-name-str').val() + '&c=' + $('#sel-cal-ids-str').val()).success(function(response){
		
		var templateHTML = angular.element(response);
		
		var clonedElement = $compile(templateHTML)($scope, function(clonedElement, scope) {
			  //attach the clone to DOM document at the right place
			$('#event-add-opt .span12').html(clonedElement);
			enablePlaceholders();
		});
		
		$('.btn').addClass('btn-mini');
		$('#event-add-opt-content .modal-footer').append($('#event-add-opt-content .t-n-c'));
		$('.t-n-c input').iCheck({
		    checkboxClass: 'icheckbox_square',
		    radioClass: 'iradio_square',
		    increaseArea: '20%' // optional
		});
		
		$('.t-n-c input').on('ifChecked', function(event){
			$(event.target).attr('checked','checked');
		});
		$('.t-n-c input').on('ifUnchecked', function(event){
			$(event.target).removeAttr('checked');
		});
	});


	
	$scope.popupOk = function(){
        $location.path('/#');
        return;
	};
	
	$scope.popupCancel = function(){
        $location.path('/#');
        return;
	};
	
    $scope.subscribeNext = function(type){
    	localizeJQMessages();
    	var validator = $('#subscription-form').validate({ onsubmit: false });
    	
    	if(!validator.form()){
    		var errors = validator.errorList;
    		for(var i in errors){
    			var err = errors[i];
    			var errElem = err.element;
    			var msg = err.message;
    			var placement = 'bottom';
    			
    			if($(errElem).attr('id') == 'email'){
    				//placement = 'top';
    			}

    			$(errElem).tooltip('destroy');
    			$(errElem).attr('title', msg);
    			$(errElem).tooltip({placement:placement}).tooltip('show');
    		}
    		
    		return;
    	} 
    	
    	if($('.subscribe-next').attr('disabled')) return;
    	
    	var form = $('#subscription-form');
    	var url = form.attr('action');
    	var formData = form.serializeFormJSON();
    	if ($scope.device.type != 'desktop' && $scope.device.os == 'ios') {
    		formData.a = 'ical';
    		formData.t = 'calendar';
    	}
    	
    	$('.subscribe-next span').html(PLEASE_WAIT);
    	$('.subscribe-next').attr('disabled', 'disabled');

    	$.ajax({
    		url: url,
    		type: 'POST',
    		data: formData,
    		async: false,
    		success: function(data){
    			$('#event-add-opt-content').html(data);
    			$compile($('#event-add-opt-content'))($scope);
    			
    		    $('.btn').addClass('btn-mini');   		    
    		    var icon_src = $('.back-button img').attr('src');    		    
    		    icon_src = icon_src.replace(/arrow_left/g, 'home');
    		    $('.back-button img').attr('src', icon_src);
    		    $('.back-button').addClass('go-home');
    		}
    	});
    };
    
    $scope.sendSubscriptionLink = function(type, subscriber_id, e){
    	var url = false;
    	var data = {};
    	var disabled = $('a.send-' + type).attr('disabled');
    	if(disabled) return;
    	
    	$('a.send-' + type).attr('disabled', 'disabled');
    	
    	switch(type){
				case 'email':
					_postSubscriptionEmail(subscriber_id, type);
					break;
					
				case 'sms':
					_postSubscriptionSMS(subscriber_id, type);
					break;
					
				case 'reference':
					_referFriends($('#sel-cal-ids-str').val(), type, e);
					break;
    	}
    };
}

function BoxSubscriptionMenuCtrl($scope, $routeParams, $location){

	var selectedCals = $.trim($.jStorage.get(PAGE_NAME + '-' + ORG_ID + '-selected-calendarids'));
	if(selectedCals == '0' || selectedCals == ''){
		alert(NO_CAL_SELECTED);
        $location.path('/#');
        return;
	}
	$('#event-add-opt').height($('#box-widget .viewport').height());
	$('#event-add-opt .span12').height($('#box-widget .viewport').height() - 2);
	$scope.type = $routeParams.type;
	$scope.page = $routeParams.page;
	$scope.device 		= Modernizr.Detectizr.device;
}

function CalendarCtrl($scope, $http, $compile, Calendar, Modal, CalendarTags){
	
	$scope.purl = REFERRER;
	$scope.calendarTags = {};
	$scope.nextEventRange   = '';
	$scope.multiTier        = $('#f-m-t').val();
	$.ajax({
		url: CALENDAR_API_URL,
		type: 'GET',
		data: {pubOrgId: ORG_ID},
		async: false,
		success: function(calendars){
			$scope.calendars 	= calendars;
			$scope.calendarTags = DEFAULT_TAGS;
			angular.forEach($scope.calendars, function(calendar, key){
				if (calendar.tags) {
					var kg = true;
					angular.forEach(calendar.tags, function(value, index){
						if (kg) {
							$scope.calendarTags[value] = value;
							if ($scope.multiTier == "1") {
								kg = false;
							}
						}
					});	
				}
			});
			$('#cal-row-overflow').removeClass('loading');
			
			if(calendars.length == 0){
				$('#cal-row-overflow').addClass('no-cals');
			}else{
				$('#cal-row-overflow').removeClass('no-cals');
			}
			
			$(function() {
				$.filtrify("choose-cal-list", "filter-placeholder", {
					callback : function( query, match, mismatch ) {
						if (mismatch.length > 0) {
							$.each(mismatch, function(index, value) {
								if ($(value).children().first().is(':checked')) {
									$(value).children().first().click();
								}
							});							
						}
						
					}
				});
			});
			
			setTimeout(function(){
				//Mark pre selected calendars
				var c_ids = $.jStorage.get(PAGE_NAME + '-' + ORG_ID + '-selected-calendarids', []);
				var cookie_cal_ids = c_ids == 0 ? [] : c_ids.split(',');
				
				var c_names = $.jStorage.get(PAGE_NAME + '-' + ORG_ID + '-selected-calendarnames', []);
				var cookie_cal_names = c_names == 0 ? [] : c_names.split(',');
				
				for(var i = 0 ; i < cookie_cal_ids.length ; i++){
					var cal_id = cookie_cal_ids[i];
					var cal_name  = cookie_cal_names[i];
					var cal_split = cal_name.split('|'); 
					
					$scope.preSelectCalendars(cal_id, cal_split[0]);
				}		
				
				if (cookie_cal_ids.length <= 0) {
					
					var f_cal = $(".choose-cal-list-row").first().children(":first");
					if (f_cal.length == 0) {
						f_cal = $(".sports").first().children(":first").find("input");
					}
					
					if (f_cal) {
						var cal_id = f_cal.attr("id").replace("calendar-", '');
						$scope.preSelectCalendars(cal_id, '');
					}
				}
				
			}, 100);
		}
	});	
	
	$scope.calendarIndexes = [];
	$scope.calendarSelection = {};
	$scope.selectedCalendars = [];
	$scope.calendarNames = [];
	$scope.calendarsStr;
	$scope.calendarsStrComma;
	$scope.calendarNameStr;
	
	$scope.events = [];
	$scope.currentEvent;
	
	$scope.eventsFetchInterval;
	
	$scope.email;
	$scope.mobileNumber;
	$scope.mobileCountry;
	
	$scope.fired = false;
	
	$scope.fetchingCalendars = false;
	
	$scope.$watch('events', function() {
		$scope.fired = true;
		setTimeout(function(){
			if($('.evt-trigger-btn').length > 0){
				$($('.evt-trigger-btn')[0]).trigger('click');
			}			
		}, 10);
	});
	
	$scope.populateArrays = function(){
		angular.forEach($scope.calendars, function(calendar, key){
			$scope.calendarIndexes[calendar.id] = calendar;	
		});
	};	
	
	$scope.preSelectCalendars = function(calId, calName){
		if($.trim(calId) == '') return;
		
		$('#calendar-' + calId).attr('checked', 'checked')
			                   .trigger('click')
			                   .attr('checked', 'checked');
	};
	
	//Add this calendar to calendars list
	$scope.selectCalendar = function(calendar, $event, callBack){
		if(!$scope.calendarIndexes.length){
			$scope.populateArrays();
		}
		
		if($($event.target).is(':checked')  && !$($event.target).is(':hidden')){
			var idIndex = $scope.selectedCalendars.indexOf(calendar.id);
			if(idIndex == -1){
				$scope.selectedCalendars.push(calendar.id);
				$scope.calendarNames.push({ 'name' : calendar.name, 'type' : calendar.type });		
			}
		}else{
			var idIndex = $scope.selectedCalendars.indexOf(calendar.id);
			if(idIndex != -1){
				$scope.selectedCalendars.splice(idIndex, 1);
			}
			
			$($scope.calendarNames).each(function(index, value) {
				if (value.name == calendar.name) {
					$scope.calendarNames.splice(index, 1);
				}
			});
		}
		//console.log($scope.selectedCalendars);
		//Clear events list if no calendar selected
		if(!$scope.selectedCalendars.length){
			$scope.events = [];
			$scope.calendarsStr = '';
			$scope.calendarsStrComma = '';
			$scope.calendarNameStr = '';
			window.location.href = '#/';
			
			$.jStorage.set(PAGE_NAME + '-' + ORG_ID + '-selected-calendarids', '');
			$.jStorage.set(PAGE_NAME + '-' + ORG_ID + '-selected-calendarnames', '');

			return;
		}

		$scope.calendarsStr = $scope.selectedCalendars.join('-');
		$scope.calendarsStrComma = $scope.selectedCalendars.join(',');
		$scope.calendarNameStr = '';
		var calNameCSV = '';
		$($scope.calendarNames).each(function(index, value) {
			$scope.calendarNameStr += ($scope.calendarNameStr == '') ? value.name : ',' + value.name ;
			calNameCSV += (calNameCSV == '') ? value.name + '|' + value.type : ',' + value.name  + '|' + value.type;
		});

		$.jStorage.set(PAGE_NAME + '-' + ORG_ID + '-selected-calendarids', $scope.calendarsStrComma);
		$.jStorage.set(PAGE_NAME + '-' + ORG_ID + '-selected-calendarnames', calNameCSV);

		
		setTimeout(function(){
			if($scope.fetchingCalendars) return;
			
			var params = 'location_id=&location_field=';
			$.each($scope.selectedCalendars, function(a, b){
				params += '&calIds[]=' + b;
			});
			params += '&tz=' + encodeURI(TIME_ZONE);
			
			var calendarEventsUrl = EVENTS_API_URL;
			$scope.fetchingCalendars = true;
			$scope.listEvents(calendarEventsUrl,  params, "items=0-99", true);			
		}, 300);
		
		//Callbacks if any
		if(undefined != callBack){
			try{
				if(typeof(callBack) == 'string'){
					eval(callBack)($scope.calendarNameStr);
				}else if(typeof(callBack) == 'function'){
					callback($scope.calendarNameStr);
				}
			}catch(e){
				//Ignore if no callback function is defined
			}
		}
	};
	
	$scope.selectEvent = function(type, id){
		window.location.href = '#/event/' + type + '/' + id;
		$('.event-list-row').removeClass('active');
		$('#event-' + id).addClass('active');
	};
	
	$scope.loadMoreEvents = function(){
		if ($scope.nextEventRange) {
			if($scope.fetchingCalendars) return;
			$scope.fetchingCalendars = true;
			var params = 'location_id=&location_field=';
			$.each($scope.selectedCalendars, function(a, b){
				params += '&calIds[]=' + b;
			});
			params += '&tz=' + encodeURI(TIME_ZONE);
			var calendarEventsUrl = EVENTS_API_URL;
			$scope.listEvents(calendarEventsUrl,  params, $scope.nextEventRange, false);
		}
	};
	
	//Fetch events list for selected calendars
	$scope.listEvents = function(calendarEventsUrl, data, range, initial){
		$('#event-list-content').addClass('loading');

		$.ajax({url: calendarEventsUrl,data: data, type: "POST", headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Range' : range} })
			.done(function(response, textStatus, jqXHR) {
				
				$scope.$apply(function(scope) { scope.nextEventRange   = jqXHR.getResponseHeader('Next-Range'); });
				if (initial == true) {
					
					$scope.$apply(function(scope) {scope.events = response;});
					
					$('#event-list-content').scrollTop(0);
				} else {
					for (var i = 0; i < response.length; i++) {
						$scope.$apply(function(scope) {scope.events.push(response[i]);});
					}
				}
				$('#event-list-content').removeClass('loading');
				
				if(response.length == 0){
					$('#event-list-content').addClass('no-events');
				}else{
					$('#event-list-content').removeClass('no-events');
				}
				$scope.$apply(function(scope) {scope.fetchingCalendars = false;});
			})
			.fail(function(jqXHR, textStatus) {
				alert('Error fetching event details');
				$scope.fetchingCalendars = false;
			});
	};
	
	//Modal button events
    $scope.popupCancel = function () {
    	Modal.close();
    };
    
    $scope.popupOk = function () {
    	Modal.close();
    	$('#refer-friend-popup').trigger('click');
    };
    
    $scope.subscribeNext = function(type){
    	localizeJQMessages();
    	var validator = $('#subscription-form').validate({ onsubmit: false });
    	
    	if(!validator.form()){
    		var errors = validator.errorList;
    		for(var i in errors){
    			var err = errors[i];
    			var errElem = err.element;
    			var msg = err.message;
    			var placement = 'bottom';
    			
    			if($(errElem).attr('id') == 'email'){
    				placement = 'top';
    			}
    			
    			$(errElem).tooltip('destroy');
    			$(errElem).attr('title', msg);
    			$(errElem).tooltip({placement:placement}).tooltip('show');
    		}
    		
    		return;
    	} 
    	
    	if($('.subscribe-next').attr('disabled')) return;
    	
    	var form = $('#subscription-form');
    	var url = form.attr('action');
    	var formData = form.serializeFormJSON();

    	$('.subscribe-next span').html(PLEASE_WAIT);
    	$('.subscribe-next').attr('disabled', 'disabled');

    	$.ajax({
    		url: url,
    		type: 'POST',
    		data: formData,
    		async: false,
    		success: function(data){
    			$('#modal-body').html(data);
    			$compile($('#modal-body'))($scope);
    		}
    	});
    };
    
    $scope.sendSubscriptionLink = function(type,subscriber_id, e){
    	var url = false;
    	var data = {};
    	var disabled = $('a.send-' + type).attr('disabled');
    	if(disabled) return;
    	
    	$('a.send-' + type).attr('disabled', 'disabled');
    	
    	switch(type){
				case 'email':
					_postSubscriptionEmail(subscriber_id, type);
					break;
					
				case 'sms':
					_postSubscriptionSMS(subscriber_id, type);
					break;
					
				case 'reference':
					_referFriends(subscriber_id, type, e);
					break;
    	}
    };
}

/**
 * EventCtrl for fetching event details
 * 
 * @param $scope
 * @param $routeParams
 * @param $http
 */
function EventCtrl($scope, $routeParams, $http){
	$('#event-details-row').addClass('loading');
	$scope.purl = REFERRER;
	$scope.template = '/w/' + PAGE_NAME + '/' + $routeParams.type + '/' + $routeParams.id;
}

/**
 * 
 * @param $scope
 * @param $routeParams
 * @param $http
 * @param $compile
 * @param Modal
 */
function EventsForMonthCtrl($scope, $routeParams, $http, $compile, Modal){
	$scope.purl = REFERRER;
	$scope.currentEvent;
	$scope.featured;
	$scope.featuredEvents;
	$scope.events = [];
	$scope.eventCount = {};
	$scope.ym = [];
	$scope.week = 1;
	$scope.days = {all: true, monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false};
	$scope.selectedCalendars = [];
	$scope.calendarNames = [];
	$scope.calendarsStr = '';
	$scope.calendarsStrHtml = '';
	$scope.calendarNameStr = '';
	$scope.infoClickedOn;
	$scope.calendarsStrComma;
	
	$scope.refreshReleventMonths = function(){
		//Get relevant yearMonths
		$scope.ym = [];
		
		$('#box-slider li').each(function(){
			$scope.ym.push($(this).attr('data'));
		});
		
		$scope.eventsForMonth();
	};
	
	$scope.chooseCalendarForSubscription = function(calId, calName, calType, $event, force){
		if(($event && $($event.target).is(':checked')) || force){
			if($scope.selectedCalendars.indexOf(calId) == -1){
				$scope.selectedCalendars.push(calId);
				$scope.calendarNames.push({'name' : calName, 'type' : calType });
			}
		}else{
			var idIndex = $scope.selectedCalendars.indexOf(calId);
			if(idIndex != -1){
				$scope.selectedCalendars.splice(idIndex, 1);
			}
			$($scope.calendarNames).each(function(index, value) {
				if (value.name == calName) {
					$scope.calendarNames.splice(index, 1);
				}
			});
		}
		
		$scope.calendarsStr = $scope.selectedCalendars.join(',');
		$scope.calendarsStrComma = $scope.selectedCalendars.join(',');
		
		$scope.calendarNameStr = '';
		$scope.calendarsStrHtml = '';
		var calNameCSV = '';
		$($scope.calendarNames).each(function(index, value) {
			$scope.calendarsStrHtml += '<div class="sel-cal-name event-entry event-' + value.type + '">' + value.name +'</div>';
			calNameCSV += (calNameCSV == '') ? value.name + '|' + value.type : ',' + value.name  + '|' + value.type;
			$scope.calendarNameStr += ($scope.calendarNameStr == '') ? value.name : ',' + value.name ;
		});

		//GA callback
		try{
			eventsGACallback($scope.calendarNameStr);
		}catch(e){}
		
		if(!force){
			
			$.jStorage.set(PAGE_NAME + '-' + ORG_ID + '-selected-calendarids', $scope.calendarsStr);
			$.jStorage.set(PAGE_NAME + '-' + ORG_ID + '-selected-calendarnames', calNameCSV);
		
			//Animate bubble
			if ($scope.selectedCalendars.length > 0) $('#action-nav-list .menu-label').effect( "shake", {distance : 5} );
			if ($scope.selectedCalendars.length > 0) $('.action-float-menu .menu-label').effect( "bounce", "slow" );
		}
		
		if(($event && $($event.target).is(':checked')) || force){
			$('.calendar-' + calId).addClass('selected');
		}else{
			$('.calendar-' + calId).removeClass('selected');
		}
	};
	
	$scope.getFeaturedEvents = function(){
		var s = $('#box-slider li:first').attr('data') + '-01';
		var e = $('#box-slider li:last').attr('data') + '-31';
		
		$.ajax({
			url: FEATURED_EVENTS_URL,
			type: 'POST',
			data: {pubOrgId: ORG_ID, s: s, e: e, tz: TIME_ZONE},
			async: false,
			success: function(events){
				$scope.featuredEvents = events;
				
				if($scope.featuredEvents.length){
					$scope.featured = events[0];
					
					if(!$scope.featured.name && $scope.featured.title){
						$scope.featured.name = $scope.featured.title;
					}
				}
			}
		});
	};
	
	$scope.eventsForMonth = function(append){
		if(undefined == $scope.ym || $scope.ym.length == 0) return;
		
		$.ajax({
			url: EVENTS_FOR_MONTH_API_URL,
			type: 'POST',
			data: {pubOrgId: ORG_ID, ym: $scope.ym, d:$scope.days, w:$scope.week, tz: TIME_ZONE},
			async: false,
			success: function(response){
				var events = response.events;
				$scope.eventCount = response.counts;
				
				$('#event-grid-row .span12').removeClass('loading');
				
				if(!events.length){
					alert(NO_EVENTS_TO_LOAD);
					$('#load-events-row a').css('visibility' ,'hidden');
				}
				
				if(undefined == append){
					$scope.events = events;
				}else{
					for(var i = 0 ; i < events.length ; i++){
						var e = events[i];
						if($scope.events.indexOf(e) == -1){
							$scope.events.push(e);
						}
					}
				}
			
				for(var e in $scope.events){
					var evt = $scope.events[e];
					
					if(!evt.startDateWidget) continue;
					
					if(!evt.name && evt.title){
						evt.name = evt.title;
					}
					
					var dt = new Date(evt.startDateWidget.replace(/-/g, '/'));
					var monthYearClass = '.events-' + dt.format('yyyy-mm');
					var eventClass = '.evt-' + evt._id.$id;
					var dayClass = dt.format('dddd').toLowerCase();
					
					var event_type = evt.type.titleCase();
					if (event_type == 'Fixture' || event_type == 'Univision-feed') {
						event_type = 'Fixture / Schedule';
					}
					if(!$(monthYearClass).length || $(eventClass).length) continue;
					var evtTpl = '<div title="' + evt.name + '" ng-click="setCurrentEvent(\'{EVT_ID}\')" ng-popup="/w/{PAGE_NAME}/{EVT_TYPE}/{EVT_ID}?sel={{calendarsStr}}" class="evt-{EVT_ID} {DAY_CLASS} evt-item event-box-bgcolor calendar-{CAL_ID}"><span class="event-box-header">{EVT_NAME}</span><span class="event-box-footer">{EVT_DAY}</span><span class="event-box-more"><ul><li class="event-entry event-{EVT_TYPE} type ttip" rel="tooltip" title="{EVT_TYPE_TT}"></li><li class="event-details ttip" rel="tooltip" ng-click="setInfoClickedOn(\'{EVT_ID}\')" title="'+ADD_TO_CALENDAR+'"></li></ul></span></div>';
					var eventDiv =  $(evtTpl.replace(/{PAGE_NAME}/g, PAGE_NAME)
										  .replace(/{CAL_ID}/g, evt.calendarId.$id)
										  .replace(/{DAY_CLASS}/g, dayClass)
										  .replace(/{EVT_ID}/g, evt._id.$id)
										  .replace(/{EVT_TYPE}/g, evt.type)
										  .replace(/{EVT_TYPE_TT}/g, EVENT_TYPES[event_type])
										  .replace(/{EVT_NAME}/g, evt.name)
										  .replace(/{EVT_DAY}/g, evt.startDateFull));
					
					try{
						if($scope.selectedCalendars.indexOf(evt.calendarId.$id) != -1){
							eventDiv.addClass('selected');
						}
					}catch(e){}
					
					if($scope.days['all'] == false && $scope.days[dayClass] == false){
						eventDiv.css('display', 'none');
					}
					
					$compile(eventDiv)($scope);
					$(monthYearClass).append(eventDiv);
				}
				
				if (append) {
					$(".event-slider").trigger("updateSizes");
					moveFloatMenu();
				}
				
				setTimeout(function(){
					$('.ttip').tooltip({});
					$('.fadeIn').animate({opacity:1}); 
					
				}, 10);
			}
		});
	};
	
	$scope.setInfoClickedOn = function(eId){
		$scope.infoClickedOn = eId;
	};
	
	$scope.toggleDay = function(day){
		
		if(day == 'all'){
			
			$('#event-grid-row .evt-item').css('display', 'block');
			for(var d in $scope.days){
				$scope.days[d] = false;
			}
			$scope.days['all'] = true;
			$('#event-grid-row .caroufredsel_wrapper').css('height', $('.event-slider').height() + 'px');
			return;
			
		}else if($('.daySel-' + day).hasClass('active-false')){
			
			$scope.days[day] = true;
			$scope.days['all'] = false;
			
		}else if($('.daySel-' + day).hasClass('active-true')){
			
			$scope.days[day] = false;
			$scope.days['all'] = false;
			
		}
		
		$('#event-grid-row .evt-item').css('display', 'none');
		
		for(var d in $scope.days){
			if($scope.days[d] == true){
				$('#event-grid-row .evt-item.' + d).css('display', 'block');
			} 
		}
		$('#event-grid-row .caroufredsel_wrapper').css('height', $('.event-slider').height() + 'px');
	};
	
	$scope.loadMoreEvents = function(){
		$scope.week++;
		/*if($scope.week > 5){
			return;
		}*/
		
		$scope.eventsForMonth(true);
	};
	
	$scope.setCurrentEvent = function(eId){
		$.each($scope.events, function(){
			if(eId == this._id.$id){
				$scope.currentEvent = this;
				return false;
			}
		});
	};
	
    $scope.popupOk = function () {
    	Modal.close();
    	$('#refer-friend-popup').trigger('click');
    };
    
    $scope.prevEventDetails = function(){
    	var curIndex = $scope.events.indexOf($scope.currentEvent);
    	var preIndex = curIndex - 1;
    	
    	$scope.showEventDetails(preIndex, 'prev');
    };
    
    $scope.nextEventDetails = function(){
    	var curindex = $scope.events.indexOf($scope.currentEvent);
    	var nextIndex = curindex + 1;
    	
    	$scope.showEventDetails(nextIndex, 'next');
    };
    
    $scope.showEventDetails = function(index, direction){
    	var targetEvent = null;
    		
		if(index > $scope.events.length - 1){
			index = 0;
		}else if(index < 0){
			index = $scope.events.length - 1;
		}
		
		targetEvent = $scope.events[index];
    	$scope.currentEvent = targetEvent;

    	$scope.loadAndApendEventDetails(targetEvent, direction);
    };
    
    $scope.loadAndApendEventDetails = function(targetEvent, direction){
		$.ajax({
			url: '/w/' + PAGE_NAME + '/' + targetEvent.type + '/' + targetEvent._id.$id,
			type: 'POST',
			data: {pubOrgId: ORG_ID, stripScript: true},
			async: false,
			beforeSend: function ( xhr ) {
				$('.event-details-preloader').css('display', 'block');
			},
			complete: function(jqXHR, textStatus){
				$('.event-details-preloader').css('display', 'none');
			},
			success: function(details){
				if(!targetEvent.name && targetEvent.title){
					targetEvent.name = targetEvent.title;
				}
				
				//Remove existing slide first
				if($('.es-' + targetEvent._id.$id).length){
					$('.es-' + targetEvent._id.$id).remove();
				} 
				
				var detailsElement = $('<span>' + details + '</span>');

				var li = $('<li class="slide es-' + targetEvent._id.$id + '"></li>');
				li.attr('calendar-id', detailsElement.find('.event_calendar_id').val())
				  .attr('calendar-name', detailsElement.find('.event_calendar_name').val())
				  .attr('event-type', targetEvent.type)
				  .attr('event-name', targetEvent.name);
				
				$(detailsElement.find('.event-details-wrapper')).each(function(index, value){
					li.append(value);
				});

				if (direction == 'next') 
				{
					$('.event-details-popup-ul li.slide:first').after(li);
				}
				else
				{
					$('.event-details-popup-ul li.slide:last').after(li);
				}
				if(undefined != $('.event-details-popup-ul').data()._cfs_isCarousel){
					$('.event-details-popup-ul').trigger('destroy', [false]);
					$('.event-details-popup-ul').carouFredSel({auto:false, items: {height: "auto", visible: {max : 1, min: 1}}});
				}
				
				$('.event-details-popup-ul').trigger(direction + 'Page');
					
				$('#myModalLabel').html(targetEvent.name);
				$('.event-calendar-selector').html(detailsElement.find('.event-calendar-selector').html());
				$compile($('.event-calendar-selector'))($scope);
				$compile(li)($scope);

				var thisCalendar = $('.event_calendar_id').val();
				if($scope.selectedCalendars.indexOf(thisCalendar) != -1){
					$('.calendar-selector').attr('checked', 'checked');
					
				}
			}
		});
    };
    
    $scope.subscribeNext = function(type){
    	localizeJQMessages();
    	var validator = $('#subscription-form').validate({ onsubmit: false });
    	
    	if(!validator.form()){
    		var errors = validator.errorList;
    		for(var i in errors){
    			var err = errors[i];
    			var errElem = err.element;
    			var msg = err.message;
    			var placement = 'bottom';
    			
    			if($(errElem).attr('id') == 'email'){
    				placement = 'top';
    			}
    			
    			$(errElem).tooltip('destroy');
    			$(errElem).attr('title', msg);
    			$(errElem).tooltip({placement:placement}).tooltip('show');
    		}
    		
    		return;
    	} 
    	
    	if($('.subscribe-next').attr('disabled')) return;
    	
    	var form = $('#subscription-form');
    	var url = form.attr('action');
    	var formData = form.serializeFormJSON();
    	
    	$('.subscribe-next span').html(PLEASE_WAIT);
    	$('.subscribe-next').attr('disabled', 'disabled');

    	$.ajax({
    		url: url,
    		type: 'POST',
    		data: formData,
    		async: false,
    		success: function(data){
    			$('#modal-body').html(data);
    			$compile($('#modal-body'))($scope);
    		}
    	});
    };
    
    $scope.sendSubscriptionLink = function(type, subscriber_id, e){
    	var url = false;
    	var data = {};
    	var disabled = $('a.send-' + type).attr('disabled');
    	if(disabled) return;
    	
    	$('a.send-' + type).attr('disabled', 'disabled');
    	
    	switch(type){
				case 'email':
					_postSubscriptionEmail(subscriber_id, type);
					break;
					
				case 'sms':
					_postSubscriptionSMS(subscriber_id, type);
					break;
					
				case 'reference':
					_referFriends(subscriber_id, type, e);
					break;
    	}
    };
	
    $scope.refreshReleventMonths();
    $scope.getFeaturedEvents();
    
	
	//Mark pre selected calendars
	var c_ids = $.jStorage.get(PAGE_NAME + '-' + ORG_ID + '-selected-calendarids', []);
	var cookie_cal_ids = c_ids == 0 ? [] : c_ids.split(',');
	
	var c_names = $.jStorage.get(PAGE_NAME + '-' + ORG_ID + '-selected-calendarnames', []);
	var cookie_cal_names = c_names == 0 ? [] : c_names.split(',');
	
	for(var i = 0 ; i < cookie_cal_ids.length ; i++){
		var cal_id = cookie_cal_ids[i];
		var cal_name = cookie_cal_names[i];
		var cal_split = cal_name.split('|');
		$scope.chooseCalendarForSubscription(cal_id, cal_split[0], cal_split[1], null, true);
	}
}

/**
 * 
 * @param $scope
 * @param $routeParams
 * @param $http
 * @param $compile
 * @param Modal
 */
function EventsForWeekCtrl($scope, $routeParams, $http, $compile, Modal){
	$scope.purl = REFERRER;
	$scope.currentEvent;
	$scope.featured;
	$scope.featuredEvents;
	$scope.events = [];
	$scope.eventCount = {};
	$scope.ym = [];
	$scope.week = 1;
	$scope.days = {all: true, monday: false, tuesday: false, wednessday: false, thursday: false, friday: false, saturday: false, sunday: false};
	$scope.selectedCalendars = [];
	$scope.calendarNames = [];
	$scope.calendarsStr = '';
	$scope.calendarNameStr = '';
	$scope.calendarsStrHtml = '';
	$scope.calendarsStrComma;
	$scope.infoClickedOn;

	$scope.refreshReleventMonths = function(){
		//Get relevant yearMonths
		$scope.ym = [];
		
		$('#box-slider li').each(function(){
			$scope.ym.push($(this).attr('data'));
		});
		
		$scope.eventsForMonth();
	};
	
	$scope.chooseCalendarForSubscription = function(calId, calName, calType, $event, force){
		if(($event && $($event.target).is(':checked')) || force){
			if($scope.selectedCalendars.indexOf(calId) == -1){
				$scope.selectedCalendars.push(calId);
				$scope.calendarNames.push({'name' : calName, 'type' : calType});
			}
		}else{
			var idIndex = $scope.selectedCalendars.indexOf(calId);
			if(idIndex != -1){
				$scope.selectedCalendars.splice(idIndex, 1);
			}
			
			$($scope.calendarNames).each(function(index, value) {
				if (value.name == calName) {
					$scope.calendarNames.splice(index, 1);
				}
			});
		}
		
		$scope.calendarsStr = $scope.selectedCalendars.join(',');
		$scope.calendarsStrComma = $scope.selectedCalendars.join(',');
		
		$scope.calendarNameStr = '';
		$scope.calendarsStrHtml = '';
		var calNameCSV = '';
		$($scope.calendarNames).each(function(index, value) {
			$scope.calendarsStrHtml += '<div class="sel-cal-name event-entry event-' + value.type + '">' + value.name +'</div>';
			calNameCSV += (calNameCSV == '') ? value.name + '|' + value.type : ',' + value.name  + '|' + value.type;
			$scope.calendarNameStr += ($scope.calendarNameStr == '') ? value.name : ',' + value.name;
		});
		
		//GA callback
		try{
			eventsGACallback($scope.calendarNameStr);
		}catch(e){}
		
		if(!force){
			
			$.jStorage.set(PAGE_NAME + '-' + ORG_ID + '-selected-calendarids', $scope.calendarsStr);
			$.jStorage.set(PAGE_NAME + '-' + ORG_ID + '-selected-calendarnames', calNameCSV);			
			//Animate bubble
			if ($scope.selectedCalendars.length > 0) $('#action-nav-list .menu-label').effect( "shake", {distance : 5} );
		}
		
		if(($event && $($event.target).is(':checked')) || force){
			$('.calendar-' + calId).addClass('selected');
		}else{
			$('.calendar-' + calId).removeClass('selected');
		}
	};
	
	$scope.getFeaturedEvents = function(){
		var s = $('#box-slider li:first').attr('data');
		var e = $('#box-slider li:last').attr('data');
		
		$.ajax({
			url: FEATURED_EVENTS_URL,
			type: 'POST',
			data: {pubOrgId: ORG_ID, s: s, e: e, tz: TIME_ZONE},
			async: false,
			success: function(events){
				$scope.featuredEvents = events;
				
				if($scope.featuredEvents.length){
					$scope.featured = events[0];
					
					if(!$scope.featured.name && $scope.featured.title){
						$scope.featured.name = $scope.featured.title;
					}
				}
			}
		});
	};
	
	$scope.eventsForMonth = function(append){
		if(undefined == $scope.ym || $scope.ym.length == 0) return;
		
		$.ajax({
			url: EVENTS_FOR_WEEK_API_URL,
			type: 'POST',
			data: {pubOrgId: ORG_ID, ym: $scope.ym, d:$scope.days, w:$scope.week, tz: TIME_ZONE},
			async: false,
			success: function(events){
				$('#event-grid-row .span12').removeClass('loading');
				
				$scope.events = events;
				for(var e in $scope.events){
					var evt = $scope.events[e];
					
					if(!evt.startDateWidget) continue;
					
					if(!evt.name && evt.title){
						evt.name = evt.title;
					}
					
					var dt = new Date(evt.startDateWidget.replace(/-/g, '/'));
					var dayMonthYearClass = '.events-' + dt.format('yyyy-mm-dd');
					var eventClass = '.evt-' + evt._id.$id;
					
					var sessionClass = 'morning';
					var time = 0;
					if (dt) {
						time = dt.format('HH');
					}
					if(time >= 12 && time < 19){
						sessionClass = 'afternoon';
					}else if(time >= 19){
						sessionClass = 'night';
					} 
					
					$scope.eventCount['events-' + dt.format('yyyy-mm')] = undefined == $scope.eventCount['events-' + dt.format('yyyy-mm')] ? 1 : $scope.eventCount['events-' + dt.format('yyyy-mm')] + 1;  
					var event_type = evt.type.titleCase();
					if (event_type == 'Fixture' || event_type == 'Univision-feed') {
						event_type = 'Fixture / Schedule';
					}
					if(!$(dayMonthYearClass).length || $(eventClass).length) continue;
					var evtTpl = '<div title="' + evt.name + '" ng-click="setCurrentEvent(\'{EVT_ID}\')" ng-popup="/w/{PAGE_NAME}/{EVT_TYPE}/{EVT_ID}?sel={{calendarsStr}}" class="evt-{EVT_ID} {DAY_CLASS} evt-item event-box-bgcolor calendar-{CAL_ID}"><span class="event-box-header">{EVT_NAME}</span><span class="event-box-footer">{EVT_DAY}</span><span class="event-box-more"><ul><li class="event-entry event-{EVT_TYPE} type ttip" rel="tooltip" title="{EVT_TYPE_TT}"></li><li class="event-details ttip" rel="tooltip" ng-click="setInfoClickedOn(\'{EVT_ID}\')" title="'+ADD_TO_CALENDAR+'"></li></ul></span></div>';
					var eventDiv =  $(evtTpl.replace(/{PAGE_NAME}/g, PAGE_NAME)
										  .replace(/{CAL_ID}/g, evt.calendarId.$id)
										  .replace(/{DAY_CLASS}/g, sessionClass)
										  .replace(/{EVT_ID}/g, evt._id.$id)
										  .replace(/{EVT_TYPE}/g, evt.type)
										  .replace(/{EVT_TYPE_TT}/g, EVENT_TYPES[event_type])
										  .replace(/{EVT_NAME}/g, evt.name)
										  .replace(/{EVT_DAY}/g, evt.startDateFull));
					
					try{
						if($scope.selectedCalendars.indexOf(evt.calendarId.$id) != -1){
							eventDiv.addClass('selected');
						}
					}catch(e){}
					
					if($scope.days['all'] == false && $scope.days[sessionClass] == false){
						eventDiv.css('display', 'none');
					}
					
					$compile(eventDiv)($scope);
					$(dayMonthYearClass).append(eventDiv);
				}
				
				setTimeout(function(){
					$('.ttip').tooltip({});
					$('.fadeIn').animate({opacity:1});
				}, 10);
			}
		});
	};
	
	$scope.setInfoClickedOn = function(eId){
		$scope.infoClickedOn = eId;
	};
	
	$scope.toggleDay = function(day){
		
		if(day == 'all'){
			
			$('#event-grid-row .evt-item').css('display', 'block');
			for(var d in $scope.days){
				$scope.days[d] = false;
			}
			$scope.days['all'] = true;
			$('#event-grid-row .caroufredsel_wrapper').css('height', $('.event-slider').height() + 'px');
			return;
			
		}else if($('.daySel-' + day).hasClass('active-false')){
			
			$scope.days[day] = true;
			$scope.days['all'] = false;
			
		}else if($('.daySel-' + day).hasClass('active-true')){
			
			$scope.days[day] = false;
			$scope.days['all'] = false;
			
		}
		
		$('#event-grid-row .evt-item').css('display', 'none');
		
		for(var d in $scope.days){
			if($scope.days[d] == true){
				$('#event-grid-row .evt-item.' + d).css('display', 'block');
			} 
		}
		$('#event-grid-row .caroufredsel_wrapper').css('height', $('.event-slider').height() + 'px');
	};
	
	/**
	 * week is just used as offset due to some variable naming issues.
	 */
	$scope.loadMoreEvents = function(){
		$scope.week++;
		$scope.eventsForMonth(true);
	};
	
	$scope.setCurrentEvent = function(eId){
		$.each($scope.events, function(){
			if(eId == this._id.$id){
				$scope.currentEvent = this;
				return false;
			}
		});
	};
	
    $scope.popupOk = function () {
    	Modal.close();
    	$('#refer-friend-popup').trigger('click');
    };
    
    $scope.prevEventDetails = function(){
    	var curIndex = $scope.events.indexOf($scope.currentEvent);
    	var preIndex = curIndex - 1;
    	
    	$scope.showEventDetails(preIndex, 'prev');
    };
    
    $scope.nextEventDetails = function(){
    	var curindex = $scope.events.indexOf($scope.currentEvent);
    	var nextIndex = curindex + 1;
    	
    	$scope.showEventDetails(nextIndex, 'next');
    };
    
    $scope.showEventDetails = function(index, direction){
    	var targetEvent = null;
    		
		if(index > $scope.events.length - 1){
			index = 0;
		}else if(index < 0){
			index = $scope.events.length - 1;
		}
		
		targetEvent = $scope.events[index];
    	$scope.currentEvent = targetEvent;

    	$scope.loadAndApendEventDetails(targetEvent, direction);
    };
    
    $scope.loadAndApendEventDetails = function(targetEvent, direction){
		$.ajax({
			url: '/w/' + PAGE_NAME + '/' + targetEvent.type + '/' + targetEvent._id.$id,
			type: 'POST',
			data: {pubOrgId: ORG_ID, stripScript: true},
			async: false,
			beforeSend: function ( xhr ) {
				$('.event-details-preloader').css('display', 'block');
			},
			complete: function(jqXHR, textStatus){
				$('.event-details-preloader').css('display', 'none');
			},
			success: function(details){
				if(!targetEvent.name && targetEvent.title){
					targetEvent.name = targetEvent.title;
				}
				
				//Remove existing slide first
				if($('.es-' + targetEvent._id.$id).length){
					$('.es-' + targetEvent._id.$id).remove();
				} 
				
				var detailsElement = $('<span>' + details + '</span>');

				var li = $('<li class="slide es-' + targetEvent._id.$id + '"></li>');
				li.attr('calendar-id', detailsElement.find('.event_calendar_id').val())
				  .attr('calendar-name', detailsElement.find('.event_calendar_name').val())
				  .attr('event-type', targetEvent.type)
				  .attr('event-name', targetEvent.name);
				
				$(detailsElement.find('.event-details-wrapper')).each(function(index, value){
					li.append(value);
				});

				if (direction == 'next') 
				{
					$('.event-details-popup-ul li.slide:first').after(li);
				}
				else
				{
					$('.event-details-popup-ul li.slide:last').after(li);
				}
				if(undefined != $('.event-details-popup-ul').data()._cfs_isCarousel){
					$('.event-details-popup-ul').trigger('destroy', [false]);
					$('.event-details-popup-ul').carouFredSel({auto:false, items: {height: "auto", visible: {max : 1, min: 1}}});
				}
				
				$('.event-details-popup-ul').trigger(direction + 'Page');
					
				$('#myModalLabel').html(targetEvent.name);
				$('.event-calendar-selector').html(detailsElement.find('.event-calendar-selector').html());
				$compile($('.event-calendar-selector'))($scope);
				$compile(li)($scope);

				var thisCalendar = $('.event_calendar_id').val();
				if($scope.selectedCalendars.indexOf(thisCalendar) != -1){
					$('.calendar-selector').attr('checked', 'checked');
				}
			}
		});
    };
    
    $scope.subscribeNext = function(type){
    	localizeJQMessages();
    	var validator = $('#subscription-form').validate({ onsubmit: false });
    	
    	if(!validator.form()){
    		var errors = validator.errorList;
    		for(var i in errors){
    			var err = errors[i];
    			var errElem = err.element;
    			var msg = err.message;
    			var placement = 'bottom';
    			
    			if($(errElem).attr('id') == 'email'){
    				placement = 'top';
    			}
    			
    			$(errElem).tooltip('destroy');
    			$(errElem).attr('title', msg);
    			$(errElem).tooltip({placement:placement}).tooltip('show');
    		}
    		
    		return;
    	} 
    	
    	if($('.subscribe-next').attr('disabled')) return;
    	
    	var form = $('#subscription-form');
    	var url = form.attr('action');
    	var formData = form.serializeFormJSON();
    	
    	$('.subscribe-next span').html(PLEASE_WAIT);
    	$('.subscribe-next').attr('disabled', 'disabled');

    	$.ajax({
    		url: url,
    		type: 'POST',
    		data: formData,
    		async: false,
    		success: function(data){
    			$('#modal-body').html(data);
    			$compile($('#modal-body'))($scope);
    		}
    	});
    };
    
    $scope.sendSubscriptionLink = function(type, subscriber_id , e){
    	var url = false;
    	var data = {};
    	var disabled = $('a.send-' + type).attr('disabled');
    	if(disabled) return;
    	
    	$('a.send-' + type).attr('disabled', 'disabled');
    	
    	switch(type){
	    		case 'email':
	    			_postSubscriptionEmail(subscriber_id, type);
	    			break;
	    			
	    		case 'sms':
	    			_postSubscriptionSMS(subscriber_id, type);
	    			break;
	    			
	    		case 'reference':
	    			_referFriends(subscriber_id, type, e);
	    			break;
    	}

    };
	
	$scope.refreshReleventMonths();
	$scope.getFeaturedEvents();
	
	//Mark pre selected calendars
	var c_ids = $.jStorage.get(PAGE_NAME + '-' + ORG_ID + '-selected-calendarids', []);
	var cookie_cal_ids = c_ids == 0 ? [] : c_ids.split(',');
	
	var c_names = $.jStorage.get(PAGE_NAME + '-' + ORG_ID + '-selected-calendarnames', []);
	var cookie_cal_names = c_names == 0 ? [] : c_names.split(',');
	
	for(var i = 0 ; i < cookie_cal_ids.length ; i++){
		var cal_id = cookie_cal_ids[i];
		var cal_name = cookie_cal_names[i];
		var cal_split = cal_name.split('|');
		$scope.chooseCalendarForSubscription(cal_id, cal_split[0],cal_split[1], null, true);
	}
}

function _postSubscriptionEmail(subscriber_id, type){
	var url = '/a/' + PAGE_NAME + '/send-via-email';
	var data = {email: $('#email').val(),subscriber_id: subscriber_id, publisherOrgCode: PAGE_NAME};
	_sendAjaxRequest(url, data, type);
}

function _postSubscriptionSMS(subscriber_id, type){
	var url = '/a/' + PAGE_NAME + '/send-via-sms';
	var data = {mobile: $('#mobNumber').val(), mobileCountry: $('#mobCountry').val(), subscriber_id: subscriber_id, publisherOrgCode: PAGE_NAME};
	_sendAjaxRequest(url, data, type);
}

function _referFriends(subscriber_id, type, e){
	if($('#frndName').val() == ''){
		alert(MSG_ENTER_NAME);
		$('#frndName').focus();
		return;
	}
	
	if($('#contact_list').val() == ''){
		alert(MSG_NO_CONTACTS);
		return;		
	}
	
	var url = '/a/' + PAGE_NAME + '/send-reference';
	var data = {contacts: $('#contact_list').val(), subscriber_id: subscriber_id, title: $('#WT').val(), desc: $('#WD').val(), publisherOrgCode: PAGE_NAME, orgId: ORG_ID, orgName: ORG_NAME, w: REFERRER, f: $('#frndName').val()};
	_sendAjaxRequest(url, data, type, e);
}

function _sendAjaxRequest(url, data, type, e){
	try{ $(e.target).attr('disabled', 'disabled'); }catch(e){}
	
    $.ajax({
        url: url,
        data: data,
        type: 'post',
        success: function(r){
            if(r.status == 'ok'){
            	if(type == 'reference'){
            		alert(MSG_SUCCESS_RECOMENTATION);
            		$('.modal-backdrop').trigger('click');
            	}else{
            		alert(MSG_SENT_SUCCESS_TYPE.replace('{TYPE}', type));
            	}
            }else{
            	if(type == 'reference'){
            		alert(MSG_RECOMENTATION_FAILED);
            		$('.modal-backdrop').trigger('click');
            	}else{
            		alert(MSG_SENT_FAIL_TYPE.replace('{TYPE}', type));
            	}
            }
            
            try{ $(e.target).removeAttr('disabled'); }catch(e){}
            $('a.send-' + type).removeAttr('disabled');
        },
        failure: function(r){
        	try{ $(e.target).removeAttr('disabled'); }catch(e){}
        	$('a.send-' + type).removeAttr('disabled');
        }
    });
}
'use strict';
Modernizr.Detectizr.detect();
var device 	= Modernizr.Detectizr.device;

if(LAYOUT_TYPE == 'L' && IS_BOX){
	
	var modules = ['data.services', 'calendar-tags.services', 'modal.directives', 'modal'];	
	if (device.type != 'desktop') {
		modules.push('hmTouchEvents');
	}
	angular
		.module('widget', modules)
		.config(function($routeProvider){
			$routeProvider
				.when('/event-details/:type/:pageId/:fl',			  {
																	templateUrl : function(params) {
																		//args for prev next btns
																		var fl = params.fl.split('-');
																		var extras = '?f=' + (fl[0] == 0 ? '1&l=' : '0&l=') + ((fl[0] == fl[1] - 1) ? '1' : '0');
																		
																		return '/w/box-event-detail/'
																		+ params.type + '/'
																		+ params.pageId + '/'
																		+ PAGE_NAME + extras;
																		},
																	controller : BoxEventDetailCtrl
																	})
				.when('/events/showcal',                          {templateUrl: '/w/box-show-calendars/'   + PAGE_NAME, controller: BoxShowCalendarCtrl})													
				.when('/events/add/:type/:page',                  {templateUrl: '/w/box-subscribe-menu/'   + PAGE_NAME, controller: BoxSubscriptionMenuCtrl})
				.when('/events/subscribe/:p/:t/:a/',              {templateUrl: '/w/box-subscribe-to-app/' + PAGE_NAME, controller: BoxSubscribeToAppCtrl})
				.when('/events-list/:cid',                        {templateUrl: '/w/box-all-events-list/'  + PAGE_NAME, controller:BoxEventsCtrl})
				.when('/',                                        {controller:BoxCtrl})
				.otherwise({redirectTo:'/'});
		});	
}else if(LAYOUT_TYPE == 'L'){
	angular
		.module('widget', ['data.services', 'calendar-tags.services', 'modal.directives', 'modal', 'scroll','filters'])
		.config(function($routeProvider){
			$routeProvider
				.when('/', {controller:CalendarCtrl})
				.when('/event/:type/:id', {controller:EventCtrl, templateUrl: '/w/event-page?p=' + PAGE_NAME})
				.otherwise({redirectTo:'/'});
		});	
}else if(LAYOUT_TYPE == 'M'){
	angular
	.module('widget', ['data.services', 'modal.directives', 'modal'])
	.config(function($routeProvider){
		$routeProvider
			.when('/', {controller:EventsForMonthCtrl})
			.when('/event/:type/:id', {controller:EventCtrl, templateUrl: '/w/event-page?p=' + PAGE_NAME})
			.otherwise({redirectTo:'/'});
	});
}else if(LAYOUT_TYPE == 'W'){
	angular
	.module('widget', ['data.services', 'modal.directives', 'modal'])
	.config(function($routeProvider){
		$routeProvider
			.when('/', {controller:EventsForWeekCtrl})
			.when('/event/:type/:id', {controller:EventCtrl, templateUrl: '/w/event-page?p=' + PAGE_NAME})
			.otherwise({redirectTo:'/'});
	});
}
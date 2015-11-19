'use strict';

angular.module('filters', []).
	filter('highlight', function () {
    return function (text, target, color) {
    	text = text.toString();
    	target = target.toString();
        var t_index = text.indexOf(target);
        if (t_index != -1) {
        	text = text.replace(target, '<span style="background:' + color +' !important;color: white !important; font-weight: bold !important;padding-left: 5px;padding-right:5px;margin-right: 5px;padding-top:3px;">' + target + '</span>');
        	text = text.replace('[', '');
        	text = text.replace(']', '');
        	return text;
        }
        return text;
    };
});

angular.module('filters', []).
filter('j2s', function () {
return function (text) {
	text = text.toString();
    return text;
};
});

angular.module('data.services', ['ngResource']).factory('Calendar', function($resource) {
	var Calendar = $resource(CALENDAR_API_URL,{pubOrgId: ORG_ID});
	return Calendar;
});

angular.module('calendar-tags.services', ['ngResource']).factory('CalendarTags', function($resource) {
	return $resource(CALENDAR_TAGS_API_URL);
});

angular.module('modal', []).factory('Modal', function($http, $compile) {
	var Modal = {};

    // Get the popup
	Modal.getPopup = function(create)
    {
        if (!Modal.popupElement && create)
        {
        	Modal.popupElement = $( '<div class="modal hide"></div>' );
        	Modal.popupElement.appendTo( 'BODY' );
        }

        return Modal.popupElement;
    }

	Modal.compileAndRunPopup = function (popup, scope, options) {
        $compile(popup)(scope);
        popup.modal(options);
        popup.modal().on('hidden', function () {
        	//Hide all tootips
        	$(this).find('input, textarea, select').each(function(){
        		$(this).tooltip('destroy');
        	});
        });
    }

    // Loads the popup
	Modal.load = function(url, scope, options)
    {
        //var htmlPage = '<div class="modal-header"><h1>Header</h1></div><div class="modal-body">{{body}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="doIt()">Do it</button><button class="btn btn-cancel" ng-click="cancel()">Cancel</button></div>';
		var htmlPage =  '<div class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
							'<div class="modal-header">' +
								'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">x</button>' +
								'<h3 id="myModalLabel">{{title}}</h3>' +
							'</div>' +
							'<span id="modal-body">{{body}}</span>' +
							'{{footer}}' +
						'</div>';
		
		var footer =	'<div class="modal-footer">' +
							'<button class="btn btn-mini btn-cancel" data-dismiss="modal" aria-hidden="true" ng-click="popupCancel()">Close</button>' +
							'<button class="btn btn-mini btn-success" ng-click="popupOk()">Done</button>' +
						'</div>';


		var popup = Modal.getPopup(true);
		scope.title = options.title || '{{title}}';
		
		if(options.popup){
			var w    = 650;
			var h   = 320;
			var left = ( screen.width - w ) / 2;
			var top = ( screen.height - h ) / 2;			
			window.open(url, 'ECAL', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left, true);
			return;
		}else if(options.iframe){
			var iFrame = "<iframe src='{{URL}}' scrolling='no' frameborder='0' height='300px' width='100%'></iframe>";
			htmlPage = htmlPage.replace(/{{title}}/g, options.title || '{{title}}')
							   .replace(/{{STYLE}}/g, 'height:200px;')
							   .replace(/{{body}}/g, iFrame)
							   .replace(/{{URL}}/g, url);
		}else{
	    	$.ajax({
	    		url: url,
	    		type: 'GET',
	    		async: false,
	    		success: function(data){
		            htmlPage = htmlPage.replace(/{{title}}/g, options.title || '{{title}}')
 				   						.replace(/{{STYLE}}/g, '')
 				   						.replace(/{{body}}/g, data)
 				   						.replace(/{{calendarsStr}}/g, scope.calendarsStr)
 				   						.replace(/{{calendarNameStr}}/g, scope.calendarNameStr);
		            scope.body = data;
	    		}
	    	});
		}
		
		if(options && options.showFooter){
			htmlPage = htmlPage.replace(/{{footer}}/g, footer);
		}else{
			htmlPage = htmlPage.replace(/{{footer}}/g, '');
		}
		
		popup.html(htmlPage);
		Modal.compileAndRunPopup(popup, scope, options);
		
		try{enablePlaceholders();}catch(e){}
    };
    
	Modal.close = function()
    {
        var popup = Modal.getPopup();
        if (popup)
        {
            popup.modal('hide');
        }
    }
	
	return Modal;
});
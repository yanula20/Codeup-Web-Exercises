'use strict';


angular.module('scroll', []).directive('whenScrolled', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];
        
        elm.bind('scroll', function() {
            if (raw.scrollTop + raw.offsetHeight  >= raw.scrollHeight / 1.2) {
                scope.$apply(attr.whenScrolled);
            }
        });
    };
});

var directivesModule = angular.module('modal.directives', []);
directivesModule.directive('ngPopup', function(Modal){
    return {
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
        	
        	var event = is_ios()  ? 'touchstart' : "click";

            element.bind( event , function(e)
            {
            	e.stopPropagation();
            	var restriction = attrs['restriction'];
            	if(restriction && (undefined == scope[restriction] || '' == scope[restriction])){
            		//TODO make this more generic
            		alert(NO_CAL_SELECTED);
            		return;
            	}
            	
            	var popupOptions = {};
            	var title = attrs['title'];
                if(title){
                	popupOptions.title = title;
                }

                var iframe = $(this).attr('iframe');
                if(iframe){
                	popupOptions.iframe = iframe;
                }
                
                var popup = $(this).attr('popup');
                if(popup){
                	popupOptions.popup = popup;
                }
                
                var showFooter = $(this).attr('showFooter');
                if(showFooter){
                	popupOptions.showFooter = showFooter;
                } 
            	var ngPopupUrl= attrs['ngPopup'];
            	
            	Modal.load(ngPopupUrl, scope, popupOptions);
            	
            });
        }
    };
});
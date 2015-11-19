$(document).ready(function(){
	Modernizr.Detectizr.detect();
	var device 	= Modernizr.Detectizr.device;
	
	if (device.type != 'desktop') {
		$('#action-menu li:eq(2)').hide();
	}

	$(document).on('click', '.more-event-details', function(){
		$(this).css('display', 'none').closest('#event-details-fields-row').find('.reveal-all').removeClass('reveal-all');
	});
	
	$(window).resize(function() {
		adjustEventListBox();
	});
	
	$(document).on('click', '.box-help', function(){
		if ($(this).closest('.box-show').find('.expandable').is(":visible")) {
			$(this).closest('.box-show').find('.expandable').hide();
		} else {
			$('.expandable').css('display', 'none');
			$(this).closest('.box-show').find('.expandable').css('display', 'block');
		}
	});
		
	adjustEventListBox();
	
	$('#box-widget .fields #mobile').live('focus', function() {
		//var scrollHeight = ($('.fields tr').outerHeight() * 2) + 10;
		//$("#event-add-opt-content").animate({ scrollTop:scrollHeight}, 1000);
		
	});
});

function adjustEventListBox() {
	if($('#box-widget .viewport').length){
		var total_height  = $(window).height();
		var total_width  = $(window).width();
		var filter_offset = $('#box-widget .viewport').offset();
		if (filter_offset) {
			var grid_height = total_height - filter_offset.top - $('.footer').outerHeight() - $('.action-menu-row').outerHeight();
			$('#box-widget .viewport').height(grid_height);
			$('#box-widget #event-list-scroll .span12').height(grid_height - 2);
			var label_width = $('.choose-list-row').width() - 14 -13 - 45;
			$('.choose-list-row label').width(label_width);
			$('#event-details-title span').width(label_width - 4);
			$('#event-detail > .span12').height($('#box-widget .viewport').height() - $('.more-event-details-div').outerHeight() - 4);
			$('#event-detail > .span12').css('margin-bottom' , $('.more-event-details-div').outerHeight() + 'px');
			
			$('#event-add-opt').height($('#box-widget .viewport').height());
			$('#event-add-opt > .span12').height($('#box-widget .viewport').height() - 2);
			$('.cur-cal-name').width(total_width - 45);
		}
		
		$('#action-nav-list').hide();
		var text_width = $('#action-nav-list #add-to-cal').width();
		var menu_width = $('#action-nav-list li:eq(1)').width() * ($('#action-nav-list li').length - 1) 
		var menu_labal_width = $('#action-menu').width() - menu_width - 45;
		$('#action-nav-list li.menu-label').attr('style', 'width: ' + menu_labal_width +'px !important');
		if (menu_labal_width <= 120) {
			if ($('#action-nav-list #add-to-cal').length > 0) {
				var html = $('#action-nav-list #add-to-cal').html();
				html = html.replace('Add to calendar', 'Add to');
				$('#action-nav-list #add-to-cal').html(html);
			}
		}
		$('#action-nav-list').show();
	}
}

function isEventListScrollable(){
	if($('#event-list-content').scrollTop() == 0){
		$('.event-list-scroll-btn').addClass('disabled');
		$('.event-list-scroll-btn.down').removeClass('disabled');
	}else if($('#event-list-content').scrollTop() >= $('#choose-event-list').outerHeight() - 99){
		$('.event-list-scroll-btn').addClass('disabled');
		$('.event-list-scroll-btn.up').removeClass('disabled');
	}else{
		$('.event-list-scroll-btn').removeClass('disabled');
	}
}

function setupPlaceholder(inputid) {
    if ($.browser.webkit) return false;
 
    var target = $('#'+inputid);
    if (target.length==0) {
        target = $('input[type="text"], input[type="email"], input[type="search"]');
    }
 
    target.each( function(i, el) {
        el = $(el);
        var ph = el.attr('placeholder');
        if (!ph) return true;
 
        el.addClass('placeholder');
        el.attr('value', ph);
 
        el.focus( function(e) {
            if( el.val()==ph ) {
                el.removeClass('placeholder');
                el.attr('value', '');
            }
        });
 
        el.blur( function(e) {
            if( $.trim(el.val())=='' ) {
                el.addClass('placeholder');
                el.attr('value', ph);
            }
        });
    });
}
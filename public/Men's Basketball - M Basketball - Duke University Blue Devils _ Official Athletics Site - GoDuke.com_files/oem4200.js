var windowWidth = 0;
var isRotating = false;
var subTimer = 0;
var rotatorTimer = 0;
var doNotIncludeStories = "";
var activeTouch = false;
var rotatorImageSize = 0;
var doInitialSize = true;
var imagesize = 0;

jQuery(document).ready(function() {
	windowWidth = jQuery(window).width();


	if (page__IN_TICKETING_ == "YES" || page_IN_USER_DONOR == "YES"){
		var IGNORE_CALLS = "YES";
	}else{
		var IGNORE_CALLS = "NO";
	}

	
	
	if (IGNORE_CALLS == "NO"){
		if (jQuery("#rotator").length > 0)
		setupRotator();

		jQuery(document).on('click', '#list-menu-button .btn', function() {
		if (jQuery(this).parent().hasClass('show-mobile')) {
			jQuery("#menu-icons").hide();
			jQuery("#menu").css('z-index', '1002');
		}
		else {
			jQuery("#menu-icons").show();
			jQuery("#menu").css('z-index', '1000');
		}
		});

	}

	
	if (IGNORE_CALLS == "NO"){
		if (jQuery("#drippan").length > 0) {		
			jQuery(document).on('click', '#drippan.mobile .header', function() {
				var currentHeader = jQuery("#drippan.mobile .content.active").parent();
				var currentContent = jQuery("#drippan.mobile .content.active");
				var nextContent = jQuery(this).next();
				var nextHeader = this;

				jQuery(currentContent).hide();

				jQuery('.arrow', this).html('&#9660;');
				jQuery('.arrow', currentHeader).html('&#9658;');

				if (!jQuery(nextContent).hasClass('active')) {
					jQuery(nextContent).show();
					jQuery(nextContent).addClass('active');
				}
				
				jQuery(currentContent).removeClass('active');
			});
		}
	}

	jQuery("#search-btn").click(function() {
		jQuery("#searchbox").toggleClass('active');
	});
});

jQuery(window).load(function() {
	if (page__IN_TICKETING_ == "YES" || page_IN_USER_DONOR == "YES"){
		
	}else{
		sizeElements();
	}
	
});

jQuery(window).resize(function() {	

	if (page__IN_TICKETING_ == "YES" || page_IN_USER_DONOR == "YES"){
		
	}else{
		windowWidth = jQuery(window).width();
		sizeElements();
	}


});

function sizeElements() {
	var size = '';
	var siteWidth = 1040;

	if (windowWidth >= siteWidth) {
		size = 'desktop';
	}
	else if (windowWidth < siteWidth && windowWidth >= 768) {
		size = 'tablet';
	}
	else if (windowWidth < 768) {
		size = 'mobile';
	}

	if (!jQuery('body').hasClass(size)) {
		jQuery('body').removeClass('desktop');
		jQuery('body').removeClass('tablet');
		jQuery('body').removeClass('mobile');

		jQuery('body').addClass(size);
	}

	if (!jQuery("#drippan").hasClass('mobile') && windowWidth <= siteWidth) {
		jQuery("#drippan").addClass('mobile');
	}
		
	else if (jQuery("#drippan").hasClass('mobile') && windowWidth > siteWidth) {
		jQuery("#drippan").removeClass('mobile');
	}

	if (jQuery("#news-page").length > 0) {
		sizeNewsColumns(size);
	}

	if (jQuery("#rotator").length > 0) {
		sizeRotator(size);
	}

	if (jQuery("#embedPlayer").length > 0) {
		sizeEmbed(size);
	}
}

function sizeNewsColumns(size) {
	if (size == 'desktop') {
		jQuery("#news-page .top-left").css('width', '648px');
		jQuery("#news-page .mid-left").css('width', '650px');
	}
	else if (size == 'tablet') {
		jQuery("#news-page .top-left").css('width', (jQuery("#news-page").width() - (jQuery("#news-page .top-right").outerWidth(true) + 20))+'px');
		jQuery("#news-page .mid-left").css('width', (jQuery("#news-page .inner-box").width() - (jQuery("#news-page .mid-right").outerWidth(true) + 20))+'px');
	}
	else if (size == 'mobile') {
		jQuery("#news-page .top-left").css('width', 'auto');
		jQuery("#news-page .mid-left").css('width', '100%');
	}
}

function scheduleSetup() {
	if (jQuery("#schedule .event.stats-pregame").length == 0 && jQuery("#schedule .event.stats-futuregame").length == 0 && jQuery("#schedule .event.nodata").length == 0) {
		var slideLeft = Math.round(-(jQuery("#schedule .slider").width() - jQuery("#schedule .content").width()));
		jQuery("#schedule .slider").css('left', (slideLeft+'px'));
	}
	else if (jQuery("#schedule .event.stats-postgame").length > 0 && jQuery("#schedule .event.nodata").length == 0) {
		var slideLeft = Math.round(-jQuery("#schedule .event.stats-postgame:last").position().left+(jQuery("#schedule .content .item").width()));
		if (jQuery("body").hasClass('mobile')) {
			if (jQuery("#schedule .event.stats-pregame").length > 0 || jQuery("#schedule .event.stats-futuregame").length > 0 || jQuery("#schedule .event.stats-livegame").length > 0) {
				slideLeft = Math.round(-(jQuery("#schedule .event.stats-postgame:last").position().left + jQuery("#schedule .event.stats-postgame:last").parent().width()));
			}
			else {
				slideLeft = Math.round(-jQuery("#schedule .event.stats-postgame:last").position().left);
			}
		}
		jQuery("#schedule .slider").css('left', (slideLeft+'px'));
	}
	else {
		jQuery("#schedule .slider").css('left', '0px');
	}

	jQuery("#schedule .content").css('visibility', 'visible');
}

function setupRotator() {
	jQuery("#rotator .main .loading").each(function() {
		jQuery(this).find('.image .rotator-image').append('<img class="block" border="0" src="'+jQuery(this).attr('data-image')+'" />');
		
		jQuery(this).removeClass('loading');
	});

	//bindRotator();
}

function sizeRotator(size) {
	if (jQuery("body").hasClass('responsive')) {
		//rotatorImageSize and windowWidth

		if (size == 'desktop') {
			jQuery("#rotator").height(jQuery("#rotator").width() * (9/16) + 76);
			jQuery("#rotator .main .story").height(jQuery("#rotator").width() * (9/16) + 76);
		}
		else if (size == 'tablet') {
			jQuery("#rotator").height(jQuery("#rotator").width() * (9/16) + 74);
			jQuery("#rotator .main .story").height(jQuery("#rotator").width() * (9/16) + 74);
		}
		else {
			jQuery("#rotator").css('height', 'auto');
			jQuery("#rotator .main .story").height(jQuery("#rotator").width() * (9/16) + 76);
		}

		if (windowWidth <= 400) {
			if (rotatorImageSize != 400) {
				jQuery("#rotator .main .story").each(function() {
					var imgsrc = jQuery(this).attr('data-image').replace('/0/', '/400/');
					jQuery(this).find('.image .rotator-image img').attr('src', imgsrc);
				});

				rotatorImageSize = 400;
			}
		}
		else if (windowWidth <= 640) {
			if (rotatorImageSize != 640) {
				jQuery("#rotator .main .story").each(function() {
					var imgsrc = jQuery(this).attr('data-image').replace('/0/', '/640/');
					jQuery(this).find('.image .rotator-image img').attr('src', imgsrc);
				});

				rotatorImageSize = 640;
			}
		}
		else if (windowWidth <= 800) {
			if (rotatorImageSize != 640) {
				jQuery("#rotator .main .story").each(function() {
					var imgsrc = jQuery(this).attr('data-image').replace('/0/', '/640/');
					jQuery(this).find('.image .rotator-image img').attr('src', imgsrc);
				});

				rotatorImageSize = 640;
			}
		}
		/*else if (windowWidth <= 1024) {
			if (rotatorImageSize != 1024) {
				jQuery("#rotator .main .story").each(function() {
					jQuery(this).css('background-image', 'url('+jQuery(this).attr('data-image').replace('/0/', '/1024/')+')');
				});

				rotatorImageSize = 1024;
			}
		}*/
		else {
			if (rotatorImageSize != 0) {
				jQuery("#rotator .main .story").each(function() {
					var imgsrc = jQuery(this).attr('data-image');
					jQuery(this).find('.image .rotator-image img').attr('src', imgsrc);
				});

				rotatorImageSize = 0;
			}
		}
	}
}

function bindRotator() {
	jQuery("#sub-rotator .story").click(function() {
		var index = jQuery("#sub-rotator .story").index(this);

		doRotate(index);
	});
}

function unbindRotator() {
	jQuery("#sub-rotator .story").unbind('click');
}

function sizeEmbed(size) {
	if (jQuery("body").hasClass('responsive')) {
		jQuery("#embedPlayer").height(jQuery("#embedPlayer").width() / 1.66);
		if (size != 'mobile') {
			jQuery("#embedPlayer").css('left', ((jQuery(window).width()/2)-357)+'px');
			jQuery("#embedPlayer").css('top', ((jQuery(window).height()/2)-250)+'px');
		}
		else {
			jQuery("#embedPlayer").css('left', '0px');
			jQuery("#embedPlayer").css('top', ((jQuery(window).height()/2)-(jQuery("#embedPlayer").height()/2))+'px');
		}
	}
}

function doRotate(num) {
	jQuery("#rotator .main .story.active").removeClass('active');
	jQuery("#rotator .main .story:eq("+num+")").addClass('active');
	jQuery("#sub-rotator .story.active").removeClass('active');
	jQuery("#sub-rotator .story:eq("+num+")").addClass('active');
}

function waitFor(img, callbackFunction, num) {
	if(!img.complete){
		imgWait=setTimeout(function() {waitFor(img, callbackFunction, num)}, 250);
	}
	else{
		window[callbackFunction](num);
	}
} 

function createTouchSwipe(domId) {
	var swipeStartX = 0;
	var swipeStartY = 0;
	var swipeEndX = 0;
	var swipeEndY = 0;

	jQuery(domId).bind('touchstart', function(event) {
		var touch = event.originalEvent.touches[0];
		swipeStartX = touch.pageX;
		swipeStartY = touch.pageY;
		activeTouch = true;
	});
	
	jQuery(domId).bind('touchmove', function(event) {
		if (activeTouch) {
			//this needs to be here for android, else touchend does not register.
			event.preventDefault();
			
			var touch =  event.originalEvent.touches[0];
			
			swipeEndX = touch.pageX;
			swipeEndY = touch.pageY;
			
			//vertical scroll
			if ((swipeStartY - swipeEndY) != 0) {
				jQuery(window).scrollTop(jQuery(window).scrollTop() + (swipeStartY - swipeEndY));
			}
		}
	});
	
	jQuery(domId).bind('touchend', function(event) {
		var rotatorDeltaX = swipeStartX - swipeEndX;
		var rotatorDeltaY = swipeStartY - swipeEndY;

		//click
		if (swipeEndX == 0) {
			//alert('click');
		}
		//swipe was horizontal more than vertical
		else if (Math.abs(rotatorDeltaX) > Math.abs(rotatorDeltaY) && Math.abs(rotatorDeltaX) > (jQuery(window).width() / 8)) {
			if (rotatorDeltaX > 0) {
				jQuery(domId).find('.arrow:eq(1)').trigger('click');
			}
			else {
				jQuery(domId).find('.arrow:eq(0)').trigger('click');
			}
		}
		//swipe was vertical
		else {
			
		}
		
		swipeStartX = 0;
		swipeStartY = 0;
		swipeEndX = 0;
		swipeEndY = 0;
	});
	
	jQuery(domId).bind('touchcancel', function(event) {
	
	});
}

function showNeuLionVid(vidid){
	//rotatorStop();
	if (jQuery('body').hasClass('mobile')) {
		location.href="/mediaPortal/player.dbml?DB_OEM_ID="+page_DB_OEM_ID+"&ID="+vidid;
	}
	else {
		console.log(neulionPlayer);
		jQuery("#embedPlayer").fadeIn(500);
		jQuery("#NeulionVidContainer").fadeIn(500);
		jQuery("#embedPlayerFade").fadeTo(0, .7);
			jQuery("#embedPlayerFade").fadeIn(500);

		neulionPlayer.play({id:vidid});	
		//neulionPlayer(vidid);
		playerRunning = true;
	}
}

function hideNeuLionVid(){
	if (jQuery("#embedPlayer").css('display') != 'none'){
		jQuery("#embedPlayer").fadeOut(500);
		jQuery("#NeulionVidContainer").fadeOut(500);
		jQuery("#embedPlayerFade").fadeOut(500);
		neulionPlayer.stop();		
		//rotatorStart();
	}
}
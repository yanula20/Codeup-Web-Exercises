var countdownTimer;

jQuery(window).load(function() {
	if (countdownSetup.settings.active) {
		//This adds some settings that aren't titan controlled, but seem to be in the old fls/DeepWidgets/js/countdown2.js file
		countdownSetup.settings.alldayStart = 9;
		countdownSetup.settings.keeupfor = 1;
		countdownSetup.settings.allday_duration = 8;
		countdownSetup.settings.timeout_speed = 6000;

		jQuery.ajax({
			url:getBaseUrl()+"/xmlCache/"+page_DB_OEM_ID+"/countdown.json",
			success: function(data) {
				var dataJson = data;

				if (dataJson.indexOf('getGoogleJsonData') > -1) {
					dataJson = dataJson.replace('getGoogleJsonData(', '');
					dataJson = dataJson.substr(0, (dataJson.length - 1));
					dataJson = dataJson.replace('/* callback */', '');
					dataJson = jQuery.trim(dataJson);
				}

				if (dataJson.length > 0)
					countdownBuild(JSON.parse(dataJson));

				if (jQuery("#countdown-details .countdown-event .sport-image").css('display') == 'none') {
					jQuery("#countdown-details .countdown-event .text").width('98%');
				}
				else {
					jQuery("#countdown-details .countdown-event").each(function() {
						jQuery(this).find(".text").width(jQuery(this).width() - jQuery(this).find(".sport-image").outerWidth() - jQuery(this).find(".countdown-links").outerWidth() - 2);
					});
					
				}
			}
		});
	}
});

jQuery(window).resize(function () {
	if (jQuery("#countdown-details .countdown-event").length > 0) {
		if (jQuery("#countdown-details .countdown-event .sport-image").css('display') == 'none') {
			jQuery("#countdown-details .countdown-event .text").width('98%');
		}
		else {
			jQuery("#countdown-details .countdown-event").each(function() {
				jQuery(this).find(".text").width(jQuery(this).width() - jQuery(this).find(".sport-image").outerWidth() - jQuery(this).find(".countdown-links").outerWidth() - 2);
			});
			
		}
	}
});

function countdownBuild(dataJson) {
	//dataJson is a JSON object with data from the countdown.json file.
	//console.log(dataJson);
	
	//xmlData is the XML feed that correlates to the json object.  It contains tournament name.
	var xmlData = jQuery.parseXML(dataJson.responseData.xmlString);

	jQuery('body').append('<div id="deepwidget-countdown"></div>');
	jQuery('body').append('<div id="deepwidget-countdown-show" style="background-image: url(/fls/'+page_DB_OEM_ID+'/DeepWidgets/images/countdown2/bar_bg.gif);color: #'+countdownSetup.settings.subtitle_color+';">Games</div>');
	jQuery("#deepwidget-countdown").append('<table border="0" cellspacing="0" cellpadding="0" id="countdown-table" style="background-image: url(/fls/'+page_DB_OEM_ID+'/DeepWidgets/images/countdown2/bar_bg.gif);"></table>');
	jQuery("#countdown-table").append('<tr></tr>');
	if (countdownSetup.settings.bottom_left_logo_link != '') {
		jQuery("#countdown-table tr").append('<td id="countdown-logo"><a href="'+countdownSetup.settings.bottom_left_logo_link+'"><img id="countdown-logo-image" src="/fls/'+page_DB_OEM_ID+'/DeepWidgets/images/countdown2/logo.png" alt="" /></a></td>');
	}
	else {
		jQuery("#countdown-table tr").append('<td id="countdown-logo"><img id="countdown-logo-image" src="/fls/'+page_DB_OEM_ID+'/DeepWidgets/images/countdown2/logo.png" alt="" /></td>');
	}
	jQuery("#countdown-logo").append('<img id="countdown-logo-tab" src="/fls/'+page_DB_OEM_ID+'/DeepWidgets/images/countdown2/tab_left.png" alt="" border="0" />');
	jQuery("#countdown-logo").append('<div class="event-starts-in '+countdownSetup.settings.tableft_color+'">Event Starts In...</div>');
	jQuery("#countdown-table tr").append('<td id="countdown-time" style="background-image: url(/fls/'+page_DB_OEM_ID+'/DeepWidgets/images/countdown2/countdown_bg.png);"></td>');
	jQuery("#countdown-table tr").append('<td id="countdown-details"></td>');
	jQuery("#countdown-table tr").append('<td id="countdown-arrows"></td>');
	
	var adTdSize = 'normal';
	if (countdownSetup.settings.override_small_ad_width == 160) {
		adTdSize = 'double';
	}
	jQuery("#countdown-table tr").append('<td id="countdown-ad" class="'+adTdSize+'"></td>');
	jQuery("#countdown-table tr").append('<td id="countdown-hide"></td>');

	jQuery("#countdown-arrows").append('<div class="arrow up dwsprite-nav_up_'+countdownSetup.settings.arrow_style+'" alt="Previous"></div>');
	jQuery("#countdown-arrows").append('<div class="arrow down dwsprite-nav_down_'+countdownSetup.settings.arrow_style+'" alt="Next"></div>');

	var smallAdImage = '/fls/'+page_DB_OEM_ID+'/DeepWidgets/images/countdown2/'+countdownSetup.settings.adimg_sm;
	if (countdownSetup.settings.adimg_sm_ext != false) {
		smallAdImage = countdownSetup.settings.adimg_sm_ext;
	}
	var largeAdImage = '/fls/'+page_DB_OEM_ID+'/DeepWidgets/images/countdown2/'+countdownSetup.settings.adimg;
	if (countdownSetup.settings.adimg_ext != false) {
		largeAdImage = countdownSetup.settings.adimg_ext;
	}
	if (countdownSetup.settings.link_small_ad) {
		jQuery("#countdown-ad").append('<a href="'+countdownSetup.settings.data_adlink+'"><img src="'+smallAdImage+'" alt="" /></a>');
	}
	else {
		jQuery("#countdown-ad").append('<div class="small-ad"><img src="'+smallAdImage+'" alt="" /></div>');
		jQuery("#countdown-ad").append('<div class="large-ad"><a href="'+countdownSetup.settings.data_adlink+'"><img src="'+largeAdImage+'" alt="" /></a></div>');
		jQuery("#countdown-ad .large-ad").append('<div class="close-large-ad"><div class="dwsprite-button_closead" alt="Close Ad"></div></div>');
	}

	jQuery("#countdown-hide").append('<a class="schedule-link" href="/main/Schedule.dbml?DB_OEM_ID='+page_DB_OEM_ID+'" target="_NEW" style="color: #'+countdownSetup.settings.subtitle_color+';">Schedule</a>');
	jQuery("#countdown-hide").append('<div class="hide-link '+countdownSetup.settings.showhide_color+'">Hide</div>');

	jQuery("#countdown-details").append('<div class="event-container"></div>');
	jQuery("#countdown-details .event-container").append('<div class="event-slider"></div>');

	jQuery("#countdown-time").append('<div class="time-container '+countdownSetup.settings.incs_color+'"></div>');
	jQuery("#countdown-time .time-container").append('<div class="time-slider"></div>');

	eventCount = 0;
	jQuery(dataJson.responseData.feed.entries).each(function() {
		//var eventInXml = xmlData.childNodes[0].childNodes[0].child.find('item:eq('+eventCount+')');
		var eventid = 'countdown-event'+eventCount;
		var timeid = 'countdown-time'+eventCount;

		var re_date = new RegExp("([0-3]?[0-9](/|-)[0-3]?[0-9](/|-)2[0-9][0-9][0-9])|(2[0-9][0-9][0-9](/|-)[0-3]?[0-9](/|-)[0-3]?[0-9])");
        var re_time = new RegExp("(Time TBA)|(TBA)|(All Day)|([0-1]?[0-9]:[0-5][0-9] (AM|PM)?)");
        var re_sport = new RegExp("BASEBALL|BASKETBALL|FOOTBALL|GOLF|GYMNASTICS|SOCCER|SOFTBALL|SWIMMING|TENNIS|TRACK|CROSS COUNTRY|VOLLEYBALL|BOWLING|RIFLE|HOCKEY|WRESTLING|FIELD HOCKEY|LACROSSE");
        var re_action = new RegExp("STATS|AUDIO|VIDEO|NOTES|TICKETS|PROMOTIONS|ARTICLE|NEW");
        var thissport = re_sport.exec(this.title.toUpperCase());
        var thistime = re_time.exec(this.content)[0];
        var thisdate = re_date.exec(this.title)[0];
        var thislocation = this.contentSnippet.substr(0, this.contentSnippet.indexOf('-')).replace('at', '@');
        var thistimezone = countdownSetup.settings.timezone;
        var timecontent = '';
        var eventclass = ''; 
		var tournamentName = jQuery(xmlData.childNodes[0]).find('channel item:eq('+eventCount+') tournamentName').text();

		var temptime = new Date();
		var currentGMTtime = new Date(temptime.getUTCFullYear(), temptime.getUTCMonth(), temptime.getUTCDate(),  temptime.getUTCHours(), temptime.getUTCMinutes(), temptime.getUTCSeconds());

        var scheduleoffset;
        switch(thistimezone) {
        	case 'ET':
        		scheduleoffset = -5;
        	break;
        	case 'CT':
        		scheduleoffset = -6;
        	break;
        	case 'MT':
        		scheduleoffset = -7;
        	break;
        	case 'PT':
        		scheduleoffset = -8;
        	break;
        	default:
        		console.log('Deepwidgets: time zone not recognized ('+thistimezone+')');
        	break;
        }
        if (temptime.dst()) {
        	scheduleoffset++;
        }

		var timeofgame = new Date();
		var endofgame = new Date();
		var gameGMTtime = new Date();
        var dayDifference = 0;
        var hourDifference = 0;
        var minuteDifference = 0;
        var secondsDifference = 0;

        if (thistime == 'TBA') {
        	thistime = 'Time TBA';
        	timecontent = 'Event Start Time<br />to be Announced';
        	eventclass = " tba";
        	thistimezone = '';
        	timeofgame = null;
        }
        else if (thistime == 'All Day') {
        	thistimezone = '';
        	eventclass = " upcoming";

        	datesplit = thisdate.split('/');
        	//timeofgame.setDate(parseInt(datesplit[1], '10'));
        	timeofgame.setFullYear(parseInt(datesplit[2], '10'));
        	timeofgame.setMonth(parseInt(datesplit[0], '10')-1, parseInt(datesplit[1], '10'));
        	timeofgame.setHours(countdownSetup.settings.alldayStart);
        	timeofgame.setMinutes(0);
        	timeofgame.setSeconds(0);

        	//if (eventCount == 0) {alert(parseInt(datesplit[0], '10'));}

        	gameGMTtime = new Date(timeofgame.getFullYear(), timeofgame.getMonth(), timeofgame.getDate(), timeofgame.getHours(), timeofgame.getMinutes(), timeofgame.getSeconds(), timeofgame.getMilliseconds());
        	gameGMTtime.setHours(gameGMTtime.getHours() - scheduleoffset);

        	endofgame = new Date(gameGMTtime.getTime());
        	endofgame.setHours(endofgame.getHours() + countdownSetup.settings.allday_duration);

        	if (currentGMTtime > gameGMTtime && currentGMTtime < endofgame) {
        		eventclass = " nowplaying";
        		timecontent = "Now Playing";
        	}

        	//if (eventCount == 0) {alert(currentGMTtime+' > '+gameGMTtime);}
        	else if (currentGMTtime > gameGMTtime) {
        		eventclass = " finished";
        		timecontent = 'Event has Finished';
        	}
        }
        else {
        	eventclass = " upcoming";
        	datesplit = thisdate.split('/');
        	timesplit = thistime.replace(' AM', '').replace(' PM', '').split(':');
        	//console.log(timesplit);
        	//timeofgame.setDate(parseInt(datesplit[1], '10'));
        	timeofgame.setFullYear(parseInt(datesplit[2], '10'));
        	timeofgame.setMonth(parseInt(datesplit[0], '10')-1, parseInt(datesplit[1], '10'));
        	
        	//console.log(timeofgame);
        	//console.log(thistime);
        	if (thistime.indexOf('PM') > -1 && parseInt(timesplit[0], '10') != 12) {
        		timeofgame.setHours(parseInt(timesplit[0], '10') + 12);
        	}
        	else {
        		timeofgame.setHours(parseInt(timesplit[0], '10'));
        	}

        	timeofgame.setMinutes(parseInt(timesplit[1], '10'));
        	timeofgame.setSeconds(0);
        	//console.log(timeofgame);

        	gameGMTtime = new Date(timeofgame.getFullYear(), timeofgame.getMonth(), timeofgame.getDate(), timeofgame.getHours(), timeofgame.getMinutes(), timeofgame.getSeconds(), timeofgame.getMilliseconds());
        	
        	gameGMTtime.setHours(gameGMTtime.getHours() - scheduleoffset);

        	endofgame = new Date(gameGMTtime.getTime());
        	endofgame.setHours(endofgame.getHours() + countdownSetup.settings.keeupfor);

        	if (currentGMTtime > gameGMTtime && currentGMTtime < endofgame) {
        		eventclass = " nowplaying";
        		timecontent = "Now Playing";
        	}
        	else if (currentGMTtime > gameGMTtime) {
        		eventclass = " finished";
        		timecontent = 'Event has Finished';
        	}
        }

        if (eventclass == " upcoming") {
        	eventclass = " upcoming has-countdown";

        	//console.log(timeofgame);
        	//console.log(gameGMTtime);
        	//console.log(currentGMTtime);
        	
        	var timeDiff = Math.abs(gameGMTtime.getTime() - currentGMTtime.getTime());
        	//console.log(gameGMTtime);
        	//console.log(currentGMTtime);
        	dayDifference = Math.floor(timeDiff / 36e5 / 24);
	        hourDifference = Math.floor(((timeDiff / 36e5 / 24) - Math.floor(timeDiff / 36e5 / 24)) * 24);
	        minuteDifference = Math.floor(timeDiff % 36e5 / 60000);
	        secondsDifference = Math.floor(timeDiff % 60000 / 1000);

	        //console.log(dayDifference);
	        //console.log(hourDifference);
	        //console.log(minuteDifference);
	        //console.log(secondsDifference);

	        if (dayDifference < 10) {
	        	dayDifference = '0'+dayDifference;
	        }
	        if (hourDifference < 10) {
	        	hourDifference = '0'+hourDifference;
	        }
	        if (minuteDifference < 10) {
	        	minuteDifference = '0'+minuteDifference;
	        }
	        if (secondsDifference < 10) {
	        	secondsDifference = '0'+secondsDifference;
	        }

	        if (dayDifference > 0) {
	        	eventclass = " upcoming has-countdown has-days";
	        }

	        timecontent = '<div class="time-countdown"><span class="days">'+dayDifference+'</span><span class="colon colon-days">:</span><span class="hours">'+hourDifference+'</span><span class="colon">:</span><span class="minutes">'+minuteDifference+'</span><span class="colon-seconds colon">:</span><span class="seconds">'+secondsDifference+'</span></div>';
        	timecontent = timecontent + '<div class="time-text"><span class="days">Days</span><span class="hours">Hours</span><span class="minutes">Minutes</span><span class="seconds">Seconds</span></div>'
        }
        
        //console.log(timeofgame);

		jQuery("#countdown-details .event-slider").append('<div id="'+eventid+'" class="countdown-event'+eventclass+'" sport="'+thissport+'"></div>');
		
		jQuery("#countdown-time .time-slider").append('<div id="'+timeid+'" class="time-event'+eventclass+'">'+timecontent+'</div>');

		jQuery("#"+eventid).append('<div class="sport-image"><div class="dwsprite-icon_'+thissport+'" alt="'+thissport+'"></div></div>');
		jQuery("#"+eventid).append('<div class="text"></div>');
		var eventTitle = this.title.substr(0, this.title.search(re_date) - 1);
		if (tournamentName != null && tournamentName != '')
			eventTitle = eventTitle+' ('+tournamentName+')';

		//truncate title if title is too long
		eventTitle = eventTitle.substr(0, 90);
		
		if (this.link != null && this.link != '') {
			jQuery("#"+eventid+" .text").append('<div class="title" style="color: #'+countdownSetup.settings.data_text_color+';"></div>');
			jQuery("#"+eventid+" .text div.title").append('<a href="'+this.link+'" style="color: #'+countdownSetup.settings.data_text_color+';">'+eventTitle+'</a>');
		}
		else {
			jQuery("#"+eventid+" .text").append('<div class="title" style="color: #'+countdownSetup.settings.data_text_color+';">'+eventTitle+'</div>');
		}

		jQuery("#"+eventid+" .text").append('<div class="date" style="color: #'+countdownSetup.settings.subtitle_color+';">'+thisdate+', '+thistime+' '+thistimezone+' '+thislocation+'</div>');
		
		jQuery("#"+eventid).append('<div class="countdown-links"></div>');
        
        jQuery(this.content).find('a').each(function() {
        	//var linkHtml = jQuery('<div>').append(jQuery(this).clone()).html();
        	var linkHtml = jQuery(this).find('img').attr('alt');
        	linkHtml = linkHtml+jQuery(this).attr('title');

        	if (linkHtml) {
	        	var linkType = re_action.exec(linkHtml.toUpperCase());
	        	var linkHref = jQuery(this).attr('href');

	        	if (!linkType == null || !linkType == '') {
	        		var spriteClass = 'dwsprite-action_'+linkType+'_'+countdownSetup.settings.icon_style;
	        		jQuery("#"+eventid+" .countdown-links").append('<a href="'+linkHref+'" target="_NEW"><div class="image '+spriteClass+'">&nbsp;</div></a>');
		        	//console.log(jQuery('<div>').append(jQuery(this).clone()).html());
		        	//console.log(linkHtml.toUpperCase());
		        	//console.log(linkType);
	        	}
	        	
	        }
        });

		eventCount++;
	});
	
	if (countdownSetup.settings.to_prioritize != false) {
		var eventArray = jQuery.makeArray(jQuery("#countdown-details .event-slider .countdown-event"));
		var timeArray = jQuery.makeArray(jQuery("#countdown-time .time-slider .time-event"));
		var primaryArray = new Array();
		var secondaryArray = new Array();
		var primaryTimeArray = new Array();
		var secondaryTimeArray = new Array();

		jQuery(eventArray).each(function() {
			if (jQuery(this).attr('sport') == countdownSetup.settings.to_prioritize) {
				primaryArray.push(this);
				primaryTimeArray.push(timeArray[jQuery(this).index()]);
			}
			else {
				secondaryArray.push(this);
				secondaryTimeArray.push(timeArray[jQuery(this).index()]);
			}
			//console.log(this);
		});
		//console.log(primaryArray);
		//console.log(secondaryArray);

		jQuery("#countdown-details .event-slider").html(primaryArray);
		jQuery("#countdown-details .event-slider").append(secondaryArray);
		jQuery("#countdown-time .time-slider").html(primaryTimeArray);
		jQuery("#countdown-time .time-slider").append(secondaryTimeArray);
	}

	dwtoggleStartsIn();
	dwcountdownBind();

	jQuery("#countdown-ad .close-large-ad").click(function() {
		dwToggleLargeAd();
	});

	if (countdownSetup.settings.show_ad_on_hover) {
		if (!countdownSetup.settings.link_small_ad) {
			jQuery("#countdown-ad .small-ad").mouseenter(function() {
				dwToggleLargeAd();
			});
		}
	}
	else {
		if (!countdownSetup.settings.link_small_ad) {
			jQuery("#countdown-ad .small-ad").click(function() {
				dwToggleLargeAd();
			});
		}
	}

	jQuery("#countdown-details .event-slider .countdown-event .title").mouseenter(function() {
		jQuery(this).find('a').css('color', '#'+countdownSetup.settings.data_text_color_hover);
	}).mouseleave(function() {
		jQuery(this).find('a').css('color', '#'+countdownSetup.settings.data_text_color);
	});

	dwcountdownStart();

	if (countdownSetup.settings.startopen) {
		dwHide();
	}
	else {
		jQuery("#deepwidget-countdown-show").show();
	}
}

function dwtoggleStartsIn() {
	if (jQuery("#countdown-details .event-slider .countdown-event:eq(0)").hasClass('has-countdown')) {
		jQuery("#countdown-logo .event-starts-in").show();
	}
	else {
		jQuery("#countdown-logo .event-starts-in").hide();
	}
}

function dwToggleLargeAd() {
	if (jQuery("#countdown-ad .large-ad").css('opacity') == 1) {
		
		jQuery("#countdown-ad .large-ad").animate({
			bottom: 0,
			opacity: 0
		}, 250, function() {jQuery("#countdown-ad .large-ad").css('bottom', '-1000px');});
	}
	else {
		jQuery("#countdown-ad .large-ad").css('bottom', '0px');
		jQuery("#countdown-ad .large-ad").animate({
			bottom: 37,
			opacity: 1
		}, 250);
		if(countdownSetup.settings.track_image_url && countdownSetup.settings.track_large_ad_onload && !jQuery("#countdown-ad .large-ad").hasClass('tracked')) {
        	var trackingImage = new Image();
        	trackingImage.src = countdownSetup.settings.track_image_url;

        	jQuery("#countdown-ad .large-ad").addClass('tracked');
       	}
	}
}

function dwHide() {
	if (jQuery("#deepwidget-countdown").css('left') == '0px') {
		if (jQuery("#countdown-ad .large-ad").css('opacity') == 1) {
		
			jQuery("#countdown-ad .large-ad").animate({
				bottom: 0,
				opacity: 0
			}, 250, function() {jQuery("#countdown-ad .large-ad").css('bottom', '-1000px');});
		}

		jQuery("#deepwidget-countdown").animate({
			left: -jQuery(document).width()
		}, 500, function() {jQuery("#deepwidget-countdown").css('left', '-10000px');});
		jQuery("#deepwidget-countdown-show").show();
	}
	else {
		jQuery("#deepwidget-countdown").css('left', -jQuery(document).width()+'px');
		jQuery("#deepwidget-countdown").animate({
			left: 0
		}, 500, function() {jQuery("#deepwidget-countdown-show").hide();});
		
	}
}

function dwcountdownBind() {
	jQuery("#countdown-arrows .arrow.up").click(function() {
		dwcountdownStop();
		dwcountdownUp();
	});
	jQuery("#countdown-arrows .arrow.down").click(function() {
		dwcountdownStop();
		dwcountdownDown();
	});

	jQuery("#countdown-hide .hide-link").click(function() {dwHide();});
	jQuery("#deepwidget-countdown-show").click(function() {dwHide();});
}

function dwcountdownUnbind() {
	jQuery("#countdown-arrows .arrow").unbind('click');
	jQuery("#countdown-hide .hide-link").unbind('click');
	jQuery("#deepwidget-countdown-show").unbind('click');
}

function dwcountdownUp() {
	if (jQuery("#countdown-details .event-container .countdown-event").length > 1) {
		dwcountdownUnbind();
	
		var tempEvent = jQuery("#countdown-details .event-container .countdown-event:last");
		var tempTime = jQuery("#countdown-time .time-container .time-event:last");

		jQuery(tempEvent).remove();
		jQuery(tempTime).remove();

		jQuery("#countdown-details .event-slider").prepend(tempEvent);
		jQuery("#countdown-details .event-slider").css('top', '-35px');
		jQuery("#countdown-time .time-slider").prepend(tempTime);
		jQuery("#countdown-time .time-slider").css('top', '-35px');
		
		jQuery("#countdown-details .event-slider").animate({
			top: 0
		}, 500, function() {
			dwtoggleStartsIn();
			dwcountdownBind();
		});
		jQuery("#countdown-time .time-slider").animate({
			top: 0
		}, 500);
	}
}

function dwcountdownDown() {
	if (jQuery("#countdown-details .event-container .countdown-event").length > 1) {
		dwcountdownUnbind();

		var tempEvent = jQuery("#countdown-details .event-container .countdown-event:first");
		var tempTime = jQuery("#countdown-time .time-container .time-event:first");

		var eventSliderTop = parseInt(jQuery("#countdown-details .event-slider").css('top').replace('px', ''), '10');
		var timeSliderTop = parseInt(jQuery("#countdown-time .time-slider").css('top').replace('px', ''), '10');

		jQuery("#countdown-details .event-slider").animate({
			top: eventSliderTop-35
		}, 500, function() {
			jQuery(tempEvent).remove();
			jQuery("#countdown-details .event-slider").css('top', '0px');
			jQuery("#countdown-details .event-slider").append(tempEvent);

			dwtoggleStartsIn();
			dwcountdownBind();
		});

		jQuery("#countdown-time .time-slider").animate({
			top: timeSliderTop-35
		}, 500, function() {
			jQuery(tempTime).remove();
			jQuery("#countdown-time .time-slider").css('top', '0px');
			jQuery("#countdown-time .time-slider").append(tempTime);
		});
	}
}

function dwcountdownStart() {
	if (countdownSetup.settings.doesrotate)
		countdownTimer = setInterval(function() {dwcountdownDown();}, countdownSetup.settings.timeout_speed);
	setInterval(function() {dwCountdown();}, 1000);
}

function dwcountdownStop() {
	clearInterval(countdownTimer);
}

Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

function dwCountdown() {
	jQuery("#countdown-time .time-event.has-countdown .time-countdown").each(function() {
		//if (!(countSeconds < 0 || countMinutes < 0 || countHours < 0)) {
			days = jQuery.trim(jQuery(this).find('.days').html());
			hours = jQuery.trim(jQuery(this).find('.hours').html());
			minutes = jQuery.trim(jQuery(this).find('.minutes').html());
			seconds = jQuery.trim(jQuery(this).find('.seconds').html());
			
			if (!(seconds <= 0 && minutes <= 0 && hours <= 0 && days <= 0)) {
				seconds--;
				if (seconds < 0) {
					minutes--;
					seconds = 59;
				}
				if (minutes < 0) {
					hours--;
					minutes = 59;
				}
				if (hours < 0) {
					days--;
					hours = 23;
				}
				
				//leading 0s
				if (hours.toString().length < 2)
					hours = '0'+hours;
				if (minutes.toString().length < 2)
					minutes = '0'+minutes;
				if (seconds.toString().length < 2)
					seconds = '0'+seconds;
				
				jQuery(this).find('.days').html(days);
				jQuery(this).find('.hours').html(hours);
				jQuery(this).find('.minutes').html(minutes);
				jQuery(this).find('.seconds').html(seconds);
			}
		//}
	});
	 
}
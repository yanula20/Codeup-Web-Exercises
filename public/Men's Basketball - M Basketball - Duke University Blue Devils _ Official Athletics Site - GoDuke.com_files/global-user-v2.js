/******************************************************************************
Allows responsive site to change between mobile/desktop ads - WM-37714
 ******************************************************************************/
jQuery(document).ready(function() {
	jQuery(window).resize(function() {
		var page_ADS_CURRENT_WIDTH = jQuery(window).width();
		jQuery("div.dc-c").each(function(index,ele) {
			var adTileVar = jQuery(this).attr("data-ad-tile-var");
			var adMobileSize = parseInt(jQuery(this).attr("data-mobile-size"));
			if(page_ADS_CURRENT_WIDTH<=adMobileSize) {
				//show mobile
				if(jQuery("div.dc-mobile",jQuery(this)).length==0) {
					//add mobile ad to page
					jQuery(this).append(eval(adTileVar));
				}
				jQuery("div.dc-desktop",jQuery(this)).hide();
				jQuery("div.dc-mobile",jQuery(this)).show();
			}
			else {
				//show desktop
				if(jQuery("div.dc-desktop",jQuery(this)).length==0) {
					//add desktop ad to page
					jQuery(this).append(eval(adTileVar));
				}
				jQuery("div.dc-mobile",jQuery(this)).hide();
				jQuery("div.dc-desktop",jQuery(this)).show();
			}
		});
	});

	/****************************************************************************************
		Mid-article ad injection
	****************************************************************************************/
	if (jQuery("#GlobalArticleContainer").length > 0 && page_INJECT_VIDS_IN_ARTICLES == 'Y' && page_frm_show_injected_video == '1') {
		var articleParaCount = jQuery("#GlobalArticleContainer p").length;
		if (articleParaCount > 5) {
			var injectAfterParaIndex = Math.round(articleParaCount / 2) - 1;
			var injectAfterPara = jQuery("#GlobalArticleContainer p:eq("+injectAfterParaIndex+")");
			
			jQuery.ajax({
				type:"POST",
				url:getBaseUrl()+"/articleMiddleVideo.dbml",
				data: "DB_OEM_ID="+page_DB_OEM_ID+"&SPID="+page_SPID+"&SPSID="+page_SPSID+"&key="+page_KEY,
				success: function(data) {
					jQuery(injectAfterPara).after('<div id="article-mid-injected"></div>');
					var injectedDiv = jQuery("#article-mid-injected");

					jQuery(injectedDiv).css('height', '0px');
					jQuery(injectedDiv).css('overflow', 'hidden');
					jQuery(injectedDiv).html(data);

					var showAfterScrollY = jQuery(injectedDiv).offset().top;

					jQuery(window).scroll(function() {
						if (jQuery(window).scrollTop()+(jQuery(window).height()/2) > showAfterScrollY && jQuery(injectedDiv).height() == 0) {
							jQuery(injectedDiv).animate({
								height: jQuery("#article-mid-ad-video").height()
							}, 750, function() {
								jQuery("#article-mid-ad-video").contents().find('.playbutton').trigger('click');
							});
						}
					});
				}
				,error: function(XMLHttpRequest, textStatus, errorThrown) {
					//alert("errorThrown:"+errorThrown);
				}
			});
		}
	}

	if (jQuery("#delay-live-now-stats").length == 0)
		livenowStats();
});

function livenowStats() {
	jQuery(".livenow.has-live-stats").each(function() {
		var lnStatsEvent = this;
		var lnContainer = jQuery(this).parent();
		var statsid = jQuery(lnStatsEvent).attr('statsid');
		var sportid = jQuery(lnStatsEvent).attr('sportid');
		var scheduleid = jQuery(lnStatsEvent).attr('scheduleid');
		var sportkey = jQuery(lnStatsEvent).attr('sportkey');
		var homeid = jQuery(lnStatsEvent).attr('hometeamid');
		var awayid = jQuery(lnStatsEvent).attr('visitingteamid');

		 //statsid="#current_live_stats_id#" sportid="#ls_sport_id#" scheduleid="#SCH_GAME_SCHEDULE_ID#" sportkey="#ls_sport_key#" hometeamid="#ls_home_id#" visitingteamid="#ls_away_id#"
		jQuery(lnContainer).append('<div id="stats-event-'+statsid+'" class="live-stats-now stats-livegame stats-event-box" gamestatid="'+statsid+'" sportid="'+sportid+'" scheduleid="'+scheduleid+'" sportkey="'+sportkey+'" hometeamid="'+homeid+'" visitingteamid="'+awayid+'"></div>');
		var lnItem = jQuery(lnContainer).find('.live-stats-now');
		jQuery(lnItem).append('<div class="container"></div>');
		var lnContainer = jQuery(lnItem).find('.container');

		jQuery.ajax({
			type:"POST",
			url:getBaseUrl()+"/rotator/liveStatsInfo.dbml",
			data: "DB_OEM_ID="+page_DB_OEM_ID+"&SPID="+page_SPID+"&SPSID="+page_SPSID+"&ln_game_stat_id="+jQuery(lnStatsEvent).attr('statsid'),
			success: function(data) {
				var statsjson = jQuery.parseJSON(jQuery.trim(data));

				jQuery(lnContainer).append('<div class="ln-sport-name">'+statsjson.live_stat.sportname+'</div>');
				jQuery(lnContainer).append('<div class="ln-away-team stats-away-team"><div class="name">'+statsjson.live_stat.awayname+'</div></div>');
				jQuery(lnContainer).append('<div class="ln-score-info"></div>');
				jQuery(lnContainer).append('<div class="ln-home-team stats-home-team"><div class="name">'+statsjson.live_stat.homename+'</div></div>');
				jQuery(lnContainer).append('<div class="clear"></div>');
				jQuery(lnContainer).append('<div class="ln-stats-link"><a href="/liveStats/newLiveStats.dbml?DB_OEM_ID='+page_DB_OEM_ID+'&SPID='+sportid+'&SPORT_ID='+sportid+'&GAME_STAT_ID='+statsid+'">Follow Live Stats</a></div>');
				jQuery(lnContainer).append('<div class="ln-stats-location stats-location"></div>');
				var lnScores = jQuery(lnContainer).find('.ln-score-info');

				jQuery(lnContainer).find('div.ln-home-team').prepend('<img src="/images/Schools/'+statsjson.live_stat.homeid+'.jpg" alt="" />');
				jQuery(lnContainer).find('div.ln-away-team').prepend('<img src="/images/Schools/'+statsjson.live_stat.awayid+'.jpg" alt="" />');

				jQuery(lnScores).append('<div class="box-30"><div class="score away-score stats-team-score"></div></div>');
				jQuery(lnScores).append('<div class="box-40"><div class="stats-event-period"></div></div>');
				jQuery(lnScores).append('<div class="box-30"><div class="score home-score stats-team-score"></div></div>');
				jQuery(lnScores).append('<div class="clear"></div>');
			
				jQuery("#stats-event-"+statsid).liveStatsRotator({
					statsUpdateAllTimerInterval:(page_SCOREBOARD_REFRESH_TIME*1000),
					statsUpdateAllTimerTimeoutInterval:(page_SCOREBOARD_TIMEOUT_TIME*60000)
				});
			}
			,error: function(XMLHttpRequest, textStatus, errorThrown) {
				//alert("errorThrown:"+errorThrown);
			}
		});
	});
}

function articleMidVideoDone(e) {
	console.log(e);
}

/******************************************************************************
Added a global variable to tell us if the tab is active or not
 ******************************************************************************/
var page_WINDOW_FOCUS = true;
jQuery(document).ready(function () {
	jQuery(window).focus(function() {
		page_WINDOW_FOCUS = true;
	});
	jQuery(window).blur(function() {
		page_WINDOW_FOCUS = false;
	});
});


/******************************************************************************
 WM 15061 ASMALLS
 In roster pages, when the cursor is hovered over a player's name, a popup window
 is created which displays the player's photo, if one is available.
 FROM /oemjs/0/rosterPopup.js
 ******************************************************************************/

function initRosterPopups() {
	var minWidth = 25;
	jQuery('.showPopup').hover(function () { //	On Hover
		var playerID = jQuery(this).attr('playerID');
		var o = jQuery(this).position(); //	Retrieve position of the object
		var moveLeft = jQuery(this).width() * .30;
		var moveUp = -10;
		popup = jQuery('#rosterPopup' + playerID); //	Save popup archive
		popup.show().css('top', o.top + moveUp).css('left', o.left + moveLeft);
		var height = popup.outerHeight();
		popup.css('margin-top', -height);
		var imgHeight = popup.find('img').height(); //	Retrieve height of popup image
		var imgWidth = popup.find('img').width(); //	Retrieve width of popup image
		if (imgWidth < minWidth) {
			imgWidth = minWidth;
		}
		popup.find('.left').height(imgHeight); //	Setting bubble parameters
		popup.find('.right').height(imgHeight);
		popup.find('.up').width(imgWidth);
		popup.find('.bot').width(imgWidth); //	END setting bubble parameters
	}, function (e) { //	On Hover Exit
		if (!jQuery(e.target).is('.showPopup:text')) {
			var playerID = jQuery(this).attr('playerID');
			jQuery('#rosterPopup' + playerID).hide();
		}
	});
}

/******************************************************************************
 FROM /oemjs/0/stdtop/PopupCheck.js
 ******************************************************************************/

function isNullWindow(win) {
	if (win === null || win.focus === null) {
		var text = "This site uses POPUP windows.\n\n";
		text += "We were not able to pop up a window to allow you to view this content.\n\n";
		text += "Please make sure you are not running any popup blocking software.\n\n";
		text += "If you are, please turn it off and restart your browser.\n\n";
		alert(text);
		return true;
	}
	win.focus();
	return false;
}

/******************************************************************************
 FROM inc/VeryBottomOfSite.inc
 ******************************************************************************/

function openStatViewer(eventID, sportID, theHeight, theOEM) {
	var theURL;
	var theWidth = 960;
	var theToolbarLine;
	var addToURL = "KEY=" + page_DB_KEY + "&DB_OEM_ID=" + theOEM + "&DB_ACCOUNT_TYPE=" + page_DB_ACCOUNT_TYPE + "&GAME_STAT_ID=" + eventID + "&SPORT_ID=" + sportID;

	var theBaseServer = "";
	if (page_SHOW_ALL_OEMS) theBaseServer = "http://www.nmnathletics.com";

	theURL = theBaseServer + "/sharedLiveStats/showStatData.dbml?" + addToURL;
	theToolbarLine = "toolbar=no,location=no,menubar=no,status=yes,scrollbars=yes,resizable=yes," + "width=" + theWidth + "," + "height=" + theHeight;
	var windowName = "GAME_STAT_ID_" + theOEM + "_" + sportID;
	var newWindow = window.open(theURL, windowName, theToolbarLine);
	if (isNullWindow(newWindow) == true) {
		return;
	}
	newWindow.focus();
	return false;
}

/******************************************************************************
 FROM inc/VeryBottomOfSite.inc
 ******************************************************************************/

function openFlashViewer(eventID, sportID, theHeight, theOEM) {
	var theURL;
	var theWidth = 960;
	var theToolbarLine;
	var addToURL = "KEY=" + page_DB_KEY + "&DB_OEM_ID=" + theOEM + "&DB_ACCOUNT_TYPE=" + page_DB_ACCOUNT_TYPE + "&GAME_STAT_ID=" + eventID + "&SPORT_ID=" + sportID;

	var theBaseServer = "http://www.nmnathletics.com";
	theURL = theBaseServer + "/sharedLiveStats/showFlashData.dbml?" + addToURL;
	theToolbarLine = "toolbar=no,location=no,menubar=no,status=yes,scrollbars=yes,resizable=yes," + "width=" + theWidth + "," + "height=" + theHeight;
	var windowName = "GAME_STAT_ID_" + theOEM + "_" + sportID;
	var newWindow = window.open(theURL, windowName, theToolbarLine);
	if (isNullWindow(newWindow) == true) {
		return;
	}
	newWindow.focus();
	return false;
}

/******************************************************************************
 FROM inc/ExternalPhotoSeller.inc
 ******************************************************************************/

function goToReplayPhotos(id) {
	if (page_REPLAYPHOTOS_BASE_URL) {
		var serverUrl = page_REPLAYPHOTOS_BASE_URL;
	} else {
		var serverUrl = '';
	}
	if (page_REPLAYPHOTOS_PROVIDER_ID) {
		var storeId = page_REPLAYPHOTOS_PROVIDER_ID;
	} else {
		var storeId = '';
	}

	var location = serverUrl + '/' + storeId + '/purchase.cfm?rM=' + id;
	var win = window.open(location, 'REPLAY_PHOTOS_' + storeId, 'scrollbars=yes, resizable=yes, toolbar=no, ' + 'status=yes,width=' + page_REPLAY_PHOTO_WIDTH + ',height=600, menubar=no');
	win.focus();
}

/******************************************************************************
 FROM inc/ExternalPhotoSeller.inc
 ******************************************************************************/

function goPtp(name, title, m_photographer, t_url, fs_url, photo_is_gallery) {
	var ptpServer = "www.pictopia.com";
	var name_space = page_PICTOPIA_PROVIDER_ID;
	var priceSetUrl = '';
	var priceSet = '';
	//set the price for a gallery photo
	if (photo_is_gallery) {
		priceSetUrl = '&pps=';
		priceSet = 'gallery';
	}

	var loc = 'http://' + ptpServer + '/perl/ptp/' + name_space + '?photo_name=' + name + '&title=' + escape(title) + '&m_photographer=' + m_photographer + '&t_url=' + t_url + '&time=' + new Date().getTime() + '&embedded=y' + '&fs_url=' + fs_url + priceSetUrl + priceSet;

	var win = window.open(loc, 'ptp_' + name_space, 'scrollbars=yes, resizable=yes, toolbar=no, ' + 'status=yes,width=' + page_PICTOPIA_WIDTH + ',height=600,menubar=no');
	win.focus();
}

/******************************************************************************
 FROM user_v2/neulionPlayer/Setup.v2.inc
 ******************************************************************************/

function neulionPlayer(vidid) {
	if (document.getElementById('jtvshlembed') != null) {
		try {
			document.getElementById('jtvshlembed').getVideo(vidid);
		} catch (ex) {
			setTimeout("neulionPlayer(" + vidid + ")", 1000);
		}
	}
}

/******************************************************************************
 FROM user_v2/neulionPlayer/Setup.v2.inc
 ******************************************************************************/

function getBaseUrl() {
	urlTokens = window.location.href.split('/');
	url = urlTokens[0] + '//' + urlTokens[2];
	return url;
}

/******************************************************************************
 FROM user_v2/neulionPlayer/Setup.v2.inc
 ******************************************************************************/
jQuery(document).ready(function () {
	jQuery("#NeulionVidContainer").css("visibility", "hidden").css("display", "block");
	var w = jQuery("#NeulionVidContainer").width();
	var h = jQuery("#NeulionVidContainer").height();
	if (w && h && w > 0 && h > 0) {
		var source = "http://" + document.domain + "/siteMediaPlayer/headlineEmbed/slp.htm?w=" + w + "&h=" + h;
		jQuery("#slpane").attr("src", source);
	}
	jQuery("#NeulionVidContainer").css("display", "none").css("visibility", "visible");
});

/******************************************************************************
 FROM user_v2/neulionPlayer/Setup.v2.inc
 ******************************************************************************/
jQuery(document).ready(function () {
	if (jQuery("#user_v2_neulionPlayer").length > 0) {
		writeFlexPlayer(
		page_WRITEFLEXPLAYER_ID,
		page_WRITEFLEXPLAYER_OEM_ID,
		page_WRITEFLEXPLAYER_IS_PRODUCTION,
		page_WRITEFLEXPLAYER_SITE_NAME,
		page_WRITEFLEXPLAYER_AD_SPORT_ID,
		page_WRITEFLEXPLAYER_COMPANION_DURATION,
		page_GOOGLE_ANALYTICS,
		page_WRITEFLEXPLAYER_LOC_SERVER,
		page_WRITEFLEXPLAYER_LOC_IMAGE,
		page_WRITEFLEXPLAYER_ADPATH,
		page_WRITEFLEXPLAYER_ADTAG);
	}
});

/******************************************************************************
 FROM onDemand/ViewerPopup.js
 ******************************************************************************/

function openOnDemandViewer(clip, clipid) {
	var openOnDemandViewerVars = {};
	openOnDemandViewerVars.theURL = page_SITE_BASE_SERVER;

	// wcsn-509: reflect MP_MEDIAPLAYER site option
	switch (page_MP_MEDIAPLAYER) {
		case 'JTVS_FLEX_WM': case 'JTVS_SILVER_WM':
			// old JTVS media players
			openOnDemandViewerVars.windowDestination = "ONDEMAND";
			openOnDemandViewerVars.theURL += "newMediaPlayer/console.htm?";
			openOnDemandViewerVars.theURL += "&oemid=" + page_DB_OEM_ID;

			if (clipid && clip && clipid > 0 && clip > 0) {
				openOnDemandViewerVars.theURL += "&type=vod";
			} else {
				openOnDemandViewerVars.theURL += "&type=" + page_MP_TAB;
			}

			//WM-9553, if no id is passed, do not append the url to console.htm, it will default to live tab
			if (clipid && clipid > 0) openOnDemandViewerVars.theURL += "&id=" + clipid + "&CLIP_FILE_ID=" + clipid;

			if (clip && clip > 0) openOnDemandViewerVars.theURL += "&CLIP_ID=" + clip;

			break;
		default:
			// JTVS v3,v4 player onward
			openOnDemandViewerVars.theURL += "mediaPortal/player.dbml?";
			openOnDemandViewerVars.theURL += "&db_oem_id=" + page_DB_OEM_ID;
			if (clipid && clipid > 0) openOnDemandViewerVars.theURL += "&id=" + clipid;
			if (page_DB_KEY) { openOnDemandViewerVars.theURL += "&key=" + page_DB_KEY; }

			page_ON_DEMAND_VIEWER_HEIGHT = 1010;
			page_ON_DEMAND_VIEWER_WIDTH = 1050;
			page_ONDEMANDVIEWERSCROLLBARS = 'yes';

			break;
	}

	switch (page_MP_MEDIAPLAYER) {
		case 'V3PLAYER': case 'JTVS_FLEX_WM': case 'JTVS_SILVER_WM':
			openOnDemandViewerVars.theURL += page_DBREWRITEVARS;
			var theToolbarLine = "toolbar=no,location=no,menubar=no,status=yes,scrollbars=" + page_ONDEMANDVIEWERSCROLLBARS + ",resizable=yes,width=" + page_ON_DEMAND_VIEWER_WIDTH + ",height=" + page_ON_DEMAND_VIEWER_HEIGHT;
			var newWindow = window.open(openOnDemandViewerVars.theURL, openOnDemandViewerVars.windowDestination, theToolbarLine);
			if (isNullWindow(newWindow) == true) {
				return;
			}
			newWindow.focus();
			break;
		default: /* V4 player onward */
			location.href = openOnDemandViewerVars.theURL;
			break;
	}

}


/******************************************************************************
 FROM sharedLiveEvents/openLiveEventViewer.js
 ******************************************************************************/
var leFromRotator = false;

function openLiveNowViewer(eventID, speed, theWidth, theHeight, useOnlyID, oemID, serverURL, sportKey) {
	leFromRotator = true;
	if (page_MP_MEDIAPLAYER == 'V4PLAYER')
		location.href = serverURL+'/mediaPortal/player.dbml?&id='+eventID+'&catid=0&KEY=&DB_OEM_ID='+oemID+'&utm_source=internal&utm_medium=rotator&utm_campaign=lerotator';
	else
		openLiveEventViewer(eventID, speed, theWidth, theHeight, useOnlyID, oemID, serverURL, sportKey);
}

function openLiveEventViewer(eventID, speed, theWidth, theHeight, useOnlyID, oemID, serverURL, sportKey) {
	var theURL;
	var theToolbarLine;
	var winname = "LIVE_STREAM_VIEW";
	if (typeof sportKey == 'undefined') {sportKey = null};

	switch (page_MP_MEDIAPLAYER) {
		case 'V3PLAYER':
			winname += eventID;
			break;
		default:
			winname = "_self";
			break;
	}

	if (oemID == null || oemID.length == 0) {
		oemID = page_DB_OEM_ID;
	}
	if (serverURL == null || serverURL.length == 0) {
		serverURL = page_SITE_BASE_SERVER;
	}

	var addToURL = "KEY=" + page_DB_KEY + "&DB_OEM_ID=" + oemID + "&DB_ACCOUNT_TYPE=" + page_DB_ACCOUNT_TYPE + "&CLIP_ID=" + eventID + "&CONTENT_TYPE=EVENT";

	// If the link was clicked from the rotator (live now enhancment)
	if (leFromRotator) {
		addToURL += '&utm_source=internal&utm_medium=rotator&utm_campaign=lerotator';
	}

	switch (page_MP_MEDIAPLAYER) {
		case 'JTVS_FLEX_WM': case 'JTVS_SILVER_WM':
			// old JTVS media players
			theURL = serverURL + "newMediaPlayer/console.htm?type=live&oemid=" + oemID + "&id=" + eventID + "&KEY=" + page_KEY;
			winWidth = 860;
			winHeight = 640;
			if (leFromRotator) {
				theURL += '&utm_source=internal&utm_medium=rotator&utm_campaign=lerotator';
			}
			break;
		default:
			// Titan V3,V4 Player, etc
			theURL = serverURL + "mediaPortal/player.dbml?" + "&id=" + eventID + "&catid=0" + "&KEY=" + page_DB_KEY + "&DB_OEM_ID=" + oemID;
			winWidth = 1024;
			winHeight = 1050;
			if (leFromRotator) {
				theURL += '&utm_source=internal&utm_medium=rotator&utm_campaign=lerotator';
			}
			page_LIVEEVENTVIEWERSCROLLBARS = 'yes';
			break;
	}

	// when Gamecenter enabled and not Audio, check for GC link
	if (page_MP_EXTRA_SPORTONLY == 'Y' && speed != 'LOW') {

		var sportKeys = page_MP_EXTRA_SPORTONLY_SPORTKEYLIST.split(",");
		for (i = 0; i < sportKeys.length; i++) {

			// Gamecenter
			if (sportKey === sportKeys[i]) {

				theURL = serverURL + "gamecenter/console.dbml?db_oem_id=" + oemID + "&spKey=" + sportKey + "&KEY=" + page_KEY;
				if (leFromRotator) {
					theURL += '&utm_source=internal&utm_medium=rotator&utm_campaign=lerotator';
				}
				// Gamecenter has larger window size
				winWidth = 1010;
				winHeight = 700;
			}
		} //end for loop
	} //end if page_MP_EXTRA_SPORTONLY
	// popup window details
	theToolbarLine = "toolbar=no,location=no,menubar=no,scrollbars=" + page_LIVEEVENTVIEWERSCROLLBARS + ",resizable=yes,status=yes,width=" + winWidth + ",height=" + winHeight;

	var newWindow = window.open(theURL, winname, theToolbarLine);

	if (isNullWindow(newWindow) == true) {
		return;
	}
	newWindow.focus();
}
/******************************************************************************
 ******************************************************************************/

/******************************************************************************
 FROM /oemjs/0/stdtop/javascript.js
 ******************************************************************************/
/* replaces /inc/javascript.inc */
var AgntUsr = navigator.userAgent.toLowerCase();
var DomYes = document.getElementById ? 1 : 0;
var NavYes = AgntUsr.indexOf('mozilla') != -1 && AgntUsr.indexOf('compatible') == -1 ? 1 : 0;
var ExpYes = AgntUsr.indexOf('msie') != -1 ? 1 : 0;
var Opr = AgntUsr.indexOf('opera') != -1 ? 1 : 0;
var Opr6orless = window.opera && navigator.userAgent.search(/opera.[1-6]/i) != -1;
var DomNav = DomYes && NavYes ? 1 : 0;
var DomExp = DomYes && ExpYes ? 1 : 0;
var Nav4 = NavYes && !DomYes && document.layers ? 1 : 0;
var Exp4 = ExpYes && !DomYes && document.all ? 1 : 0;
var PosStrt = (NavYes || ExpYes) && !Opr6orless ? 1 : 0;
var isMacIE = AgntUsr.indexOf('mac') != -1 && AgntUsr.indexOf('msie') != -1 ? 1 : 0;

var ok = (document.images ? true : false);

function rollover(whichimg, overimg) {
	return;
	if (ok) {
		eval('document.images["' + whichimg + '"].src = ' + overimg + '.src');
	}
}

if (ok) {
	var arrowjs = new Image();
	arrowjs.src = "/images/300/arrow.gif";
	var arrowjs_on = new Image();
	arrowjs_on.src = "/images/300/arrow_on.gif";
}

function findEl(name) {
	var el = null;
	if (document.getElementById) {
		el = document.getElementById(name);
	} else {
		el = eval("document.all." + name);
	}
	return el;
}

function ItemOn(name) {
	var el = findEl(name);
	if (el === null) {
		return;
	}
	if (Nav4) {
		el.color = "#FFFFFF";
	} else {
		el.style.color = "#FFFFFF";
	}
}

function ItemOff(name) {
	var el = findEl(name);
	if (el === null) {
		return;
	}
	if (Nav4) {
		el.color = "#FFFFFF";
	} else {
		el.style.color = "#FFFFFF";
	}
}

function SetColor(name, fg, bg) {
	var el = findEl(name);
	if (el === null) {
		return;
	}
	if (Nav4) {
		el.bgColor = bg;
		el.color = fg;
	} else {
		el.style.backgroundColor = bg;
		el.style.color = fg;
	}
}

function popWindow(mypage, myname, w, h, scroll) {
	var winl = (screen.width - w) / 2;
	var wint = (screen.height - h) / 2;
	var winprops = 'toolbar=yes,menubar=yes,location=yes,status=yes,resizable=yes,height=' + h + ',width=' + w + ',top=' + wint + ',left=' + winl + ',scrollbars=' + scroll + ',resizable';
	var win = window.open(mypage, myname, winprops);
	if (parseInt(navigator.appVersion) >= 4) {
		win.focus();
	}
}
/******************************************************************************
 ******************************************************************************/

/******************************************************************************
 FROM /www/siteMediaPlayer/headlineEmbed/scripts/AC_OETagsAjax.js
 ******************************************************************************/
// Flash Player Version Detection - Rev 1.6
// Detect Client Browser type
// Copyright(c) 2005-2006 Adobe Macromedia Software, LLC. All rights reserved.
var isIE = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isOpera = (navigator.userAgent.indexOf("Opera") != -1) ? true : false;

function ControlVersion() {
	var version;
	var axo;
	var e;

	// NOTE : new ActiveXObject(strFoo) throws an exception if strFoo isn't in the registry
	try {
		// version will be set for 7.X or greater players
		axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		version = axo.GetVariable("$version");
	} catch (e) {}

	if (!version) {
		try {
			// version will be set for 6.X players only
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");

			// installed player is some revision of 6.0
			// GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
			// so we have to be careful.
			// default to the first public version
			version = "WIN 6,0,21,0";

			// throws if AllowScripAccess does not exist (introduced in 6.0r47)
			axo.AllowScriptAccess = "always";

			// safe to call for 6.0r47 or greater
			version = axo.GetVariable("$version");

		} catch (e) {}
	}

	if (!version) {
		try {
			// version will be set for 4.X or 5.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = axo.GetVariable("$version");
		} catch (e) {}
	}

	if (!version) {
		try {
			// version will be set for 3.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.3");
			version = "WIN 3,0,18,0";
		} catch (e) {}
	}

	if (!version) {
		try {
			// version will be set for 2.X player
			axo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			version = "WIN 2,0,0,11";
		} catch (e) {
			version = -1;
		}
	}

	return version;
}

// JavaScript helper required to detect Flash Player PlugIn version information

function GetSwfVer() {
	// NS/Opera version >= 3 check for Flash plugin in plugin array
	var flashVer = -1;

	if (navigator.plugins != null && navigator.plugins.length > 0) {
		if (navigator.plugins["Shockwave Flash 2.0"] || navigator.plugins["Shockwave Flash"]) {
			var swVer2 = navigator.plugins["Shockwave Flash 2.0"] ? " 2.0" : "";
			var flashDescription = navigator.plugins["Shockwave Flash" + swVer2].description;
			var descArray = flashDescription.split(" ");
			var tempArrayMajor = descArray[2].split(".");
			var versionMajor = tempArrayMajor[0];
			var versionMinor = tempArrayMajor[1];
			var versionRevision = descArray[3];
			if (versionRevision == "") {
				versionRevision = descArray[4];
			}
			if (versionRevision[0] == "d") {
				versionRevision = versionRevision.substring(1);
			} else if (versionRevision[0] == "r") {
				versionRevision = versionRevision.substring(1);
				if (versionRevision.indexOf("d") > 0) {
					versionRevision = versionRevision.substring(0, versionRevision.indexOf("d"));
				}
			}
			var flashVer = versionMajor + "." + versionMinor + "." + versionRevision;
		}
	}
	// MSN/WebTV 2.6 supports Flash 4
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) flashVer = 4;
	// WebTV 2.5 supports Flash 3
	else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.5") != -1) flashVer = 3;
	// older WebTV supports Flash 2
	else if (navigator.userAgent.toLowerCase().indexOf("webtv") != -1) flashVer = 2;
	else if (isIE && isWin && !isOpera) {
		flashVer = ControlVersion();
	}
	return flashVer;
}

// When called with reqMajorVer, reqMinorVer, reqRevision returns true if that version or greater is available

function DetectFlashVer(reqMajorVer, reqMinorVer, reqRevision) {
	versionStr = GetSwfVer();
	if (versionStr == -1) {
		return false;
	} else if (versionStr != 0) {
		if (isIE && isWin && !isOpera) {
			// Given "WIN 2,0,0,11"
			tempArray = versionStr.split(" "); // ["WIN", "2,0,0,11"]
			tempString = tempArray[1]; // "2,0,0,11"
			versionArray = tempString.split(","); // ['2', '0', '0', '11']
		} else {
			versionArray = versionStr.split(".");
		}
		var versionMajor = versionArray[0];
		var versionMinor = versionArray[1];
		var versionRevision = versionArray[2];

		// is the major.revision >= requested major.revision AND the minor version >= requested minor
		if (versionMajor > parseFloat(reqMajorVer)) {
			return true;
		} else if (versionMajor == parseFloat(reqMajorVer)) {
			if (versionMinor > parseFloat(reqMinorVer)) return true;
			else if (versionMinor == parseFloat(reqMinorVer)) {
				if (versionRevision >= parseFloat(reqRevision)) return true;
			}
		}
		return false;
	}
}

function AC_AddExtension(src, ext) {
	if (src.indexOf('?') != -1) return src.replace(/\?/, ext + '?');
	else return src + ext;
}

function AC_Generateobj(objAttrs, params, embedAttrs) {
	var str = '';
	if (isIE && isWin && !isOpera) {
		str += '<object ';
		for (var i in objAttrs)
		str += i + '="' + objAttrs[i] + '" ';
		str += '>';
		for (var i in params)
		str += '<param name="' + i + '" value="' + params[i] + '" /> ';
		str += '</object>';
	} else {
		str += '<embed ';
		for (var i in embedAttrs)
		str += i + '="' + embedAttrs[i] + '" ';
		str += '> </embed>';
	}

	jQuery("#user_v2_neulionPlayer").prepend(str);
}

function AC_FL_RunContent() {
	var ret = AC_GetArgs(arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000", "application/x-shockwave-flash");
	AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType) {
	var ret = new Object();
	ret.embedAttrs = new Object();
	ret.params = new Object();
	ret.objAttrs = new Object();
	for (var i = 0; i < args.length; i = i + 2) {
		var currArg = args[i].toLowerCase();

		switch (currArg) {
		case "classid":
			break;
		case "pluginspage":
			ret.embedAttrs[args[i]] = args[i + 1];
			break;
		case "src":
		case "movie":
			args[i + 1] = AC_AddExtension(args[i + 1], ext);
			ret.embedAttrs["src"] = args[i + 1];
			ret.params[srcParamName] = args[i + 1];
			break;
		case "onafterupdate":
		case "onbeforeupdate":
		case "onblur":
		case "oncellchange":
		case "onclick":
		case "ondblClick":
		case "ondrag":
		case "ondragend":
		case "ondragenter":
		case "ondragleave":
		case "ondragover":
		case "ondrop":
		case "onfinish":
		case "onfocus":
		case "onhelp":
		case "onmousedown":
		case "onmouseup":
		case "onmouseover":
		case "onmousemove":
		case "onmouseout":
		case "onkeypress":
		case "onkeydown":
		case "onkeyup":
		case "onload":
		case "onlosecapture":
		case "onpropertychange":
		case "onreadystatechange":
		case "onrowsdelete":
		case "onrowenter":
		case "onrowexit":
		case "onrowsinserted":
		case "onstart":
		case "onscroll":
		case "onbeforeeditfocus":
		case "onactivate":
		case "onbeforedeactivate":
		case "ondeactivate":
		case "type":
		case "codebase":
			ret.objAttrs[args[i]] = args[i + 1];
			break;
		case "id":
		case "width":
		case "height":
		case "align":
		case "vspace":
		case "hspace":
		case "class":
		case "title":
		case "accesskey":
		case "name":
		case "tabindex":
			ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i + 1];
			break;
		default:
			ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i + 1];
		}
	}
	ret.objAttrs["classid"] = classid;
	if (mimeType) ret.embedAttrs["type"] = mimeType;
	return ret;
}
/******************************************************************************
 ******************************************************************************/

/******************************************************************************
 FROM /www/siteMediaPlayer/headlineEmbed/scripts/flexplayer.js
 ******************************************************************************/
// -----------------------------------------------------------------------------
// Globals
// Major version of Flash required
var requiredMajorVersion = 9;
// Minor version of Flash required
var requiredMinorVersion = 0;
// Minor version of Flash required
var requiredRevision = 28;
// -----------------------------------------------------------------------------
// Version check for the Flash Player that has the ability to start Player Product Install (6.0r65)
var hasProductInstall = DetectFlashVer(6, 0, 65);

// Version check based upon the values defined in globals
var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

var g_lastPath = null;
var g_lastId = null;
var g_lastChannelId = null;
var g_isIE = (window.navigator.userAgent.indexOf("MSIE") > 0);
var jtvshl_aniSpeed = 8; // Animation speed - bigger==faster
var jtvshl_direction = "right"; // Can be "right" | "bottom"
var jtvshl_debug = false;
var jtvshl_dbgDiv = null;

function playWMV(path, x, y, volume) {
	g_lastPath = path;
	if (g_isIE) {
		var wmp = document.getElementById("wmppane");
		wmp.style.left = x + "px";
		wmp.style.top = y + "px";
		wmp.style.display = "";
		wmp = wmp.contentWindow.document.getElementById("wmpMain");
		wmp.url = path;
		wmp.settings.volume = volume;
	} else {
		var wmp = document.getElementById("wmppane");
		wmp.style.left = x + "px";
		wmp.style.top = y + "px";
		wmp.style.display = "";
		wmp.contentWindow.writeWMP(path, 270, null, null, null, null, null, null, false)
		return;
		var win = window.open("popupplayer.jsp", "wmvplayer", "scrollbars=yes,menubar=no,height=270,width=480,top=0,left=0,resizable=no,toolbar=no,location=no,status=yes");
		if (win != null) win.focus();
	}
}

function wmpProxy(action, value) {
	var wmp = document.getElementById("wmppane").contentWindow.document.getElementById("wmpMain");
	switch (action) {
	case "fullscreen":
		wmp.fullScreen = true;
		break;
	case "stop":
		wmp.controls.stop();
		break;
	case "pause":
		wmp.controls.pause();
		break;
	case "play":
		wmp.controls.play();
		break;
	case "setvolume":
		wmp.settings.volume = value;
		break;
	case "getvolume":
		return wmp.settings.volume;
		break;
	case "shareshow":
		document.getElementById("wmppane").style.display = "none";
		break;
	case "sharehide":
		document.getElementById("wmppane").style.display = "";
		break;
	case "position":
		var p = document.getElementById("wmppane");
		p.style.left = value[0] + "px";
		p.style.top = value[1] + "px";
		break;
	case "ecm":
		wmp.enableContextMenu = true;
		break;
	case "hide":
		if (g_isIE) wmp.controls.stop();
		else document.getElementById("wmppane").contentWindow.writeWMP("");
		document.getElementById("wmppane").style.display = "none";
	}
}

function popupReady(win) {
	win.playWMV(g_lastPath, g_lastId, g_lastChannelId);
}

function slShowHide(sl, show, move) {
	if (show) {
		sl.style.width = "100%";
		sl.style.height = "100%";
	} else {
		sl.style.width = "1px";
		sl.style.height = "1px";
	}
}

function playSL(path, x, y, volume) {
	var sl = document.getElementById("slpane");
	sl.style.left = x + "px";
	sl.style.top = y + "px";
	slShowHide(sl, true);
	sl = sl.contentWindow.document.getElementById("iptvslembed");
	sl.content.Page.playSL(path, volume);
}

function slProxy(action, value) {
	var sl = document.getElementById("slpane").contentWindow.document.getElementById("iptvslembed");
	switch (action) {
	case "stop":
		sl.content.Page.stop();
		break;
	case "pause":
		sl.content.Page.pause();
		break;
	case "play":
		sl.content.Page.play();
		break;
	case "setvolume":
		sl.content.Page.setVolume(value);
		break;
	case "getvolume":
		return sl.content.Page.getVolume();
		break;
	case "share":
		sl.content.Page.updateShare(value);
		break;
	case "shareshow":
		slShowHide(document.getElementById("slpane"), false, false);
		break;
	case "sharehide":
		slShowHide(document.getElementById("slpane"), true);
		break;
	case "position":
		var p = document.getElementById("slpane");
		p.style.left = value[0] + "px";
		p.style.top = value[1] + "px";
		break;
	case "hide":
		try {
			sl.content.Page.stop();
		} catch (e) {}
		slShowHide(document.getElementById("slpane"), false, true);
		break;
	case "updateprevnext":
		sl.content.Page.updatePrevNext(value[0], value[1]);
		break;
	}
}

function slCallback(action, value) {
	var obj = document.getElementById("jtvshlembed");
	if (obj != null && obj.slCallback != null) {
		if (action == "shareshow") slShowHide(document.getElementById("slpane"), false, false);
		obj.slCallback(action, value);
	}
}

function getPageUrl() {
	var url = window.location.href;
	var i = url.indexOf("?");
	if (i > 0) url = window.location.href.substring(0, i);
	url = url.substring(0, url.lastIndexOf("/"));
	var u = url.substring(url.indexOf("://") + 3);
	if (u.indexOf("/") == -1) url += "/mediaPortal";
	url += "/";
	return url;
}
var iptvCompanionDuration = 0;

function writeFlexPlayer(id, oemId, isProduction, siteName, adSportId, companionDuration, googleAccount, locServer, locImage,adPath,adTag) {
	// companionDuration of -1 means companion stays out until user closes it
	// companionDuration of 0 means companion closes with pre-roll completion
	// companionDuration of >0 specifies the number of seconds the companion will auto-close
	if (companionDuration != null && !isNaN(companionDuration)) iptvCompanionDuration = companionDuration;

	var serverStr = "server=" + location.href.substring(0, location.href.lastIndexOf("/") + 1);
	var consoleStr = "embed";

	if (isProduction) {
		if (oemId != null) serverStr = "server=" + locServer + "XML/titanv3/";
		else serverStr = "server=" + locServer;
		consoleStr = locImage + consoleStr;
	}
	if (hasProductInstall && !hasRequestedVersion) {
		// MMdoctitle is the stored document.title value used by the installation process to close the window that started the process
		// This is necessary in order to close browser windows that are still utilizing the older version of the player after installation has completed
		// DO NOT MODIFY THE FOLLOWING FOUR LINES
		// Location visited after installation is complete if installation is required
		var MMPlayerType = (isIE == true) ? "ActiveX" : "PlugIn";
		var MMredirectURL = window.location;
		document.title = document.title.slice(0, 47) + " - Flash Player Installation";
		var MMdoctitle = document.title;

		AC_FL_RunContent("src", "http://smb.cdn.neulion.com/u/jtvshl/player/scripts/playerProductInstall", "FlashVars", "MMredirectURL=" + MMredirectURL + '&MMplayerType=' + MMPlayerType + '&MMdoctitle=' + MMdoctitle + "", "width", "100%", "height", "100%", "align", "middle", "id", "console", "quality", "high", "bgcolor", "#000000", "name", "console", "allowScriptAccess", "always", "type", "application/x-shockwave-flash", "pluginspage", "http://www.adobe.com/go/getflashplayer");
	} else if (hasRequestedVersion) {

		var flashVars = new Array();
		if (g_isIE) flashVars[flashVars.length] = "isie=true";
		flashVars[flashVars.length] = serverStr;
		if (oemId != null) {flashVars[flashVars.length] = "jtv=" + oemId;}
		if (id != null) {flashVars[flashVars.length] = "id=" + id;}
		flashVars[flashVars.length] = "sitename=" + siteName;
		if (adSportId != null) {flashVars[flashVars.length] = "adsportid=" + adSportId;}
		if (googleAccount != null) {flashVars[flashVars.length] = "gaa=" + googleAccount;}
		if (adPath!=null && adPath.length>0)
			{flashVars[flashVars.length] = "adpath=" + adPath;}
		if (adTag!==undefined && adTag.length > 0){
			{flashVars[flashVars.length] = "adtag=" + adTag;}
		}
		if (window.location.search.length > 1) {
			var nvs = window.location.search.substring(1).split("&");
			if (nvs.length > 0) {
				for (var i = 0; i < nvs.length; i++) {
					flashVars[flashVars.length] = nvs[i];
				}
			}
		}
		flashVars[flashVars.length] = "referrer=" + encodeURIComponent(document.referrer);

		// if we've detected an acceptable version
		// embed the Flash Content SWF when all tests are passed
		AC_FL_RunContent("flashVars", flashVars.join("&"), "src", consoleStr, "width", "100%", "height", "100%", "align", "middle", "id", "jtvshlembed", "quality", "high", "bgcolor", "#000000", "name", "jtvshlembed", "wmode", "transparent", "allowFullScreen", "true", "allowScriptAccess", "always", "type", "application/x-shockwave-flash", "pluginspage", "http://www.adobe.com/go/getflashplayer");
	} else { // flash is too old or we can't detect the plugin
		var alternateContent = '<div class="download-flash-message">This content requires the Adobe Flash Player ' + '<a target="_GET_FLASH" href="http://www.adobe.com/go/getflash/">Get Flash</a></div>';
		//document.write(alternateContent); // insert non-flash content
		jQuery("#user_v2_neulionPlayer").html(alternateContent);
	}
}

function getSessionId() {
	var sid = "";
	if (document.cookie != null && document.cookie.length > 0) {
		var crumbs = document.cookie.split(";");
		for (var i = 0; i < crumbs.length; i++) {
			var curCrumb = crumbs[i].split("=");
			if (curCrumb[0].indexOf("JSESSIONID") == 0) {
				if (unescape(curCrumb[1]) != "undefined") {
					sid = unescape(curCrumb[1]);
					break;
				}
			}
		}
	}
	return sid;
}

function jtvshlDbgMessage(strMessage) {
	if (jtvshl_debug) {
		if (jtvshl_dbgDiv == null) {
			jtvshl_dbgDiv = document.createElement("div");
			jtvshl_dbgDiv.id = "jtvshl_dbgDiv";
			jtvshl_dbgDiv.style.fontFamily = "arial";
			jtvshl_dbgDiv.style.fontSize = "8pt";
			jtvshl_dbgDiv.style.backgroundColor = "#D0D0D0";
			jtvshl_dbgDiv.style.border = "1px solid gray";
			jtvshl_dbgDiv.innerHTML = "DEBUG";
			jtvshl_dbgDiv.style.position = "absolute";
			jtvshl_dbgDiv.style.left = "5px";
			jtvshl_dbgDiv.style.top = "5px";
			jtvshl_dbgDiv.style.padding = "5px";
			document.body.appendChild(jtvshl_dbgDiv);

			var adContainer = document.getElementById("jtvshlAdContainer");
			if (adContainer != null) adContainer.style.border = "2px solid red";
		}

		jtvshl_dbgDiv.innerHTML += " | " + strMessage;
	}
}

function iptvShowCompanions(playerX, playerY, companions) {
	for (var i = 0; i < companions.length; i++) {
		var adsize = companions[i][0];
		switch (adsize) {
		case "300x250":
			jtvshlShowFirstCompanion(playerX, playerY, companions[i]);
			if (iptvCompanionDuration > 0) setTimeout("iptvHideCompanions(true)", iptvCompanionDuration * 1000);
			break;
		}
	}
}

function iptvHideCompanions(hide) {
	if (iptvCompanionDuration == 0 || hide == true) {
		var tbl = document.getElementById("jtvshlAdTbl");
		if (tbl != null) {
			if (!g_isIE && document.getElementById("jtvshlIFrame") != null) document.getElementById("jtvshlIFrame").style.display = "none";

			document.getElementById("jtvshlAdContainer").style.display = "";
			if (jtvshl_direction == "right") tbl.setAttribute("anim_destX", (-1 * tbl.offsetWidth));
			else tbl.setAttribute("anim_destY", (-1 * tbl.offsetHeight));

			jtvshlStartAnimation(true);
		}
	}
}

/*function iptvPrerollComplete()
{
	alert("PREROLL COMPLETE");
}*/

function jtvshlShowFirstCompanion(playerX, playerY, companion) {
	var adContainer = document.getElementById("jtvshlAdContainer");
	if (adContainer == null) {
		adContainer = document.createElement("div");
		adContainer.id = "jtvshlAdContainer"
		adContainer.style.width = "320px";
		adContainer.style.height = "290px";
		adContainer.style.position = "absolute";
		adContainer.style.overflow = "hidden";
		document.body.appendChild(adContainer);

		var tbl = document.createElement("table");
		tbl.style.backgroundColor = "#666666";
		tbl.id = "jtvshlAdTbl";
		tbl.cellPadding = "0";
		tbl.cellSpacing = "0";
		tbl.style.position = "absolute";
		tbl.style.top = "0px";
		tbl.style.width = "320px";
		tbl.style.height = "290px";
		var oRow1 = tbl.insertRow(-1);
		var oCell = oRow1.appendChild(document.createElement("td"));
		oCell.style.width = "100%";
		oCell.style.textAlign = "right";
		oCell.style.paddingRight = "3px";
		oCell.innerHTML = "<a style='color:#FFFFFF;font-size:8pt;font-family:arial' href='javascript:iptvHideCompanions(true)'>CLOSE</a>";

		var oRow2 = tbl.insertRow(-1);
		oRow2.style.height = "100%";
		var oCell2 = oRow2.appendChild(document.createElement("td"));
		oCell2.style.padding = "5px";
		oCell2.vAlign = "top";

		var oDiv = oCell2.appendChild(document.createElement("div"));
		oDiv.id = "jtvshlAdDiv";
		oDiv.style.width = "300px";
		oDiv.style.height = "250px";

		adContainer.appendChild(tbl);
	}

	var obj = document.getElementById("jtvshlembed");
	if (obj) {
		obj = obj.parentNode;
		// Position ad container
		var x_pos = 0;
		var y_pos = 0;

		var temp = obj;
		do {
			x_pos += temp.offsetLeft;
			y_pos += temp.offsetTop;
			temp = temp.offsetParent;
		}
		while (temp != null)

		if (jtvshl_direction == "right") {
			adContainer.style.left = (x_pos + obj.offsetWidth) + "px";
			adContainer.style.top = y_pos + "px";
		} else {
			adContainer.style.left = x_pos + "px";
			adContainer.style.top = (y_pos + obj.offsetHeight) + "px";
		}


		// Set HTML for ad
		var strAdHTML = "";

		if ("iframe" == companion[1] && companion[2] != null) {
			strAdHTML = "<iframe id='jtvshlIFrame' width='300' height='250' frameborder='0' scrolling='no' src='" + companion[2] + "'></iframe>";
		} else if ("html" == companion[1] && companion[2] != null) {
			strAdHTML = companion[2];
		} else if ("swf" == companion[1] && companion[2] != null) {
			strAdHTML = "<object width='300' height='250' id='jtvshlSWF' classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000'><param name='movie' value='" + companion[2] + "' /><embed name='jtvshlSWF' pluginspage='http://www.adobe.com/go/getflashplayer' src='" + companion[2] + "' type='application/x-shockwave-flash' width='300' height='250'></embed></object>";
		} else if ("img" == companion[1] && companion[2] != null) {

			if (companion[3] != null && companion[3].length > 0) strAdHTML = "<a href='" + companion[3] + "' target='_blank'>";

			strAdHTML += "<img src='" + companion[2] + "' border='0' />";

			if (companion[3] != null && companion[3].length > 0) strAdHTML += "</a>";
		}

		if (!g_isIE) document.getElementById("jtvshlAdDiv").style.display = "none";

		document.getElementById("jtvshlAdDiv").innerHTML = strAdHTML;

		// Animate ad table within ad box
		var tbl = document.getElementById("jtvshlAdTbl");

		if (jtvshl_direction == "right") {
			document.getElementById("jtvshlAdContainer").style.display = "";
			tbl.style.left = (-1 * tbl.offsetWidth) + "px";
			jtvshlDbgMessage("Setting Left:" + tbl.style.left);
			tbl.setAttribute("anim_destX", 0);
		} else {
			document.getElementById("jtvshlAdContainer").style.display = "";
			tbl.style.top = (-1 * tbl.offsetHeight) + "px";
			jtvshlDbgMessage("Setting Top:" + tbl.style.top);
			tbl.setAttribute("anim_destY", 0);
		}

		jtvshlStartAnimation(false);
	}

}

function jtvshlStartAnimation(bMoveIn) {
	jtvshlDbgMessage("startAnimation: " + bMoveIn);
	document.getElementById("jtvshlAdContainer").style.display = "";
	jtvshlAnimateItem(bMoveIn);
}

function jtvshlAnimateItem(bMoveIn) {
	var obj = document.getElementById("jtvshlAdTbl");

	var currLeft = obj.offsetLeft;
	var currTop = obj.offsetTop;

	if (jtvshl_direction == "right") {
		var iTargetPosX = obj.getAttribute("anim_destX");
		if (iTargetPosX != null) {
			jtvshlDbgMessage(currLeft);
			if ((bMoveIn && (currLeft - jtvshl_aniSpeed <= iTargetPosX)) || (!bMoveIn && (currLeft + jtvshl_aniSpeed >= iTargetPosX))) {
				jtvshlDbgMessage("MoveIn: " + bMoveIn);
				jtvshlDbgMessage("CurrLeft: " + currLeft);
				jtvshlDbgMessage("Speed: " + jtvshl_aniSpeed);
				jtvshlDbgMessage("TargetXPos: " + iTargetPosX);

				obj.style.left = iTargetPosX + "px"; // Stop animating
				document.getElementById("jtvshlAdDiv").style.display = "";
				if (bMoveIn) document.getElementById("jtvshlAdContainer").style.display = "none";
			} else {
				if (bMoveIn) {
					if (document.getElementById("jtvshlAdContainer").style.display == "none") return;
					obj.style.left = currLeft - jtvshl_aniSpeed + "px";
					setTimeout("jtvshlAnimateItem(true)", 1);
				} else {
					obj.style.left = currLeft + jtvshl_aniSpeed + "px";
					setTimeout("jtvshlAnimateItem(false)", 1);
				}
			}
		}
	} else {
		var iTargetPosY = obj.getAttribute("anim_destY");
		if (iTargetPosY != null) {
			jtvshlDbgMessage(currTop);
			if ((bMoveIn && (currTop - jtvshl_aniSpeed <= iTargetPosY)) || (!bMoveIn && (currTop + jtvshl_aniSpeed >= iTargetPosY))) {
				jtvshlDbgMessage("MoveIn: " + bMoveIn);
				jtvshlDbgMessage("CurrTop: " + currTop);
				jtvshlDbgMessage("Speed: " + jtvshl_aniSpeed);
				jtvshlDbgMessage("TargetYPos: " + iTargetPosY);

				obj.style.top = iTargetPosY + "px"; // Stop animating
				document.getElementById("jtvshlAdDiv").style.display = "";
				if (bMoveIn) document.getElementById("jtvshlAdContainer").style.display = "none";
			} else {
				if (bMoveIn) {
					obj.style.top = currTop - jtvshl_aniSpeed + "px";
					setTimeout("jtvshlAnimateItem(true)", 1);
				} else {
					obj.style.top = currTop + jtvshl_aniSpeed + "px";
					setTimeout("jtvshlAnimateItem(false)", 1);
				}
			}
		}
	}
}

/*************************************************************************************************

Live Stats Rotator

*************************************************************************************************/
if (jQuery(".has-live-stats").length > 0 && jQuery("#delay-live-now-stats").length == 0) {
	(function( $ ){

		if(!window.console) console = {log: function() {}};
		var parentObj = false;
		var options = false;
		var funcCounter = 1;

		/* Removed for now.
		jQuery(window).blur(function(){
			jQuery("body").addClass("stats-blur");
		});
		jQuery(window).focus(function(){
			jQuery("body").removeClass("stats-blur");
		});
		*/

		// default configuration properties
		var defaults = {
			statsUpdateAllTimerInterval: 			60000,	//Update every 1 minute
			statsUpdateAllTimerTimeoutInterval: 	3600000, //3600000 = 1 hour, Stop all auto updating
			statsUpdateAllEventsTimer: 				false,
			statsUpdateTimer: 						1500	//Time for update animation
		};

		var methods = {
			init : function( options ) {
				jQuery('.stats-link img').replaceWith('<span class="stats-link stats-nbsp">&nbsp;|&nbsp;</div>');
				jQuery(".live-stats-now .stats-links").each(function(index) {
					jQuery(".live-stats-now .stats-link .stats-link:last",jQuery(this)).hide();
					jQuery(".live-stats-now .stats-link .stats-link:first",jQuery(this)).hide();
				});
				//Format Links 3 to a line
				jQuery('.live-stats-now .stats-links').each(function(index,box) {
					jQuery("a",box).each(function(index2,aTag) {
						if(index2==0 || index2==3) {
							jQuery(jQuery(aTag)).appendTo(jQuery(".stats-links-holder",box));
						}
						else if(index2==2) {
							jQuery('<div class="stats-link stats-nbsp">&nbsp;|&nbsp;</div>').appendTo(jQuery(".stats-links-holder",box));
							jQuery(jQuery(aTag)).appendTo(jQuery(".stats-links-holder:last",box));
							jQuery('<br />').appendTo(jQuery(".stats-links-holder",box));
						}
						else {
							jQuery('<div class="stats-link stats-nbsp">&nbsp;|&nbsp;</div>').appendTo(jQuery(".stats-links-holder",box));
							jQuery(jQuery(aTag)).appendTo(jQuery(".stats-links-holder:last",box));
						}
					});
					var newHtml = jQuery(".stats-links-holder",jQuery(box)).html();
					jQuery(box).html('');
					jQuery(box).html(newHtml);
				});

				options = $.extend(defaults, options);
				parentObj = this;
				statsUpdateAllEvents();	//run first update
				if(options.statsUpdateAllTimerInterval) {
					options.statsUpdateAllEventsTimer = setInterval(function() {
						statsUpdateAllEvents();
					},options.statsUpdateAllTimerInterval)
					setTimeout(function() {
						if(options.statsUpdateAllTimerTimeoutInterval) {
							clearInterval(options.statsUpdateAllEventsTimer);
						}
					},options.statsUpdateAllTimerTimeoutInterval);
				}
			},
			updateEventId : function ( gameStatId ) {
				//obj = this;
				//console.log("gameStatId:"+gameStatId);
				var sportId = jQuery("#stats-event-"+gameStatId).attr("sportid")
				statsGetEventJsonData(jQuery("#stats-event-"+gameStatId),sportId,gameStatId);
			}
		};

		$.fn.liveStatsRotator = function(method) {
			// Method calling logic
			if ( methods[method] ) {
				return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
			} else if ( typeof method === 'object' || ! method ) {
				return methods.init.apply( this, arguments );
			} else {
				$.error( 'Method ' +  method + ' does not exist on jQuery.liveStats' );
			}
		};

		function statsUpdateAllEvents() {
			if(!jQuery("body").hasClass("stats-blur")) {
				var updateDelay = 0;
				funcCounter = 1;
				//console.log(parentObj.selector);
				jQuery(parentObj.selector).each(function(index) {
					var obj = jQuery(this);
					var gameStatId = jQuery(this).attr("gamestatid");
					var scheduleId = jQuery(this).attr("scheduleid");
					var sportId = jQuery(this).attr("sportid");
					updateDelay += 300;
					setTimeout(function() {
						statsGetEventJsonData(obj,scheduleId,gameStatId,sportId);
					},updateDelay);
				});
			}
		} //statsUpdateAllEvents

		function statsGetEventJsonData(obj,scheduleId,gameStatId,sportId) {
			var eventType = false;
			var cacheBreakerLabel = 'rand_'+Math.floor(Math.random()*100000+1);
			var cacheBreaker = Math.floor(Math.random()*100000+1);

			if(jQuery(obj).hasClass("stats-pregame")) {
				eventType = 'pregame';
			}
			else if(jQuery(obj).hasClass("stats-livegame")) {
				eventType = 'livegame';
			}
			
			if (eventType == 'livegame') {
				//console.log(obj);
				//jQuery(".stats-update-status",obj).show();
				jQuery(".stats-location",obj).addClass("stats-updating");
				var jsonpURL = 'http://smb.cdnak.dal.neulion.com/fs/jsonp/';
				var homeschoolid = jQuery(obj).attr('hometeamid');
				var visitorschoolid = jQuery(obj).attr('visitingteamid');
			
				jQuery.ajax({
					crossDomain: true,		
					type: 'GET',
					cache:true,
					url: jsonpURL+"smb.cdnak.dal.neulion.com/fs/cs/stats1/"+page_DB_OEM_ID+"/"+sportId+"/"+gameStatId+"_summary.json",
					//url: jsonpURL+"smb.cdnak.dal.neulion.com/fs/cs/stats1/10700/4249/1520547_summary.json",	
					async: false,		
			    	jsonpCallback: 'func'+funcCounter,
			    	contentType: "application/json; charset=utf-8",
			    	dataType: 'jsonp',				
					data: "DB_OEM_ID="+page_DB_OEM_ID+"&GAME_STATS_ID="+gameStatId+"&SPORT_ID="+sportId+"&HOME_ID="+homeschoolid+"&VISITOR_ID="+visitorschoolid,
					//data: "DB_OEM_ID="+10700+"&GAME_STATS_ID="+1520547+"&SPORT_ID="+4249+"&HOME_ID="+37+"&VISITOR_ID="+2225,
					success: function(data){	
										
						switch(data.source) {
							case 'event has not started':
								obj.attr("gamestatid",data.status.gameStatId);
								//console.log('event has not started');
								statsUpdateLinks(obj,data.links);
								jQuery(".stats-location",obj).removeClass("stats-updating");
								break;
							/* This case is deprecated
							case 'event starting':
								//console.log('event starting');
								jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
								jQuery(obj).attr("gamestatid",data.status.gameStatId);
								jQuery(".stats-location",obj).addClass("stats-updating");
								break;
							*/
							case 'event ended':
								//console.log("event ended");
								statsEndEvent(obj,data);
								break;
							case 'STAT CREW Basketball':
								statsUpdateHomeAwayNames(obj,data);
								jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
								statsUpdateEventBasketball(obj,data);
								break;
							case 'TAS Baseball/Softball':
								statsUpdateHomeAwayNames(obj,data);
								jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
								statsUpdateEventBaseballOrSoftball(obj,data);
								break;
							case 'TAS For Soccer':
								statsUpdateHomeAwayNames(obj,data);
								jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
								statsUpdateEventSoccer(obj,data);
								break;
							case 'TAS Volleyball':
								statsUpdateHomeAwayNames(obj,data);
								jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
								statsUpdateEventVolleyball(obj,data);
								break;
							case 'Tas Football':
								statsUpdateHomeAwayNames(obj,data);
								jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
								statsUpdateEventFootball(obj,data);
								break;
							case 'TAS For Lacrosse':
								statsUpdateHomeAwayNames(obj,data);
								jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
								statsUpdateEventLacrosse(obj,data);
								break;
							case 'TAS For Ice Hockey':
								statsUpdateHomeAwayNames(obj,data);
								jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
								statsUpdateEventIceHockey(obj,data);
								break;
							default:
								console.log("unknown data.source:"+data.source);
						}					
			      	}
				});

				funcCounter = funcCounter + 1;
			}













	/*
			jQuery.ajax({
				url:getBaseUrl()+"/ScoreboardProxy.dbml?DB_OEM_ID="+page_DB_OEM_ID+"&GAME_STATS_ID="+gameStatId+"&SCHEDULE_ID="+scheduleId+"&EVENT_TYPE="+eventType+"&SPORT_ID="+sportId+"&"+cacheBreakerLabel+"="+cacheBreaker,
				dataType:"json",
				success: function(data) {
					switch(data.source) {
						case 'event has not started':
							obj.attr("gamestatid",data.status.gameStatId);
							//console.log('event has not started');
							statsUpdateLinks(obj,data.links);
							jQuery(".stats-location",obj).removeClass("stats-updating");
							break;
						case 'event ended':
							//console.log("event ended");
							statsEndEvent(obj,data);
							break;
						case 'STAT CREW Basketball':
							statsUpdateHomeAwayNames(obj,data);
							jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
							statsUpdateEventBasketball(obj,data);
							break;
						case 'TAS Baseball/Softball':
							statsUpdateHomeAwayNames(obj,data);
							jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
							statsUpdateEventBaseballOrSoftball(obj,data);
							break;
						case 'TAS For Soccer':
							statsUpdateHomeAwayNames(obj,data);
							jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
							statsUpdateEventSoccer(obj,data);
							break;
						case 'TAS Volleyball':
							statsUpdateHomeAwayNames(obj,data);
							jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
							statsUpdateEventVolleyball(obj,data);
							break;
						case 'Tas Football':
							statsUpdateHomeAwayNames(obj,data);
							jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
							statsUpdateEventFootball(obj,data);
							break;
						case 'TAS For Lacrosse':
							statsUpdateHomeAwayNames(obj,data);
							jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
							statsUpdateEventLacrosse(obj,data);
							break;
						case 'TAS For Ice Hockey':
							statsUpdateHomeAwayNames(obj,data);
							jQuery(obj).removeClass("stats-pregame").addClass("stats-livegame");
							statsUpdateEventIceHockey(obj,data);
							break;
						default:
							console.log("unknown data.source:"+data.source);
					}
				}
			});
	*/

		}


		function statsUpdateHomeAwayNames(obj,data) {
			var updateTimer = options.statsUpdateTimer;
			if(jQuery('.stats-away-team .stats-team-name',obj).html()!=data.awayName)
				jQuery('.stats-away-team .stats-team-name',obj).html(data.awayName).addClass("stats-updated").removeClass("stats-updated",updateTimer);

			if(jQuery('.stats-home-team .stats-team-name',obj).html()!=data.homeName)
				jQuery('.stats-home-team .stats-team-name',obj).html(data.homeName).addClass("stats-updated").removeClass("stats-updated",updateTimer);
		}

		function statsEndEvent(obj,data) {
			jQuery(".stats-location",obj).addClass("stats-updating");
			var eventLinks = false;
			var periodtext = data.status.period;

			if (data.status.s == 2) {
				periodtext = 'Final';
			}
			if(data.status.links) {
				eventLinks = data.status.links;
			}
			else {
				eventLinks = '&nbsp;';
			}
			//tie
			if(data.status.homeScore==data.status.awayScore) {jQuery(obj).addClass("stats-result-tie");}
			//away wins
			else if(data.status.awayScore>data.status.homeScore) {jQuery(obj).addClass("stats-result-away-win");}
			//home wins
			else {jQuery(obj).addClass("stats-result-home-win");}
			jQuery(obj).addClass("stats-postgame").removeClass("stats-pregame").removeClass("stats-livegame");
			if( (data.status.homeScore=='') && (data.status.awayScore=='') && (data.status.scoreInfo>'') ) {
				jQuery(".stats-score-divider",obj).remove();	//only exist on schedule page
				statsUpdateEventPeriodAndIndex(obj,'','<div class="stats-relative"><div class="stats-score-info">'+data.status.scoreInfo+'</div></div>',"F&nbsp;"+periodtext,'&nbsp;',eventLinks);
			}
			else {
				statsUpdateEventPeriodAndIndex(obj,data.status.homeScore,data.status.awayScore,"F&nbsp;"+periodtext,'&nbsp;',eventLinks);
			}
			jQuery(".stats-event-status",obj).html('');
		}

		function statsFormatLinks(obj) {
			//Format Links 3 to a line
			var box = jQuery('.live-stats-now .stats-links',obj);
			jQuery("a",box).each(function(index2,aTag) {
				if(index2==0 || index2==3) {
					jQuery(jQuery(aTag)).appendTo(jQuery(".stats-links-holder",box));
				}
				else if(index2==2) {
					jQuery('<div class="stats-link stats-nbsp">&nbsp;|&nbsp;</div>').appendTo(jQuery(".stats-links-holder",box));
					jQuery(jQuery(aTag)).appendTo(jQuery(".stats-links-holder:last",box));
					jQuery('<br />').appendTo(jQuery(".stats-links-holder",box));
				}
				else {
					jQuery('<div class="stats-link stats-nbsp">&nbsp;|&nbsp;</div>').appendTo(jQuery(".stats-links-holder",box));
					jQuery(jQuery(aTag)).appendTo(jQuery(".stats-links-holder:last",box));
				}
			});
			var newHtml = jQuery(".stats-links-holder",jQuery(box)).html();
			jQuery(box).html('');
			jQuery(box).html(newHtml);
		}

		function statsTestIfLinksUpdated(obj,oldLinks,newLinks) {
			var oldLinksText = '';
			var newLinksText = '';
			var newLinks = jQuery(newLinks);
			jQuery("a",newLinks).each(function(index,link) {
				newLinksText = newLinksText + jQuery(this).text();
				newLinksText = newLinksText + jQuery(this).attr("href");
			});
			var oldLinks = jQuery(oldLinks);
			jQuery("a",oldLinks).each(function(index,link) {
				oldLinksText = oldLinksText + jQuery(this).text();
				oldLinksText = oldLinksText + jQuery(this).attr("href");
			});
			if(newLinksText==oldLinksText) {
				return false;
			}
			else {
				return true;
			}
		}

		function statsUpdateLinks(obj,eventLinks) {
			var updateTimer = options.statsUpdateTimer;
			if(eventLinks) {
				if(statsTestIfLinksUpdated(obj,jQuery('.stats-links',obj).html(),eventLinks)) {
					//links updated
					jQuery('.stats-links',obj).html(eventLinks);
					statsFormatLinks(obj);
					jQuery('.stats-links',obj).addClass("stats-updated").removeClass("stats-updated",(updateTimer/2));
				}
			}
		}

		function statsUpdateEventPeriodAndIndex(obj,eventScoreHome,eventScoreAway,eventStatusIndex,eventStatusPeriod,eventLinks,eventBallPossession) {
			if( (eventScoreHome!='') && (eventScoreAway=='') ){
				eventScoreAway = 0;
			}
			if( (eventScoreAway!='') && (eventScoreHome=='') ){
				eventScoreHome = 0;
			}

			var sportBallIcon = false;
			var sportBallIconPath = getBaseUrl()+'/fls/0/site_graphics/scoreboard/';
			var sportKey = jQuery(obj).attr("sportkey");
			switch(sportKey) {
				case 'M_FOOTBALL':
					sportBallIcon = 'icon_FOOTBALL.png';
					break;
			}
			jQuery(".stats-ball",obj).remove();
			if(eventBallPossession && sportBallIcon) {
				if(eventBallPossession=="V") {
					jQuery(".stats-away-team .stats-team-name",obj).append('<span class="stats-ball"><img class="stats-ball-img" src="'+sportBallIconPath+sportBallIcon+'"/></span>');
				}
				else if(eventBallPossession=="H") {
					jQuery(".stats-home-team .stats-team-name",obj).append('<span class="stats-ball"><img class="stats-ball-img" src="'+sportBallIconPath+sportBallIcon+'"/></span>');
				}
			}

			var updateTimer = options.statsUpdateTimer;
			jQuery('.stats-score-divider',obj).show();
			if(jQuery('.stats-team-score.home-score',obj).html()!=eventScoreHome)
				jQuery('.stats-team-score.home-score',obj).html(eventScoreHome).addClass("stats-updated").removeClass("stats-updated",updateTimer);
			if(jQuery('.stats-team-score.away-score',obj).html()!=eventScoreAway)
				jQuery('.stats-team-score.away-score',obj).html(eventScoreAway).addClass("stats-updated").removeClass("stats-updated",updateTimer);
			if(eventStatusPeriod) {
				if(jQuery('.stats-event-period',obj).html()!=eventStatusPeriod) {
					jQuery('.stats-event-period',obj).html(eventStatusPeriod).addClass("stats-updated").removeClass("stats-updated",updateTimer);
				}
			}
			if(eventStatusIndex) {
				if(jQuery('.stats-event-index',obj).html()!=eventStatusIndex) {
					jQuery('.stats-event-index',obj).html(eventStatusIndex).addClass("stats-updated").removeClass("stats-updated",updateTimer);
				}
			}
			statsUpdateLinks(obj,eventLinks);
			/*
			if(eventLinks) {
				if(statsTestIfLinksUpdated(obj,jQuery('.stats-links',obj).html(),eventLinks)) {
					//links updated
					jQuery('.stats-links',obj).html(eventLinks);
					statsFormatLinks(obj);
					jQuery('.stats-links',obj).addClass("stats-updated").removeClass("stats-updated",(updateTimer/2));
				}
			}
			*/
			jQuery(".stats-location",obj).removeClass("stats-updating");
		}

		function statsUpdateEventIceHockey(obj,jsonData) {
			var count = jsonData.summary.length;
			var eventScoreHome, eventScoreAway, eventStatusIndex, eventStatusPeriod = 0;
			var eventLinks = false;

			if(jsonData.links) {
				eventLinks = jsonData.links;
			}

			if(jsonData.status) {
				eventStatusIndex = jsonData.status.index;
				eventStatusPeriod = jsonData.status.period;

				if (jsonData.status.s == 2) {
					eventStatusPeriod = 'Final';
				}
			}



			for(var x=0;x<count;x++) {
				switch(jsonData.summary[x].property) {
					case 'Score':
						eventScoreHome = jsonData.summary[x].home;
						eventScoreAway = jsonData.summary[x].away;
						break;
					case 'Shots':

						break;
					case 'Saves':

						break;
					case 'Power Plays (Goals)':

						break;
					case 'Penalties (mins)':

						break;
					case 'FFaceoffs':

						break;
				}
			}

			statsUpdateEventPeriodAndIndex(obj,eventScoreHome,eventScoreAway,eventStatusIndex,eventStatusPeriod,eventLinks,false);
		}

		//TAS For Lacrosse
		function statsUpdateEventLacrosse(obj,jsonData) {
			var count = jsonData.summary.length;
			var eventScoreHome, eventScoreAway, eventStatusIndex, eventStatusPeriod = 0;
			var eventLinks = false;

			if(jsonData.links) {
				eventLinks = jsonData.links;
			}

			if(jsonData.status) {
				eventStatusIndex = jsonData.status.index;
				eventStatusPeriod = jsonData.status.period;

				if (jsonData.status.s == 2) {
					eventStatusPeriod = 'Final';
				}
			}

			for(var x=0;x<count;x++) {
				switch(jsonData.summary[x].property) {
					case 'Score':
						eventScoreHome = jsonData.summary[x].home;
						eventScoreAway = jsonData.summary[x].away;
						break;
					case 'Shots':

						break;
					case 'Ground Balls':

						break;
					case 'Draw Controls':

						break;
					case 'Clears - Attempts':

						break;
					case 'Free Position Shots':

						break;
					case 'Saves':

						break;
					case 'Turnovers':

						break;
				}
			}

			statsUpdateEventPeriodAndIndex(obj,eventScoreHome,eventScoreAway,eventStatusIndex,eventStatusPeriod,eventLinks,false);
		}

		//Tas Football
		function statsUpdateEventFootball(obj,jsonData) {
			var count = jsonData.summary.length;
			var eventScoreHome, eventScoreAway, eventStatusIndex, eventStatusPeriod = 0;
			var eventLinks,eventBallPossession = false;

			if(jsonData.links) {
				eventLinks = jsonData.links;
			}

			if(jsonData.status) {
				eventStatusIndex = jsonData.status.index;
				eventStatusPeriod = jsonData.status.period;

				if (jsonData.status.s == 2) {
					eventStatusPeriod = 'Final';
				}

				eventBallPossession = jsonData.status.ball;
			}

			for(var x=0;x<count;x++) {
				switch(jsonData.summary[x].property) {
					case 'Score':
						eventScoreHome = jsonData.summary[x].home;
						eventScoreAway = jsonData.summary[x].away;
						break;
					case 'First Down':

						break;
					case '3rd Down Conversion':

						break;
					case '4th Down Conversion':

						break;
					case 'Total Yards':

						break;
					case 'Passing Yards':

						break;
					case 'Rushing Yards':

						break;
					case 'Penalties':

						break;
					case 'Fumbles':

						break;
					case 'Time of Possession':

						break;
				}
			}

			statsUpdateEventPeriodAndIndex(obj,eventScoreHome,eventScoreAway,eventStatusIndex,eventStatusPeriod,eventLinks,eventBallPossession);
		}

		//TAS Volleyball
		function statsUpdateEventVolleyball(obj,jsonData) {
			var count = jsonData.summary.length;
			var eventScoreHome, eventScoreAway, eventStatusIndex, eventStatusPeriod = 0;
			var eventLinks = false;

			if(jsonData.links) {
				eventLinks = jsonData.links;
			}

			if(jsonData.status) {
				eventStatusIndex = jsonData.status.index;
				eventStatusPeriod = jsonData.status.period;

				if (jsonData.status.s == 2) {
					eventStatusPeriod = 'Final';
				}
			}

			for(var x=0;x<count;x++) {
				switch(jsonData.summary[x].property) {
					case 'Score':
						eventScoreHome = jsonData.summary[x].home;
						eventScoreAway = jsonData.summary[x].away;
						break;
					case 'Kills':

						break;
					case 'Total Attacks':

						break;
					case 'Attack Errors':

						break;
					case 'Hit Percentage':

						break;
					case 'Service Aces':

						break;
					case 'Service Errors':

						break;
					case 'Blocks':

						break;
					case 'Ball Handling Errors':

						break;
				}
			}

			statsUpdateEventPeriodAndIndex(obj,eventScoreHome,eventScoreAway,eventStatusIndex,eventStatusPeriod,eventLinks,false);
		}

		//TAS For Soccer
		function statsUpdateEventSoccer(obj,jsonData) {
			var count = jsonData.summary.length;
			var eventScoreHome, eventScoreAway, eventStatusIndex, eventStatusPeriod = 0;
			var eventLinks = false;

			if(jsonData.links) {
				eventLinks = jsonData.links;
			}

			if(jsonData.status) {
				eventStatusIndex = jsonData.status.index;
				eventStatusPeriod = jsonData.status.period;

				if (jsonData.status.s == 2) {
					eventStatusPeriod = 'Final';
				}
			}

			for(var x=0;x<count;x++) {
				switch(jsonData.summary[x].property) {
					case 'Score':
						eventScoreHome = jsonData.summary[x].home;
						eventScoreAway = jsonData.summary[x].away;
						break;
					case 'Shots':

						break;
					case 'Saves':

						break;
					case 'Corners':

						break;
					case 'Fouls':

						break;
					case 'Offsides':

						break;
				}
			}

			statsUpdateEventPeriodAndIndex(obj,eventScoreHome,eventScoreAway,eventStatusIndex,eventStatusPeriod,eventLinks,false);
		}

		//TAS Baseball/Softball
		function statsUpdateEventBaseballOrSoftball(obj,jsonData) {
			var count = jsonData.summary.length;
			var eventScoreHome, eventScoreAway, eventStatusIndex, eventStatusPeriod = 0;
			var eventLinks = false;

			if(jsonData.links) {
				eventLinks = jsonData.links;
			}

			if(jsonData.status) {
				eventStatusIndex = jsonData.status.index;
				eventStatusPeriod = jsonData.status.period;

				if (jsonData.status.s == 2) {
					eventStatusPeriod = 'Final';
				}
			}

			for(var x=0;x<count;x++) {
				switch(jsonData.summary[x].property) {
					case 'Score':
						eventScoreHome = jsonData.summary[x].home;
						eventScoreAway = jsonData.summary[x].away;
						break;
					case 'Hits':

						break;
					case 'Errs':

						break;
					case 'Free Throws':

						break;
					case 'Ground Outs':

						break;
					case 'Fly Outs':

						break;
					case 'With 2 Outs':

						break;
					case 'With Runners':

						break;
					case 'Scoring Position':

						break;
					case 'Lead Off':

						break;
					case '3rd and LT 2-Out':

						break;
					case 'With Bases Loaded':

						break;
					case 'Advanced Runners':

						break;
				}
			}

			statsUpdateEventPeriodAndIndex(obj,eventScoreHome,eventScoreAway,eventStatusIndex,eventStatusPeriod,eventLinks,false);
		}

		//STAT CREW Basketball
		function statsUpdateEventBasketball(obj,jsonData) {
			var count = jsonData.summary.length;
			var eventScoreHome, eventScoreAway, eventStatusIndex, eventStatusPeriod = 0;
			var eventLinks = false;

			if(jsonData.links) {
				eventLinks = jsonData.links;
			}

			if(jsonData.status) {
				eventStatusIndex = jsonData.status.index;
				eventStatusPeriod = jsonData.status.period;

				if (jsonData.status.s == 2) {
					eventStatusPeriod = 'Final';
				}
			}

			for(var x=0;x<count;x++) {
				switch(jsonData.summary[x].property) {
					case 'Score':
						eventScoreHome = jsonData.summary[x].home;
						eventScoreAway = jsonData.summary[x].away;
						break;
					case 'Field Goals':

						break;
					case '3-Point FGs':

						break;
					case 'Free Throws':

						break;
					case 'Rebounds':

						break;
					case 'Steals':

						break;
					case 'Blocks':

						break;
					case 'Assists':

						break;
					case 'Turnovers':

						break;
				}
			}

			statsUpdateEventPeriodAndIndex(obj,eventScoreHome,eventScoreAway,eventStatusIndex,eventStatusPeriod,eventLinks,false);
		}
	})(jQuery);
}
/******************************************************************************
 ******************************************************************************/

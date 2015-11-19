var jmMainMenu = null;
var jmMenuContainer = jQuery("#menu-container");
var jmMenuInnerContainer = jQuery("#menu-inner-container");
var jmVoidHref = 'javascript:void(0)';
var jmBaseParentId = 'lm-parent-';
var jmDebugOutput = false;
var jmMobileWidth = null;
var jmRewriteVars = null;
var jmSectionMenu = jQuery("#section-menu");
var jmSectionMenuContainer = jQuery("#section-menu-contianer");
var jmListMenuButton = null;
var jmMenuDelay = jQuery("#menu-container").attr('delayhover');
var jmWindowWidth = jQuery(window).width();

function jmRewriteHref(link,userData) {
	if(userData && (link!==jmVoidHref) ) {
		if(link.indexOf('?')>=0) {
			//console.log("link has ?");
			link += '&'+jmRewriteVars;
		}
		else {
			//console.log("not ?");
			link += '?'+jmRewriteVars;
		}
	}
	return link;
}

function jmDebugConsole(msg) {
	if(jmDebugOutput)
		console.log(msg);
}

function jmGetMenuData() {
	jmDebugConsole("jmGetMenuData()");

	jmDebugOutput = (jmMenuContainer.attr('data-menu-debug')==='true') ? true : false;
	jmRewriteVars = jmMenuContainer.attr('data-rewrite');	
	jmDebugConsole("jmRewriteVars:"+jmRewriteVars);
	jmMobileWidth = parseInt(jmMenuContainer.attr('data-menu-mobile-width'));
	jQuery.getScript(getBaseUrl()+'/fls/'+page_DB_OEM_ID+'/menu_data/main_menu.js');
}

//Called from getScript jmGetMenuData()
function jmBuildMainMenu(data) {
	jmDebugConsole("jmBuildMainMenu()");
	jmMenuInnerContainer.html('<ul id="list-menu" class="'+data.main_classes+'"></ul><div id="list-menu-button"><button class="btn" type="button"><div class="icon-bar"></div><div class="icon-bar"></div><div class="icon-bar"></div></button></div>');
	jmMainMenu = jQuery("#list-menu");
	jmListMenuButton = jQuery("#list-menu-button");
	jmBuildParentsHtml(data);
	jmSetupStyles(data);
	jmSetupMenuEvents(data);
	jmCheckMenuSize();
	jmShowMenu();
}

function jmShowMenu() {
	jmDebugConsole("jmShowMenu()");
	jQuery('#'+jmBaseParentId+jmMenuContainer.attr("data-menu")).trigger("mouseenter");
	jmMainMenu.css("visibility","visible");
}

function jmBuildParentsHtml(data) {
	jmDebugConsole("jmBuildParentsHtml()");
	var m = 1;
	var length = data.menu_items.length;
	for(var x=0;x<length;x++) {
		var link = (data.menu_items[x].link===null) ? jmVoidHref : data.menu_items[x].link;
		link = jmRewriteHref(link,data.menu_items[x].user_data);
		var target = data.menu_items[x].target;

		if (target) {
			jmMainMenu.append('<li id="'+jmBaseParentId+m+'" class="'+data.menu_items[x].classes+'"><a class="top-menu-link" href="'+link+'" target="'+target+'">'+data.menu_items[x].title+'</a></li>');
		}
		else {
			jmMainMenu.append('<li id="'+jmBaseParentId+m+'" class="'+data.menu_items[x].classes+'"><a class="top-menu-link" href="'+link+'">'+data.menu_items[x].title+'</a></li>');
		}
		if(data.dividers===true && x!=(length-1)) {
			jmMainMenu.append('<li class="divider"></li>');
		}
		if(data.menu_items[x].sub_nav.length>0) {
			jmBuildSubMenuHtml(data.menu_items[x],m);
		}
		m++;
	}

	//console.log('done');
	//jQuery(document).on("click", "ul#list-menu.show-mobile li.parent.template.menu-active", function() {
	//	alert('click');
		//jQuery(this).removeClass('menu-active');
	//});
}

function jmBuildSubMenuHtml(data,m) {
	jmDebugConsole('jmBuildSubMenuHtml() parent:'+m);
	var length = data.sub_nav.length;
	var lengthSplitNav = data.sub_nav.nav;
	var parentMenu = jQuery('#'+jmBaseParentId+m);
	parentMenu.append('<ul class="'+data.sub_nav_classes+'"></ul>');
	var subUl = jQuery("ul:first",parentMenu);
	var link = null;
	if(data.type==='simple') {
		if(data.sub_nav[0].nav!==undefined) {	//Split menu (Men/Women)
			jmDebugConsole("Split menu non-template (Men/Women)");
			subUl.append('<li class="split"><div class="standard"></div></li>');
			jmBuildSplitMenuHtml(data,jQuery('li:first',subUl));
		}
		else {	//Combined Sports
			jmDebugConsole("Combined Sports non-template")
			//subLi.append('<div class="standard sports"><ul class="subnav"></ul></div>');
			//jmBuildTemplateStandardLinkHtml(data,subLi);
			for(var x=0;x<length;x++) {
				link = jmRewriteHref(data.sub_nav[x].link,false);
				subUl.append('<li><a href="'+link+'">'+data.sub_nav[x].title+'</a></li>');
			}
		}
	}
	else if(data.type==='template-1') {
		jmBuildTemplate1Html(data,subUl);
	}
	else if(data.type==='template-2') {
		jmBuildTemplate2Html(data,subUl);
	}
	else if(data.type==='template-3') {
		jmBuildTemplate3Html(data,subUl);
	}
	else if(data.type==='template-4') {
		jmBuildTemplate4Html(data,subUl);
	}
	else if(data.type==='template-5') {
		jmBuildTemplate5Html(data,subUl);
	}
	else if(data.type==='template-6') {
		jmBuildTemplate6Html(data,subUl);
	}
}

function jmBuildImageTextAdHtml(data,subLi) {
	jmDebugConsole("jmBuildImageTextAdHtml()");
	var template_target = (data.template_target===null) ? '' : data.template_target;
	var template_headline = (data.template_headline===null) ? '' : data.template_headline;
	var template_teaser = (data.template_teaser===null) ? '' : data.template_teaser;
	var template_image = (data.template_image_path===null) ? '' : '<img src="'+data.template_image_path+'">';

	/*Ad stuff WM-40146*/
	var template_ad_image = (data.template_ad_path===null) ? '' : '<img src="'+getBaseUrl()+'/'+data.template_ad_path+'">';
	var template_ad_target = (data.template_ad_user_data===false) ? '' : '_blank';	
	var template_ad_html_setup = (data.template_ad_url===null)? template_ad_image :'<a href="'+data.template_ad_url+'" target="'+template_ad_target+'">'+template_ad_image+'</a>';
	var template_ad_html = (template_ad_html_setup>'') ? '<div class="ad-menu">'+template_ad_html_setup+'</div>':'';
	/*Backwards Compatible old menu_menu.js has this varible set to null so if is there then just do not put the ad code*/
	if(data.template_ad_html===null){
		template_ad_html="";
	}
	
	if(data.template_link!==null) {
		template_headline = (template_headline>'') ? '<a href="'+data.template_link+'" target="'+template_target+'">'+template_headline+'</a>' : template_headline;
		template_teaser = (template_teaser>'') ? '<a href="'+data.template_link+'" target="'+template_target+'">'+template_teaser+'</a>' : template_teaser;
		template_image = (template_image>'') ? '<a href="'+data.template_link+'" target="'+template_target+'">'+template_image+'</a>' : template_image;
	}
	subLi.append('<div class="image-text"><div class="image-text-box"><div class="image">'+template_image+'</div><div class="headline">'+template_headline+'</div><div class="teaser">'+template_teaser+'</div></div></div>'+template_ad_html);
}

function jmBuildFeatureLabelHtml(data,subLi) {
	jmDebugConsole("jmBuildFeatureLabelHtml()");
	if(data.feature_1_label!==null) {
		subLi.append('<div class="label-1">'+data.feature_1_label+'</div>');
	}
	if(data.feature_2_label!==null) {
		subLi.append('<div class="label-2">'+data.feature_2_label+'</div>');
	}
	//jmDebugConsole("data.feature_1_nav.length:"+data.feature_1_nav.length);
	if(data.feature_1_nav.length>0) {
		subLi.append('<div class="feature-1"><ul class="subnav"></ul></div>');
		var feature1Nav = jQuery("div.feature-1 ul.subnav",subLi);
		for(var x = 0;x<data.feature_1_nav.length;x++) {
			if(data.feature_1_nav[x].target===null) {
				feature1Nav.append('<li><a href="'+data.feature_1_nav[x].link+'">'+data.feature_1_nav[x].title+'</a></li>');
			}
			else {
				feature1Nav.append('<li><a href="'+data.feature_1_nav[x].link+'" target="'+data.feature_1_nav[x].target+'">'+data.feature_1_nav[x].title+'</a></li>');
			}
		}
	}
	if(data.feature_2_nav.length>0) {
		subLi.append('<div class="feature-2"><ul class="subnav"></ul></div>');
		var feature2Nav = jQuery("div.feature-2 ul.subnav",subLi);
		for(var x = 0;x<data.feature_2_nav.length;x++) {
			if(data.feature_2_nav[x].target===null) {
				feature2Nav.append('<li><a href="'+data.feature_2_nav[x].link+'">'+data.feature_2_nav[x].title+'</a></li>');
			}
			else {
				feature2Nav.append('<li><a href="'+data.feature_2_nav[x].link+'" target="'+data.feature_2_nav[x].target+'">'+data.feature_2_nav[x].title+'</a></li>');
			}
		}
	}
}

function jmBuildTemplateStandardLinkHtml(data,subLi) {
	jmDebugConsole("jmBuildTemplateStandardLinkHtml()");
	var standardSubNav = jQuery("div.standard ul.subnav",subLi);
	var target = '';
	var link = null;
	if(data.sub_nav.length>0) {
		for(var x = 0;x<data.sub_nav.length;x++) {
			target = (data.sub_nav[x].target===null) ? '' : data.sub_nav[x].target;
			link = jmRewriteHref(data.sub_nav[x].link,data.sub_nav[x].user_data);

			if (data.sub_nav[x].classes) {
				standardSubNav.append('<li class="'+jQuery.trim(data.sub_nav[x].classes)+'"><a href="'+link+'" target="'+target+'">'+data.sub_nav[x].title+'</a></li>');
			}
			else {
				standardSubNav.append('<li><a href="'+link+'" target="'+target+'">'+data.sub_nav[x].title+'</a></li>');
			}
		}
	}
}

function jmBuildTemplate1Html(data,subUl) {
	jmDebugConsole("jmBuildTemplate1Html()");
	subUl.append('<li class="template"></li>');
	var subLi = jQuery("li.template",subUl);
	subLi.append('<div class="standard"><ul class="subnav"></ul></div>');
	jmBuildTemplateStandardLinkHtml(data,subLi);
	jmBuildFeatureLabelHtml(data,subLi);
	jmBuildImageTextAdHtml(data,subLi);
}

function jmBuildTemplate2Html(data,subUl) {
	jmDebugConsole("jmBuildTemplate2Html()");
	subUl.append('<li class="template custom"></li>');
	var subLi = jQuery("li.template",subUl);
	subLi.append('<div class="standard"><ul class="subnav"></ul></div>');
	jmBuildTemplateStandardLinkHtml(data,subLi);
	jmBuildFeatureLabelHtml(data,subLi);
	jmBuildImageTextAdHtml(data,subLi);
}

function jmBuildSplitMenuHtml(data,subLi) {
	jmDebugConsole("jmBuildSplitMenuHtml()");
	jmDebugConsole("data.sub_nav.length:"+data.sub_nav.length);
	var link = null;
	for(var x=0;x<data.sub_nav.length;x++) {
		if(data.sub_nav[x].label!==undefined) {
			jQuery("div.standard",subLi).append('<div class="'+data.sub_nav[x].classes+'"><div class="menu-label">'+data.sub_nav[x].label+'</div><ul class="subnav"></ul></div>');
		}
		else {
			jQuery("div.standard",subLi).append('<div class="'+data.sub_nav[x].classes+'"><ul class="subnav"></ul></div>');
		}
		var subSubUl = jQuery("ul.subnav",subLi).last();
		for(var i=0;i<data.sub_nav[x].nav.length;i++) {
			var target = (data.sub_nav[x].nav[i].target===null) ? '' : data.sub_nav[x].nav[i].target;
			link = jmRewriteHref(data.sub_nav[x].nav[i].link,data.sub_nav[x].nav[i].user_data);
			//console.log(data.sub_nav[x].nav[i].title);

			if (data.sub_nav[x].nav[i].classes) {
				subSubUl.append('<li class="'+jQuery.trim(data.sub_nav[x].nav[i].classes)+'"><a target="'+target+'" href="'+link+'">'+data.sub_nav[x].nav[i].title+'</a></li>');
			}
			else {
				subSubUl.append('<li><a target="'+target+'" href="'+link+'">'+data.sub_nav[x].nav[i].title+'</a></li>');
			}
		}
	}
}

function jmBuildSplitSportWithSectionsHtml(data,subLi) {
	jmDebugConsole("jmBuildSplitSportWithSectionsHtml()");
	subLi.append('<div class="standard sports with-sections"></div>');
	var target='',schedule_target='',roster_target='',news_link_html='',schedule_link_html='',roster_link_html='',custom_link_html='',facebook_html='',twitter_html='';
	var user_data=true,schedule_user_data=true,roster_user_data=true,custom_user_data=true;
	var link = null;
	for(var x=0;x<data.sub_nav.length;x++) {
		//console.log("label:"+data.sub_nav[x].label);
		if(data.sub_nav[x].label!==undefined) {
			jQuery("div.standard",subLi).append('<div class="'+data.sub_nav[x].classes+'"><div class="menu-label">'+data.sub_nav[x].label+'</div><ul class="subnav"></ul></div>');
		}
		else {
			jQuery("div.standard",subLi).append('<div class="'+data.sub_nav[x].classes+'"><ul class="subnav"></ul></div>');
		}
		var subSubUl = jQuery("ul.subnav",subLi).last();
		for(var i=0;i<data.sub_nav[x].nav.length;i++) {
			target = (data.sub_nav[x].nav[i].target===null) ? '' : data.sub_nav[x].nav[i].target;
			schedule_target = (data.sub_nav[x].nav[i].schedule_target===null) ? '' : data.schedule_target;
			roster_target = (data.sub_nav[x].nav[i].roster_target===null) ? '' : data.roster_target;
			user_data = data.sub_nav[x].nav[i].user_data;
			schedule_user_data = data.sub_nav[x].nav[i].schedule_user_data;
			roster_user_data = data.sub_nav[x].nav[i].roster_user_data;
			link = jmRewriteHref(data.sub_nav[x].nav[i].link,data.sub_nav[x].nav[i].user_data);
			scheduleLink = jmRewriteHref(data.sub_nav[x].nav[i].schedule_link,data.sub_nav[x].nav[i].schedule_user_data);
			rosterLink = jmRewriteHref(data.sub_nav[x].nav[i].roster_link,data.sub_nav[x].nav[i].roster_user_data);

			if(data.sub_nav[x].nav[i].custom_title!==undefined) {
				custom_target = (data.sub_nav[x].nav[i].custom_target===null) ? '' : data.sub_nav[x].nav[i].custom_target;
				custom_user_data = data.sub_nav[x].nav[i].custom_user_data;
				customLink = jmRewriteHref(data.sub_nav[x].nav[i].custom_link,data.sub_nav[x].nav[i].custom_user_data);
				custom_link_html = '<a class="section custom" href="'+customLink+'" target="'+custom_target+'">'+data.sub_nav[x].nav[i].custom_title+'</a>';
			}
			news_link_html = '<a class="sport" href="'+link+'" target="'+target+'">'+data.sub_nav[x].nav[i].title+'</a>';
			schedule_link_html = '<a class="section schedule" href="'+scheduleLink+'" target="'+schedule_target+'">'+data.sub_nav[x].nav[i].schedule_title+'</a>';
			roster_link_html = '<a class="section roster" href="'+rosterLink+'" target="'+roster_target+'">'+data.sub_nav[x].nav[i].roster_title+'</a>';
			if(data.sub_nav[x].nav[i].facebook_link!==null) {facebook_html = '<a class="facebook" href="'+data.sub_nav[x].nav[i].facebook_link+'" target="_NEW"></a>';}
			else {facebook_html='<span class="facebook-placeholder"></span>';}
			if(data.sub_nav[x].nav[i].twitter_link!==null) {twitter_html = '<a class="twitter" href="'+data.sub_nav[x].nav[i].twitter_link+'" target="_NEW"></a>';}
			else{twitter_html='<span class="twitter-placeholder"></span>';}
			subSubUl.append('<li>'+news_link_html+facebook_html+twitter_html+custom_link_html+roster_link_html+schedule_link_html+'</li>');
		}
	}
}

function jmBuildSportWithSectionsHtml(data,subLi) {
	jmDebugConsole("jmBuildSportWithSectionsHtml()");
	var groupCount = 1;
	subLi.append('<div class="standard sports with-sections"><ul id="menu-sport-group-'+groupCount+'" class="subnav"></ul></div>');
	var standardSubNav = jQuery("div.standard ul.subnav:last",subLi);
	var target='',schedule_target='',roster_target='',news_link_html='',schedule_link_html='',roster_link_html='',custom_link_html='',facebook_html='',twitter_html='';
	var user_data=true,schedule_user_data=true,roster_user_data=true,custom_user_data=true;
	if(data.sub_nav.length>0) {
		var total = data.sub_nav.length;
		var groupSize = total;
		
		//if the group size is odd, we need to subtract one to get it to split properly
		if (groupSize % 2 == 1)
			groupSize--;

		groupSize = groupSize/2;
		
		groupSize = ( (total%2)>0 ) ? (groupSize+1) : groupSize;

		for(var x = 0;x<data.sub_nav.length;x++) {
			if(x===groupSize) {
				groupCount++;
				jQuery(".with-sections",subLi).append('<ul id="menu-sport-group-'+groupCount+'" class="subnav"></ul>');
				standardSubNav = jQuery("div.standard ul.subnav:last",subLi);
			}
			target = (data.sub_nav[x].target===null) ? '' : data.sub_nav[x].target;
			schedule_target = (data.sub_nav[x].schedule_target===null) ? '' : data.schedule_target;
			roster_target = (data.sub_nav[x].roster_target===null) ? '' : data.roster_target;
			user_data = data.sub_nav[x].user_data;
			schedule_user_data = data.sub_nav[x].schedule_user_data;
			roster_user_data = data.sub_nav[x].roster_user_data;
			
			link = jmRewriteHref(data.sub_nav[x].link,data.sub_nav[x].user_data);
			scheduleLink = jmRewriteHref(data.sub_nav[x].schedule_link,data.sub_nav[x].schedule_user_data);
			rosterLink = jmRewriteHref(data.sub_nav[x].roster_link,data.sub_nav[x].roster_user_data);
			
			if(data.sub_nav[x].custom_title!==undefined) {
				custom_target = (data.sub_nav[x].custom_target===null) ? '' : data.custom_target;
				custom_user_data = data.sub_nav[x].custom_user_data;
				customLink = jmRewriteHref(data.sub_nav[x].custom_link,data.sub_nav[x].custom_user_data);
				custom_link_html = '<a class="section custom" href="'+data.sub_nav[x].custom_link+'" target="'+custom_target+'">'+data.sub_nav[x].custom_title+'</a>';
			}
			news_link_html = '<a class="sport" href="'+link+'" target="'+target+'">'+data.sub_nav[x].title+'</a>';
			schedule_link_html = '<a class="section schedule" href="'+scheduleLink+'" target="'+schedule_target+'">'+data.sub_nav[x].schedule_title+'</a>';
			roster_link_html = '<a class="section roster" href="'+rosterLink+'" target="'+roster_target+'">'+data.sub_nav[x].roster_title+'</a>';
			if(data.sub_nav[x].facebook_link!==null) {facebook_html = '<a class="facebook" title="Facebook" href="'+data.sub_nav[x].facebook_link+'" target="FACEBOOK"></a>';}
			else {facebook_html='<span class="facebook-placeholder"></span>';}
			if(data.sub_nav[x].twitter_link!==null) {twitter_html = '<a class="twitter" title="Twitter" href="'+data.sub_nav[x].twitter_link+'" target="TWITTER"></a>';}
			else{twitter_html='<span class="twitter-placeholder"></span>';}

			standardSubNav.append('<li>'+news_link_html+facebook_html+twitter_html+custom_link_html+roster_link_html+schedule_link_html+'</li>');
		}
	}
}

function jmBuildTemplate3Html(data,subUl) {
	jmDebugConsole("jmBuildTemplate3Html()");
	subUl.append('<li class="template"></li>');
	var subLi = jQuery("li.template",subUl);
	if(data.sub_nav[0].schedule_title!==undefined) {	//Combined Sports with sections
		jmDebugConsole("Combined Sports with sections");
		jmBuildSportWithSectionsHtml(data,subLi);
	}
	else if(data.sub_nav[0].nav!==undefined && data.sub_nav[0].nav[0].schedule_title!==undefined) {
		jmDebugConsole("Split menu (Men/Women) with sections");	//Split menu (Men/Women) with sections
		jmBuildSplitSportWithSectionsHtml(data,subLi);
		//subLi.append('<div class="standard sports split"></div>');
		//jmBuildSplitMenuHtml(data,subLi);
	}
	else {
		if(data.sub_nav[0].nav!==undefined) {	//Split menu (Men/Women)
			jmDebugConsole("Split menu (Men/Women)");
			subLi.append('<div class="standard sports split"></div>');
			jmBuildSplitMenuHtml(data,subLi);
		}
		else {	//Combined Sports
			jmDebugConsole("Combined Sports");
			subLi.append('<div class="standard sports"><ul class="subnav"></ul></div>');
			jmBuildTemplateStandardLinkHtml(data,subLi);
		}
	}
	
	jmBuildFeatureLabelHtml(data,subLi);
	jmBuildImageTextAdHtml(data,subLi);
}

function jmBuildTemplate4Html(data,subUl) {
	jmDebugConsole("jmBuildTemplate4Html()");
	subUl.append('<li class="template"></li>');
	var subLi = jQuery("li.template",subUl);
	if(data.sub_nav[0].nav!==undefined) {	//Split menu (Men/Women)
		jmDebugConsole("Split menu (Men/Women)");
		subLi.append('<div class="standard schedule split"></div>');
		jmBuildSplitMenuHtml(data,subLi);
	}
	else {	//Combined Sports
		jmDebugConsole("Combined Sports")
		subLi.append('<div class="standard schedule"><ul class="subnav"></ul></div>');
		jmBuildTemplateStandardLinkHtml(data,subLi);
	}
	jmBuildFeatureLabelHtml(data,subLi);
	jmBuildImageTextAdHtml(data,subLi);
}

function jmBuildTemplate5Html(data,subUl) {
	jmDebugConsole("jmBuildTemplate5Html()");
	subUl.append('<li class="template"></li>');
	var subLi = jQuery("li.template",subUl);
	if(data.sub_nav[0].nav!==undefined) {	//Split menu
		jmDebugConsole("Split menu standard");
		subLi.append('<div class="standard standard-split split"></div>');
		jmBuildSplitMenuHtml(data,subLi);
	}
	jmBuildFeatureLabelHtml(data,subLi);
	jmBuildImageTextAdHtml(data,subLi);
}

function jmBuildTemplate6Html(data,subUl) {
	jmDebugConsole("jmBuildTemplate6Html()");
	subUl.append('<li class="template"></li>');
	var subLi = jQuery("li.template",subUl);
	jmBuildFeatureLabelHtml(data,subLi);
	jmBuildImageTextAdHtml(data,subLi);
}


function jmCheckMenuSize() {
	jmDebugConsole('jmCheckMenuSize - width:'+jQuery(window).width());
	if(jQuery(window).width()>jmMobileWidth) {
		jmDebugConsole('disable mobile menu');
		jmMainMenu.removeClass("mobile-menu");
		jQuery(".parent.sub",jmMainMenu).removeClass("menu-active");
		jmMainMenu.removeClass('show-mobile');
	}
	else {
		jmDebugConsole('enable mobile menu');
		jmMainMenu.addClass("mobile-menu");
	}
}

function jmSetupStyles(data) {
	jmDebugConsole("jmSetupStyles()");
	var menuParents = jQuery("li.parent",jmMainMenu);
	//Style Parents
	menuParents.first().addClass("first");
	menuParents.last().addClass("last");
	menuParents.each(function(index,ele) {
		if( (index%2) == 0) {
			jQuery(this).addClass("odd");
		}
		else {
			jQuery(this).addClass("even");
		}
	});
	//Style subnav
	jQuery("ul.subnav").not('.template-ul').each(function(index,ele) {
		jQuery('li:first',jQuery(this)).addClass("first");
		jQuery('li:last',jQuery(this)).addClass("last");
		jQuery('li',jQuery(this)).not('template').each(function(index2,ele2) {
			if( (index2%2) == 0) {
				jQuery(this).addClass("odd");
			}
			else {
				jQuery(this).addClass("even");
			}
		});
	});
	//auto center
	if(data.auto_center_ul===true) {
		jmMainMenu.addClass("auto-center-ul").css({
			"margin-left":"auto",
			"margin-right":"auto"
		});
		jmDebugConsole("center menu");
		var ulWidth = 0;
		jQuery(".parent,.divider",jmMainMenu).each(function(index,ele) {
			ulWidth += jQuery(this).width();
		});
		jmDebugConsole("ulWidth:"+ulWidth);
		jmMainMenu.css("width",ulWidth+"px");
	}
}

function jmSetupMenuEvents(data) {
	var menuTimer;

	jQuery("button",jmListMenuButton).click(function() {
		//console.log("click here");
		jmMainMenu.toggleClass('show-mobile');
		jmListMenuButton.toggleClass('show-mobile');
	});

	jQuery(".parent,.divider",jmMainMenu).mouseenter(function() {
		if(jQuery(this).hasClass("sub")) {
			if(!jmMainMenu.hasClass("show-mobile")) {

					var offsetLeft = 0;
					var index = jQuery(this).index();
					for(var x = 0;x<index;x++) {
						offsetLeft += jQuery(".parent,.divider",jmMainMenu).eq(x).width();
					}
					if(data.template_relative===true) {
						jQuery(".template-ul",jQuery(this)).css({
							"width":jmMenuContainer.width()+"px"
						});
					}
					else {
						jQuery(".template-ul",jQuery(this)).css({
							"width":jmMenuContainer.width()+"px"
						});
					}		
					
					var menuToShow = this;
				menuTimer = setTimeout(function() {
					jQuery(menuToShow).addClass("menu-active");
				}, jmMenuDelay);
			}
		}
	}).mouseleave(function() {
		if(!jmMainMenu.hasClass("show-mobile")) {
			clearTimeout(menuTimer);
			jQuery(this).removeClass("menu-active");
		}
	});

	jQuery(".parent.sub",jmMainMenu).click(function() {
		jmMenuItem = this;

		if(jmMainMenu.hasClass("show-mobile")) {
			if (jQuery(jmMenuItem).hasClass('menu-active')) {
				jQuery(jmMenuItem).removeClass('menu-active');
			}
			else {
				jQuery(".parent.sub.menu-active",jmMainMenu).removeClass('menu-active');
				jQuery(jmMenuItem).addClass('menu-active');
			}
			//jQuery(this).toggleClass("menu-active");
		}
	});

	jQuery(window).resize(function() {
		if (jmWindowWidth != jQuery(window).width()) {
			jmWindowWidth = jQuery(window).width();
			jmCheckMenuSize();
		}
	});
}

function jmSectionMenuSetup() {
	if(jQuery("li.more",jmSectionMenu).length>0) {
		jQuery("li.more",jmSectionMenu).mouseover(function () {
			jQuery(this).addClass("menu-active");
			jQuery(this).children("ul").css("visibility","visible");
			jQuery(this).bind("mouseleave", function(e){
				jQuery(this).removeClass("menu-active");
				jQuery(this).children("ul").css("visibility","hidden");
			});
		});
	}
}

function jmMenuStart() {
	jmGetMenuData();
	jmSectionMenuSetup();
}

jQuery(function() {
	jmMenuStart(); //Start
});
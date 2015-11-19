var qr_minPasswordLength = 5;
/*
jQuery(document).ready(function () {
	jQuery("#quickReg-submit").click(function () { 
		//console.log("Submit Clicked");
		qrCheckFormFields();
    });

});
*/
function qrCheckFormFieldsLogin() {
	jQuery("#qr-messages").fadeOut();
	
	oemid = jQuery.trim(jQuery("#quickReg-oemid").html());
	email = jQuery("#quickReg-email").val();
	password = jQuery("#quickReg-password").val();
	
	userNameField = 'ACCT_NUM_'+oemid;
	passwordField = 'PASSWD';
	fnValue = 'LOGIN';
	
	fieldsValid = true;
	
	if(email=='') {
		fieldsValid = false;
		//console.log("email fail");
		jQuery("#quickReg-email").addClass("validation-failed");
		jQuery("#qr-messages").append("* You must enter a valid email.<br />");
	}	
	
	if(password=='') {
		fieldsValid = false;
		//console.log("password to short");
		jQuery("#quickReg-password").addClass("validation-failed");
		jQuery("#qr-messages").append("* Password must be 5 or more characters.<br />");
	}
	
	if(!fieldsValid) {
		jQuery("#qr-messages").fadeIn();
	}
	else {
		qrGetLoginKey(email,password,oemid);
	}
}

function qrCheckFormFields() {
	jQuery("#quickRegMessage").html("");
	jQuery("#quickRegMessage").css("display","none");
	
	useCommunity = false;
	
	oemid = jQuery.trim(jQuery("#quickReg-oemid").html());
	email = jQuery("#quickReg-email").val();
	password = jQuery("#quickReg-password").val();
	password2 = jQuery("#quickReg-password2").val();
	firstname = jQuery("#quickReg-firstname").val();
	lastname = jQuery("#quickReg-lastname").val();
	
	if(jQuery("#quickReg-communityname").length>0) {
		communityname = jQuery("#quickReg-communityname").val();
		useCommunity = true;
	}	
	fieldsValid = true;
	
	jQuery("#qr-messages").html("");
	jQuery("#qr-messages").hide();
	jQuery(".validation-failed").removeClass("validation-failed");
	
	if(!qrIsValidEmail(email)) {
		fieldsValid = false;
		//console.log("email fail");
		jQuery("#quickReg-email").addClass("validation-failed");
		jQuery("#qr-messages").append("* You must enter a valid email.<br />");
	}		
		
	if(!qrIsValidPassword(password)) {
		fieldsValid = false;
		//console.log("password to short");
		jQuery("#quickReg-password").addClass("validation-failed");
		jQuery("#qr-messages").append("* Password must be 5 or more characters.<br />");
	}
	else { 
		if(password!=password2) {
			fieldsValid = false;
			//console.log("passwords don't match");
			jQuery("#quickReg-password2").addClass("validation-failed");
			jQuery("#qr-messages").append("* Password's don't match.<br />");
		}	
	}
	
	if((firstname==null)||(firstname=="")) {
		fieldsValid = false;
		//console.log("First name missing");	
		jQuery("#quickReg-firstname").addClass("validation-failed");
		jQuery("#qr-messages").append("* First name required.<br />");
	}
	
	if((lastname==null)||(lastname=="")) {
		fieldsValid = false;
		//console.log("Last name missing");	
		jQuery("#quickReg-lastname").addClass("validation-failed");
		jQuery("#qr-messages").append("* Last name required.<br />");
	}
	
	if(useCommunity) {
		if(communityname=="") {
			fieldsValid = false;
			communityname = false;
			jQuery("#quickReg-communityname").addClass("validation-failed");
			jQuery("#qr-messages").append("* Community Name required.<br />");
		}
		else if((communityname.length < 3) && (communityname.length > 0)) {
			fieldsValid = false;
			jQuery("#quickReg-communityname").addClass("validation-failed");
			jQuery("#qr-messages").append("* Community Name must be 3 or more characters.<br />");
		}
		else if(communityname[0]=='_') {
			fieldsValid = false;
			jQuery("#quickReg-communityname").addClass("validation-failed");
			jQuery("#qr-messages").append("* Community Name may not start with (_).<br />");
		}
		else if(!qrCheckUsername(communityname)) {
			fieldsValid = false;
			jQuery("#quickReg-communityname").addClass("validation-failed");
			jQuery("#qr-messages").append("* Community Name may only contain (A-z, 0-9, _) characters.<br />");
		}
		else {
			reload_vars = 'DB_OEM_ID='+oemid+'&communityname='+communityname;
			jQuery.ajax({
				type:'POST',
				url:qrGetBaseUrl()+'/quickReg/checkCommunityName.dbml',
				data:reload_vars,
				success: function(data) {	
					if(jQuery.trim(data)=="available") {
						//console.log("available");
					}
					else if(jQuery.trim(data)=="taken") {
						//console.log("taken");
						fieldsValid = false;
						jQuery("#quickReg-communityname").addClass("validation-failed");
						jQuery("#qr-messages").append("* Community Name is already in use, please choose another.<br />");
					}	
				}
			});	
		}
		
	}
	
	if(!fieldsValid) {
		jQuery("#qr-messages").fadeIn();
	}
	else {
		if(useCommunity)
			reload_vars = 'DB_OEM_ID='+oemid+'&email='+email+'&password='+password+'&firstname='+firstname+'&lastname='+lastname+'&communityname='+communityname;
		else
			reload_vars = 'DB_OEM_ID='+oemid+'&email='+email+'&password='+password+'&firstname='+firstname+'&lastname='+lastname;
		jQuery.ajax({
			type:'POST',
			url:qrGetBaseUrl()+'/quickReg/submitQuickReg.dbml',
			data:reload_vars,
			success: function(data) {	
				if(jQuery.trim(data)=="success") {
					jQuery("#quickRegMessage").html('<span class="success">Account Created.</span>');
					jQuery("#quickRegMessage").fadeIn("2500");
					setTimeout("qrGetLoginKey(email,password,oemid)",2000);
				}
				else if(jQuery.trim(data)=="taken") {
					jQuery("#quickRegMessage").html('<span class="fail">E-mail in use, try "Forgot your password?"</span>');
					jQuery("#quickRegMessage").fadeIn("2500");
				}
				else if(jQuery.trim(data)=="fail") {
					jQuery("#quickRegMessage").html('<span class="fail">Account Creation Failed.</span>');
					jQuery("#quickRegMessage").fadeIn("2500");
				}
				else if(jQuery.trim(data)=="community-taken") {
					jQuery("#quickReg-communityname").addClass("validation-failed");
					//jQuery("#qr-messages").append("* Community Name taken, choose another.<br />");
					//jQuery("#qr-messages").fadeIn();
					jQuery("#quickRegMessage").html('<span class="fail">Community Name taken, choose another.</span>');
					jQuery("#quickRegMessage").fadeIn("2500");
				}
				else {
					jQuery("#quickRegMessage").html('<span class="fail">There was an error creating your account.</span>');
					jQuery("#quickRegMessage").fadeIn("2500");
				}
			}
		});	
	}
}

function qrGetLoginKey(username,password,oemid) {
	jQuery("#quickRegMessage").html("");
	jQuery("#quickRegMessage").css("display","none");
	//console.log("qrGetLoginKey called");
	userNameField = 'ACCT_NUM_'+oemid;
	passwordField = 'PASSWD';
	fnValue = 'LOGIN';
	
	reload_vars = 'DB_OEM_ID='+oemid+'&'+userNameField+'='+username+'&'+passwordField+'='+password+'&FN='+fnValue+'&DB_LANG=C&PG_BAD=/quickReg/submitLogin.dbml&DB_ACCOUNT_TYPE=USER&DB_SLK=YES&NC=1&PG=/quickReg/submitLogin.dbml';
	jQuery.ajax({
		type:'POST',
		url:qrGetBaseUrl()+'/quickReg/submitLogin.dbml',
		data:reload_vars,
		success: function(data) {	
			if(jQuery.trim(data)=='fail') {
				jQuery("#quickRegMessage").html('<span class="fail">Login Failed</span>');
				jQuery("#quickRegMessage").fadeIn("2500");
			}
			else if(jQuery.trim(data)>"") {
				jQuery("#quickRegMessage").html('<span class="success">Login Successful</span>');
				jQuery("#quickRegMessage").fadeIn("2500");
				//console.log(data);	
				reload = jQuery("#quickReg-reload").html();
				ajaxReloadUrl = jQuery("#quickReg-reload-url").html();
				if(ajaxReloadUrl>"")
					qr_redirect = ajaxReloadUrl;
				setCookie('KEY_'+oemid,data,1)
				setCookie('ACCT_NUM_USER_'+oemid,username,1);
				if((reload=='true') && (ajaxReloadUrl=="")) {
					tempUrl = String(window.location);
					if(tempUrl.match('.dbml')) {
						newUrl = window.location + '&KEY='+data;
						window.location=newUrl;
					}
					else {
						newUrl = window.location + 'HomePage.dbml?KEY='+data;
						window.location=newUrl;
					}					
				}
				else {
					window.location=qr_redirect;
				}
			}
			else {
				jQuery("#quickRegMessage").html('<span class="fail">Unknown error</span>');
				jQuery("#quickRegMessage").fadeIn("2500");
			}
		}
	});	
	
	
}

function qrIsValidPassword(str) {
	if(str.length>=qr_minPasswordLength)
		return true;
	else 
		return false;	
}

function qrIsValidEmail(str) {
   return (str.indexOf(".") > 2) && (str.indexOf("@") > 0);
}

function qrGetBaseUrl() {
 	urlTokens = window.location.href.split('/');
 	url = urlTokens[0]+'//'+urlTokens[2];
 	return url;
}

function qrLogin(oemid,redirectUrl) {
	redirectUrl = qrGetBaseUrl()+'/'+redirectUrl;
	//console.log(qrGetBaseUrl()+'/quickReg/quickLoginForm.dbml');
	jQuery("#qr-login-box").remove();
	objLoginBox = jQuery("#qr-login-box");
	jQuery("body").prepend('<div id="qr-login-box"></div>');
	objLoginBox = jQuery("#qr-login-box");
	reload_vars = 'DB_OEM_ID='+oemid+'&redirectUrl='+redirectUrl;
	jQuery.ajax({
		type:'POST',
		url:qrGetBaseUrl()+'/quickReg/quickLoginForm.dbml',
		data:reload_vars,
		success: function(data) {	
			if(jQuery.trim(data)>'') {
				objLoginBox.html(data);
			}
		}
	});
	
	windowscrollTop = jQuery(window).scrollTop();
	windowH = jQuery(window).height();
	windowW = jQuery(window).width();
	boxH = objLoginBox.height();
	boxW = objLoginBox.width();
	boxTop = Math.round((windowH - boxH)/2)+windowscrollTop;
	boxLeft = Math.round((windowW - boxW)/2);

	objLoginBox.css("position","absolute");
	objLoginBox.css("top",boxTop);
	objLoginBox.css("left",boxLeft);
	objLoginBox.css("z-index","1050");
	objLoginBox.fadeIn(250);
}

function qrOpen(oemid,redirectUrl) {
	jQuery("body").prepend('<div id="qr-box"></div>');
	
	reload_vars = 'DB_OEM_ID='+oemid+'&redirectUrl='+redirectUrl;
	jQuery.ajax({
		type:'POST',
		url:qrGetBaseUrl()+'/quickReg/getAjaxQuickRegForm.dbml',
		data:reload_vars,
		success: function(data) {	
			if(jQuery.trim(data)>'') {
				jQuery("#qr-box").html(data);
				if(jQuery("#qr-box #quickReg-communityname").length>0) {
					jQuery("#qr-box").addClass("hasCommunity");
				}	
			}
		}
	});	
	
	windowscrollTop = jQuery(window).scrollTop();
	windowH = jQuery(window).height();
	windowW = jQuery(window).width();
	boxH = jQuery("#qr-box").height();
	boxW = jQuery("#qr-box").width();
	boxTop = Math.round((windowH - boxH)/2)+windowscrollTop;
	boxLeft = Math.round((windowW - boxW)/2);

	jQuery("#qr-box").css("position","absolute");
	jQuery("#qr-box").css("top",boxTop);
	jQuery("#qr-box").css("left",boxLeft);
	jQuery("#qr-box").css("z-index","1050");
	jQuery("#qr-box").fadeIn(250);
}

function qrCancel() {
	jQuery("#qr-box").fadeOut(250);
	setTimeout("qrRemove()",300);	
}

function qrCancelLogin() {
	jQuery("#qr-login-box").fadeOut(250);
	setTimeout("qrRemoveLogin()",300);	
}

function qrRemoveLogin() {
	jQuery("#qr-login-box").remove();
}

function qrRemove() {
	jQuery("#qr-box").remove();
}

function setCookie(c_name,value,expiredays) {
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
}

function qrCheckUsername(checkString) {
	var regExp = /^[A-Za-z0-9/_]$/;
	if(checkString!= null && checkString!= "")
    {
    	for(var i = 0; i < checkString.length; i++)
        	if (!checkString.charAt(i).match(regExp))
              return false;
  	}
  	else
    	return false;
	return true;
}


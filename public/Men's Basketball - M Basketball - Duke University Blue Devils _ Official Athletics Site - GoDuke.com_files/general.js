function adjustEventDetailsBox() {
	if($('#event-details-container').length){
		var total_height  = $('.container-fluid').height();
		var filter_offset = $('#event-details-container').offset();
		if (filter_offset) {
			var grid_height = total_height - filter_offset.top - $('.footer .content').height() - 40;
			if(grid_height < 100){
				grid_height = 'auto';
			}else{
				grid_height += 'px';
			}
			$('#event-details-container').css('height', grid_height);
		}
		return;
	}
	
	var total_height  = $('.container-fluid').height();
	var filter_offset = $('#event-details-header-row').offset();
	if (filter_offset) {
		var grid_height   = total_height - (filter_offset.top + $('#event-details-header-row > .span12').height())  - $('.footer .content').height() - 15;
		$('#event-details-row').animate({'height' : grid_height + 'px'});
	}
}

$(window).load(function() {
	if (LAYOUT_TYPE == "L") {
		adjustEventDetailsBox();
	}
	$('.dropdown').on('contextmenu', function(e){
		e.preventDefault();
		  // Your code.
	});
});

String.prototype.titleCase = function(){
	return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

(function($) {
$.fn.serializeFormJSON = function() {

   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push($.trim(this.value) || '');
       } else {
           o[this.name] = $.trim(this.value) || '';
       }
   });
   return o;
};
})(jQuery);

(function($) {
	$.fn.hasVScroll = function() {
		var hasScroll = this[0].scrollHeight > this.height();
		if(hasScroll){
			this.addClass('vscroll');
		}else{
			this.removeClass('vscroll');
		}
		
		return hasScroll;
	};
	$.fn.hasHScroll = function() {
		return this[0].scrollWidth > this.width(); 
	};
})(jQuery);

Date.prototype.add = function (sInterval, iNum){
  var dTemp = this;
  if (!sInterval || iNum == 0) return dTemp;
  switch (sInterval.toLowerCase()){
    case "ms":
      dTemp.setMilliseconds(dTemp.getMilliseconds() + iNum);
      break;
    case "s":
      dTemp.setSeconds(dTemp.getSeconds() + iNum);
      break;
    case "mi":
      dTemp.setMinutes(dTemp.getMinutes() + iNum);
      break;
    case "h":
      dTemp.setHours(dTemp.getHours() + iNum);
      break;
    case "d":
      dTemp.setDate(dTemp.getDate() + iNum);
      break;
    case "mo":
      dTemp.setMonth(dTemp.getMonth() + iNum);
      break;
    case "y":
      dTemp.setFullYear(dTemp.getFullYear() + iNum);
      break;
  }
  return dTemp;
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
        "use strict";
        if (this == null) {
            throw new TypeError();
        }
        var t = Object(this);
        var len = t.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = 0;
        if (arguments.length > 1) {
            n = Number(arguments[1]);
            if (n != n) { // shortcut for verifying if it's NaN
                n = 0;
            } else if (n != 0 && n != Infinity && n != -Infinity) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
        }
        if (n >= len) {
            return -1;
        }
        var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
        for (; k < len; k++) {
            if (k in t && t[k] === searchElement) {
                return k;
            }
        }
        return -1;
    };
}

//Add custom validator
if($.validator){
	$.validator.addMethod("phone", function(value, element) {
	    return !isNaN(value.replace(/[-]/g,'')); 
	}, INVALID_MOBILE_NO);	
}

//A little safari hack!
try{
	if($.browser.safari){
		$('#action-nav-list').addClass('safari-right-margin-fix');
	}
}catch(e){}

$('.fb-post-btn').live('click', function(){
	if($(this).attr('restriction') == ''){
		alert(NO_CAL_SELECTED);
		return;
	}
		
	if(confirm(ARE_YOU_SURE_FB_POST)){
		window.open($(this).attr('url'));
	}
});

function msieversion() {

    var ua   = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0) {
        return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
    }
    return 0;
}

function is_ios(){
    var iOS = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
    return iOS;
}

function is_win_tablet()
{
    return (navigator.userAgent.toLowerCase().indexOf("windows nt") != -1 &&
            navigator.userAgent.toLowerCase().indexOf("touch") != -1);
}

function is_winphone()
{
    return (navigator.userAgent.toLowerCase().indexOf("windows phone") != -1);
}

/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 * jQuery.browser.mobile will be true if the browser is a mobile device
 **/
(function(a){jQuery.browser.mobile=/android|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(ad|hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|tablet|treo|up\.(browser|link)|vodafone|wap|webos|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
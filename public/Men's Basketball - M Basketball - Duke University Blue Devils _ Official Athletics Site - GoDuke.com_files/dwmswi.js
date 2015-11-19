//var __dwRoot = "http://sanford.jtvs.jumptv.com/DeepWidgets";
urlTokens = window.location.href.split('/');
var __dwRoot = urlTokens[0] + '//' + urlTokens[2];
__dwRoot = __dwRoot + '/DeepWidgets';

var dwflspath = __dwRoot + '/../fls/'+dwOemId+'/DeepWidgets';
var dwhostnameurl = urlTokens[0] + '//' + urlTokens[2];
var dwhostname = urlTokens[2];

DW_WIDGET_DIR = __dwRoot + "/";
DW_SYSLIB = __dwRoot + "/";
WIDGET_USERLIB_ROOT = __dwRoot + "/wudata/";
DW_WIDGET_LIB_ROOT = __dwRoot + "/";
SWF_CONTAINER_URL = __dwRoot + "/w4bC.swf";
dwGAID = '';

function __dwmswi(wp) {

    if (typeof(_dwKn0wnWps) == 'undefined') {
        _dwKn0wnWps = [wp];
    } else {
        _dwKn0wnWps.push(wp);
    }

    if (wp == "d33pw1dg3t") return true; // used to verify script is installed
    var jquery_path = "http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js";
    var swfobj_path = "http://ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js";

    //var scr=document.getElementsByTagName('script');
    //var src=scr[scr.length-2].getAttribute("src");
    //var a = src.split('/');
    //a.pop(); a.pop();
    //src = a.join("/");
    var sysfiles_path = __dwRoot + "/javascripts/dwcontainerc.js";

    //	if (DWSMESH_STANDALONE_MODE == 'yes') {
    //		sysfiles_path = "http://cdnsysfiles.smesh.net/" + sysfiles_path;
    //	} else {
    //		sysfiles_path =  DW_WIDGET_DIR + sysfiles_path;
    //	}
    var js = [jquery_path, swfobj_path, sysfiles_path];

    function deployDW(wi) {
        //		try {
        //			eval(d33pw1dg3t);
        // WIDGET_USERLIB_ROOT = d33pw1dg3t; parent.dwmsComplete(wp, bas3ur1); initClickThrough();
        //		} catch (err) { }
        //		_loadDeepWidgetWp(wp);
        _dw_last_wi_path = wi;
        _loadDeepWidget(wi);
    };

    function loadJS() {
        if (js.length <= 0) {
            deployDW(wp);
            return;
        }
        var src = js.shift()
        // here
        if (src == jquery_path) {
            try {
                jQuery();
                loadJS();
                return;
            } catch (err) {}
        }

        var script = document.createElement('script');
        script.setAttribute('src', src);
        script.setAttribute('type', 'text/javascript');
        var loaded = false;

        document.getElementsByTagName('head')[0].appendChild(script);
        // FOR NON-IE
        script.onload = function () {
            if (loaded) return;
            loaded = true;
            if (src == jquery_path) jQuery.noConflict();
            loadJS();
        };
        // FOR IE:
        script.onreadystatechange = function () {
            if (loaded) return;
            if (this.readyState == "loading") return;
            loaded = true;
            if (src == jquery_path) jQuery.noConflict();
            loadJS();
        };
    };
    //document.addEventListener('DOMContentLoaded', function() {loadJS();}, false);
    loadJS();
};

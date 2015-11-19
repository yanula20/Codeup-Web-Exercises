/** jQuery JSON plugin for encoding and decoding from and to JSON **/
(function ($) {
	$.toJSON = function (o) {
		if (typeof (JSON) == 'object' && JSON.stringify)
			return JSON.stringify(o); var type = typeof (o); if (o === null)
			return "null"; if (type == "undefined")
			return undefined; if (type == "number" || type == "boolean")
			return o + ""; if (type == "string")
			return $.quoteString(o); if (type == 'object') {
			if (typeof o.toJSON == "function")
				return $.toJSON(o.toJSON()); if (o.constructor === Date) {
				var month = o.getUTCMonth() + 1; if (month < 10) month = '0' + month; 
				var day = o.getUTCDate(); if (day < 10) day = '0' + day; 
				var year = o.getUTCFullYear(); 
				var hours = o.getUTCHours(); if (hours < 10) hours = '0' + hours; 
				var minutes = o.getUTCMinutes(); if (minutes < 10) minutes = '0' + minutes; 
				var seconds = o.getUTCSeconds(); if (seconds < 10) seconds = '0' + seconds; 
				var milli = o.getUTCMilliseconds(); if (milli < 100) milli = '0' + milli; 
				if (milli < 10) milli = '0' + milli; return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
			}
			if (o.constructor === Array) {
				var ret = []; for (var i = 0; i < o.length; i++)
					ret.push($.toJSON(o[i]) || "null"); return "[" + ret.join(",") + "]";
			}
			var pairs = []; for (var k in o) {
				var name; var type = typeof k; if (type == "number")
					name = '"' + k + '"'; else if (type == "string")
					name = $.quoteString(k); else
					continue; if (typeof o[k] == "function")
					continue; var val = $.toJSON(o[k]); pairs.push(name + ":" + val);
			}
			return "{" + pairs.join(", ") + "}";
		}
	}; $.evalJSON = function (src) {
		if (typeof (JSON) == 'object' && JSON.parse)
			return JSON.parse(src); return eval("(" + src + ")");
	}; $.secureEvalJSON = function (src) {
		if (typeof (JSON) == 'object' && JSON.parse)
			return JSON.parse(src); var filtered = src; filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@'); filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']'); filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, ''); if (/^[\],:{}\s]*$/.test(filtered))
			return eval("(" + src + ")"); else
			throw new SyntaxError("Error parsing JSON, source is not valid.");
	}; $.quoteString = function (string) {
		if (string.match(_escapeable)) {
			return '"' + string.replace(_escapeable, function (a)
			{ var c = _meta[a]; if (typeof c === 'string') return c; c = a.charCodeAt(); return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16); }) + '"';
		}
		return '"' + string + '"';
	}; var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g; var _meta = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"': '\\"', '\\': '\\\\' };
})( (typeof jQuerySL !== 'undefined' ? jQuerySL : jQuery) );

/*! JSON v3.3.0 | http://bestiejs.github.io/json3 | Copyright 2012-2014, Kit Cambridge | http://kit.mit-license.org */
(function(n){function K(p,q){function s(a){if(s[a]!==v)return s[a];var c;if("bug-string-char-index"==a)c="a"!="a"[0];else if("json"==a)c=s("json-stringify")&&s("json-parse");else{var e;if("json-stringify"==a){c=q.stringify;var b="function"==typeof c&&r;if(b){(e=function(){return 1}).toJSON=e;try{b="0"===c(0)&&"0"===c(new A)&&'""'==c(new B)&&c(t)===v&&c(v)===v&&c()===v&&"1"===c(e)&&"[1]"==c([e])&&"[null]"==c([v])&&"null"==c(null)&&"[null,null,null]"==c([v,t,null])&&'{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}'==
c({a:[e,!0,!1,null,"\x00\b\n\f\r\t"]})&&"1"===c(null,e)&&"[\n 1,\n 2\n]"==c([1,2],null,1)&&'"-271821-04-20T00:00:00.000Z"'==c(new D(-864E13))&&'"+275760-09-13T00:00:00.000Z"'==c(new D(864E13))&&'"-000001-01-01T00:00:00.000Z"'==c(new D(-621987552E5))&&'"1969-12-31T23:59:59.999Z"'==c(new D(-1))}catch(f){b=!1}}c=b}if("json-parse"==a){c=q.parse;if("function"==typeof c)try{if(0===c("0")&&!c(!1)){e=c('{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}');var l=5==e.a.length&&1===e.a[0];if(l){try{l=!c('"\t"')}catch(d){}if(l)try{l=
1!==c("01")}catch(h){}if(l)try{l=1!==c("1.")}catch(m){}}}}catch(X){l=!1}c=l}}return s[a]=!!c}p||(p=n.Object());q||(q=n.Object());var A=p.Number||n.Number,B=p.String||n.String,G=p.Object||n.Object,D=p.Date||n.Date,J=p.SyntaxError||n.SyntaxError,N=p.TypeError||n.TypeError,R=p.Math||n.Math,H=p.JSON||n.JSON;"object"==typeof H&&H&&(q.stringify=H.stringify,q.parse=H.parse);var G=G.prototype,t=G.toString,u,C,v,r=new D(-0xc782b5b800cec);try{r=-109252==r.getUTCFullYear()&&0===r.getUTCMonth()&&1===r.getUTCDate()&&
10==r.getUTCHours()&&37==r.getUTCMinutes()&&6==r.getUTCSeconds()&&708==r.getUTCMilliseconds()}catch(Y){}if(!s("json")){var E=s("bug-string-char-index");if(!r)var w=R.floor,S=[0,31,59,90,120,151,181,212,243,273,304,334],F=function(a,c){return S[c]+365*(a-1970)+w((a-1969+(c=+(1<c)))/4)-w((a-1901+c)/100)+w((a-1601+c)/400)};(u=G.hasOwnProperty)||(u=function(a){var c={},e;(c.__proto__=null,c.__proto__={toString:1},c).toString!=t?u=function(a){var c=this.__proto__;a=a in(this.__proto__=null,this);this.__proto__=
c;return a}:(e=c.constructor,u=function(a){var c=(this.constructor||e).prototype;return a in this&&!(a in c&&this[a]===c[a])});c=null;return u.call(this,a)});var T={"boolean":1,number:1,string:1,undefined:1};C=function(a,c){var e=0,b,f,l;(b=function(){this.valueOf=0}).prototype.valueOf=0;f=new b;for(l in f)u.call(f,l)&&e++;b=f=null;e?C=2==e?function(a,c){var e={},b="[object Function]"==t.call(a),f;for(f in a)b&&"prototype"==f||u.call(e,f)||!(e[f]=1)||!u.call(a,f)||c(f)}:function(a,c){var e="[object Function]"==
t.call(a),b,f;for(b in a)e&&"prototype"==b||!u.call(a,b)||(f="constructor"===b)||c(b);(f||u.call(a,b="constructor"))&&c(b)}:(f="valueOf toString toLocaleString propertyIsEnumerable isPrototypeOf hasOwnProperty constructor".split(" "),C=function(a,c){var e="[object Function]"==t.call(a),b,g;if(g=!e)if(g="function"!=typeof a.constructor)g=typeof a.hasOwnProperty,g="object"==g?!!a.hasOwnProperty:!T[g];g=g?a.hasOwnProperty:u;for(b in a)e&&"prototype"==b||!g.call(a,b)||c(b);for(e=f.length;b=f[--e];g.call(a,
b)&&c(b));});return C(a,c)};if(!s("json-stringify")){var U={92:"\\\\",34:'\\"',8:"\\b",12:"\\f",10:"\\n",13:"\\r",9:"\\t"},x=function(a,c){return("000000"+(c||0)).slice(-a)},O=function(a){for(var c='"',b=0,g=a.length,f=!E||10<g,l=f&&(E?a.split(""):a);b<g;b++){var d=a.charCodeAt(b);switch(d){case 8:case 9:case 10:case 12:case 13:case 34:case 92:c+=U[d];break;default:if(32>d){c+="\\u00"+x(2,d.toString(16));break}c+=f?l[b]:a.charAt(b)}}return c+'"'},L=function(a,c,b,g,f,l,d){var h,m,k,n,p,q,r,s,y;try{h=
c[a]}catch(z){}if("object"==typeof h&&h)if(m=t.call(h),"[object Date]"!=m||u.call(h,"toJSON"))"function"==typeof h.toJSON&&("[object Number]"!=m&&"[object String]"!=m&&"[object Array]"!=m||u.call(h,"toJSON"))&&(h=h.toJSON(a));else if(h>-1/0&&h<1/0){if(F){n=w(h/864E5);for(m=w(n/365.2425)+1970-1;F(m+1,0)<=n;m++);for(k=w((n-F(m,0))/30.42);F(m,k+1)<=n;k++);n=1+n-F(m,k);p=(h%864E5+864E5)%864E5;q=w(p/36E5)%24;r=w(p/6E4)%60;s=w(p/1E3)%60;p%=1E3}else m=h.getUTCFullYear(),k=h.getUTCMonth(),n=h.getUTCDate(),
q=h.getUTCHours(),r=h.getUTCMinutes(),s=h.getUTCSeconds(),p=h.getUTCMilliseconds();h=(0>=m||1E4<=m?(0>m?"-":"+")+x(6,0>m?-m:m):x(4,m))+"-"+x(2,k+1)+"-"+x(2,n)+"T"+x(2,q)+":"+x(2,r)+":"+x(2,s)+"."+x(3,p)+"Z"}else h=null;b&&(h=b.call(c,a,h));if(null===h)return"null";m=t.call(h);if("[object Boolean]"==m)return""+h;if("[object Number]"==m)return h>-1/0&&h<1/0?""+h:"null";if("[object String]"==m)return O(""+h);if("object"==typeof h){for(a=d.length;a--;)if(d[a]===h)throw N();d.push(h);y=[];c=l;l+=f;if("[object Array]"==
m){k=0;for(a=h.length;k<a;k++)m=L(k,h,b,g,f,l,d),y.push(m===v?"null":m);a=y.length?f?"[\n"+l+y.join(",\n"+l)+"\n"+c+"]":"["+y.join(",")+"]":"[]"}else C(g||h,function(a){var c=L(a,h,b,g,f,l,d);c!==v&&y.push(O(a)+":"+(f?" ":"")+c)}),a=y.length?f?"{\n"+l+y.join(",\n"+l)+"\n"+c+"}":"{"+y.join(",")+"}":"{}";d.pop();return a}};q.stringify=function(a,c,b){var g,f,l,d;if("function"==typeof c||"object"==typeof c&&c)if("[object Function]"==(d=t.call(c)))f=c;else if("[object Array]"==d){l={};for(var h=0,m=c.length,
k;h<m;k=c[h++],(d=t.call(k),"[object String]"==d||"[object Number]"==d)&&(l[k]=1));}if(b)if("[object Number]"==(d=t.call(b))){if(0<(b-=b%1))for(g="",10<b&&(b=10);g.length<b;g+=" ");}else"[object String]"==d&&(g=10>=b.length?b:b.slice(0,10));return L("",(k={},k[""]=a,k),f,l,g,"",[])}}if(!s("json-parse")){var V=B.fromCharCode,W={92:"\\",34:'"',47:"/",98:"\b",116:"\t",110:"\n",102:"\f",114:"\r"},b,I,k=function(){b=I=null;throw J();},z=function(){for(var a=I,c=a.length,e,g,f,l,d;b<c;)switch(d=a.charCodeAt(b),
d){case 9:case 10:case 13:case 32:b++;break;case 123:case 125:case 91:case 93:case 58:case 44:return e=E?a.charAt(b):a[b],b++,e;case 34:e="@";for(b++;b<c;)if(d=a.charCodeAt(b),32>d)k();else if(92==d)switch(d=a.charCodeAt(++b),d){case 92:case 34:case 47:case 98:case 116:case 110:case 102:case 114:e+=W[d];b++;break;case 117:g=++b;for(f=b+4;b<f;b++)d=a.charCodeAt(b),48<=d&&57>=d||97<=d&&102>=d||65<=d&&70>=d||k();e+=V("0x"+a.slice(g,b));break;default:k()}else{if(34==d)break;d=a.charCodeAt(b);for(g=b;32<=
d&&92!=d&&34!=d;)d=a.charCodeAt(++b);e+=a.slice(g,b)}if(34==a.charCodeAt(b))return b++,e;k();default:g=b;45==d&&(l=!0,d=a.charCodeAt(++b));if(48<=d&&57>=d){for(48==d&&(d=a.charCodeAt(b+1),48<=d&&57>=d)&&k();b<c&&(d=a.charCodeAt(b),48<=d&&57>=d);b++);if(46==a.charCodeAt(b)){for(f=++b;f<c&&(d=a.charCodeAt(f),48<=d&&57>=d);f++);f==b&&k();b=f}d=a.charCodeAt(b);if(101==d||69==d){d=a.charCodeAt(++b);43!=d&&45!=d||b++;for(f=b;f<c&&(d=a.charCodeAt(f),48<=d&&57>=d);f++);f==b&&k();b=f}return+a.slice(g,b)}l&&
k();if("true"==a.slice(b,b+4))return b+=4,!0;if("false"==a.slice(b,b+5))return b+=5,!1;if("null"==a.slice(b,b+4))return b+=4,null;k()}return"$"},M=function(a){var c,b;"$"==a&&k();if("string"==typeof a){if("@"==(E?a.charAt(0):a[0]))return a.slice(1);if("["==a){for(c=[];;b||(b=!0)){a=z();if("]"==a)break;b&&(","==a?(a=z(),"]"==a&&k()):k());","==a&&k();c.push(M(a))}return c}if("{"==a){for(c={};;b||(b=!0)){a=z();if("}"==a)break;b&&(","==a?(a=z(),"}"==a&&k()):k());","!=a&&"string"==typeof a&&"@"==(E?a.charAt(0):
a[0])&&":"==z()||k();c[a.slice(1)]=M(z())}return c}k()}return a},Q=function(a,b,e){e=P(a,b,e);e===v?delete a[b]:a[b]=e},P=function(a,b,e){var g=a[b],f;if("object"==typeof g&&g)if("[object Array]"==t.call(g))for(f=g.length;f--;)Q(g,f,e);else C(g,function(a){Q(g,a,e)});return e.call(a,b,g)};q.parse=function(a,c){var e,g;b=0;I=""+a;e=M(z());"$"!=z()&&k();b=I=null;return c&&"[object Function]"==t.call(c)?P((g={},g[""]=e,g),"",c):e}}}q.runInContext=K;return q}var J=typeof define==="function"&&define.amd,
A="object"==typeof global&&global;!A||A.global!==A&&A.window!==A||(n=A);if("object"!=typeof exports||!exports||exports.nodeType||J){var N=n.JSON,B=K(n,n.JSON3={noConflict:function(){n.JSON=N;return B}});n.JSON={parse:B.parse,stringify:B.stringify}}else K(n,exports);J&&define(function(){return B})})(this);


/* Cookie manipulation bound to SCRIBBLE.utilities */
(function ($, window, undefined) {

	/**
	* Returns value for the specified cookie name
	*
	* @method getCookie
	* @public
	* @param  {String}      name Name of the cookie
	* @return {String|null} The value for the specified cookie; null if none found.
	*/
	GetCookie = function (name) {
		var start = document.cookie.indexOf(name + "="),
				len = start + name.length + 1,
				end = document.cookie.indexOf(';', len);

		if ((!start) && (name !== document.cookie.substring(0, name.length))) {
			return null;
		}

		if (start === -1) {
			return null;
		}


		if (end === -1) {
			end = document.cookie.length;
		}
		return unescape(document.cookie.substring(len, end));
	};

	/**
	* Sets a cookie with the specified name, value, expiry date, path, domain and whether
	* cookie should be transmitted over https
	*
	* @method setCookie
	* @public
	* @param  {String}  name                Name of the cookie
	* @param  {String}  value               The value for the specified cookie
	* @param  {Date}    expires (optional)  Expiry date for the cookie. If not specified 
	*                                       it will expire at the end of session
	* @param  {String}  path (optional)     (e.g., '/', '/mydir') If not specified, defaults 
	*                                       to the current path of the current document location
	* @param  {String}  domain (optional)   If not specified, defaults to the host portion of the 
	*                                       current document location. e.g., 'example.com', '.example.com' 
	*                                       (includes all subdomains), 'subdomain.example.com')
	* @param  {Boolean} secure (optional)   Indicates whether the cookie is only to be transmitted over 
	*                                       secure protocol as https
	*/
	SetCookie = function (name, value, expires, path, domain, secure) {

		var today = new Date(),
				expires_date;

		if (typeof expires === "object" && typeof expires !== "number") {
			// use the date provided
			expires_date = expires;
		}
		else {
			today.setTime(today.getTime());
			if (expires) {
				expires = expires * 1000 * 60 * 60 * 24;
			}

			expires_date = new Date(today.getTime() + (expires));
		}

		document.cookie = name + '=' + escape(value) +
				((expires) ? ';expires=' + expires_date.toGMTString() : '') + //expires.toGMTString()
				((path) ? ';path=' + path : '') +
				((domain) ? ';domain=' + domain : '') +
				((secure) ? ';secure' : '');

		return expires_date;
	};

	RemoveCookie = function (name) {
		document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}

	ToFriendlyNumber = function (pValue) {
		pValue = typeof pValue !== null ? pValue : 0;
		return pValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
	}

    OuterHtmlAll = function( pElements )
    {
        return jQuerySL( pElements ).clone().wrapAll("<div></div>").parent().html();
    }

    UrlToCorrectSecurityProtocol = function (pUrl) {
        pUrl = pUrl || "";
        var urlOut = "";

        if (pUrl !== "") {
            var isCurrentWebsiteHTTPS = document.location.href.indexOf("https") === 0;
            var indexOfSlashes = pUrl.indexOf("://");

            urlOut = (isCurrentWebsiteHTTPS ? "https" : "http") + pUrl.substr(indexOfSlashes);
        }

        return urlOut;

    }

    IsHttps = function ()
    {
        return document.location.href.match(/https:\/\//ig) !== null;
    }

    IsLocalhost = function () {
        if (document.location.href.match(/https?:\/\/localhost/ig) != null) {
            return true;
        }
    }

    IsDev = function () {
        if (document.location.href.match(/https?:\/\/dev.scribblelive.com/ig) != null || document.location.href.match(/https?:\/\/staging.scribblelive.com/ig) != null || document.location.href.match(/https?:\/\/.*?[.]scribblelive.me/ig) != null) {
            return true;
        }
    }

    IsClient = function ( isClient ) {

        if (document.location.href.match(/https?:\/\/client.scribblelive.com/ig) != null) {
            return true;
        }
    }

    GetInsertPosition = function ($container, $el, displaydate, ignore, pagingContainer, isLoad) {
        var items = $container.children((typeof ignore !== 'undefined' ? ":not(" + ignore + ")" : '' ));
        var position = null;
        var el = $container;

        var hasPaging = pagingContainer && pagingContainer.length && pagingContainer.html().trim() !== '' ? true : false;

        if (items.length > 0) {
            items.each(function (i, item) {

                var item = jQuerySL(item);
                var nextPost = item.next();

                var postDate = new Date(parseInt(item.attr("data-date"))).getTime();
                var nextPostDate = new Date(parseInt(nextPost.attr("data-date"))).getTime();

                // time is newer than post
                if (displaydate >= postDate) {
                    position = 'insertBefore';
                    el = item;
                    return false;
                }
                    // time is between two dates
                else if (displaydate < postDate && displaydate > nextPostDate) {
                    position = 'insertAfter';
                    el = item;
                    return false;
                }
                    // time is the same as one of the posts
                else if (displaydate === postDate) {
                    position = 'insertBefore';
                    el = item;
                    return false;
                }
                else if (nextPost.length === 0 && isLoad) {
                    position = 'insertAfter';
                    el = item;
                    return false;
                }
                else if (nextPost.length === 0 && hasPaging && !isLoad) {
                    el = item;
                    return false;
                }
                    // if it is the last item in the list, then add it to the end of the list.
                else if (nextPost.length === 0 && !hasPaging && !isLoad) {
                    position = 'insertAfter';
                    el = item;
                    return false;
                }
            });
        } else {
            return { 'location': 'append', 'element': el };
        }

        return { 'location': position, 'element': el };

    }

    function ReorderPinboard(container, $expost, post, postCreatedDate) {
        var position;
        if (!container || container.length === 0) return;
        if (!$expost || $expost.length === 0) return;
        if (!post) return;

        position = SCRIBBLE.utilities.GetInsertPosition(container, $expost, postCreatedDate, '.scrbbl-sticky', jQuerySL('#scrbbl-pagination-bottom'));

        if (position.location === null) {
            $expost.remove();
            return;
        } else {
            if (position.location !== 'append') {
                $expost[position.location](position.element);
            } else {
                $container[(post.rank !== 0) ? 'append' : 'prepend']($el);
            }

            $expost.attr('data-date', postCreatedDate);
        }
    }

    function ReorderStream(container, $expost, post, postCreatedDate) {
        var position;

        if (!container || container.length === 0) return;
        if (!$expost || $expost.length === 0) return;
        if (!post) return;
        if (!postCreatedDate) return;

        position = SCRIBBLE.utilities.GetInsertPosition(container, $expost, postCreatedDate, '.scrbbl-stick', jQuerySL('#scrbbl-pagination-bottom'));

        $expost.slideUp((4 * SCRIBBLE.liveblog.opts.render.animate.speed), function () {
            if (position.location === null) {
                $expost.remove();
                return;
            } else {
                if (position.location !== 'append') {
                    $expost[position.location](position.element);
                } else {
                    container[((typeof post.rank !== "undefined" && post.rank !== 0) || (typeof post.Rank && post.Rank !== "0")) ? 'append' : 'prepend']($expost);
                }

                $expost.attr('data-date', postCreatedDate);
                $expost.slideDown((4 * SCRIBBLE.liveblog.opts.render.animate.speed), function () {
                    $expost.removeAttr('style').removeClass('scrbbl-slide-down');
                });
            }
        });
    }

    GetReferrer = function() {
        var Source = "";
	
        var ExperienceIs = ( typeof SCRIBBLE !== "undefined" && SCRIBBLE.globals && SCRIBBLE.globals.experience && SCRIBBLE.globals.experience.is ? SCRIBBLE.globals.experience.is : undefined );
                    
        if (ExperienceIs && (ExperienceIs.embed || ExperienceIs.pinboard || ExperienceIs.timeline)) {
            Source = document.referrer !== "" ? document.referrer : document.location.href;
        }
        else {
            Source = document.location.href;
        }

        return Source;
    }


	if( typeof SCRIBBLE !== 'undefined' ) {
		SCRIBBLE.utilities = {
			GetCookie: GetCookie,
			SetCookie: SetCookie,
			RemoveCookie: RemoveCookie,
			ToFriendlyNumber: ToFriendlyNumber,
			OuterHtmlAll: OuterHtmlAll,
			UrlToCorrectSecurityProtocol: UrlToCorrectSecurityProtocol,
			IsLocalhost: IsLocalhost,
			IsDev: IsDev,
			IsClient: IsClient,
			IsHttps: IsHttps,
			GetInsertPosition: GetInsertPosition,
			ReorderPinboard: ReorderPinboard,
			ReorderStream: ReorderStream,
            GetReferrer: GetReferrer
		};
	}

} ( (typeof jQuerySL !== 'undefined' ? jQuerySL : jQuery), window));


/* POLYFILL: .bind() polyfill for IE8 and below. */
if(!Function.prototype.bind) {
	Function.prototype.bind = function (oThis) {
		if (typeof this !== "function") {
			// closest thing possible to the ECMAScript 5 internal IsCallable function
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}

		var aArgs = Array.prototype.slice.call(arguments, 1), 
			fToBind = this, 
			fNOP = function () {},
			fBound = function () {
				return fToBind.apply(this instanceof fNOP && oThis
						? this
						: oThis,
				aArgs.concat(Array.prototype.slice.call(arguments)));
			};

		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();

		return fBound;
	};
}

/* POLYFILL: .indexOf() polyfill for IE8 and below. */
if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement /*, fromIndex */) {
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
        if (arguments.length > 0) {
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

/* POLYFILL: .every() polyfill for IE8 and below. */
if (!Array.prototype.every) {
  Array.prototype.every = function (callbackfn, thisArg) {
    "use strict";
    var T, k;

    if (this == null) {
      throw new TypeError("this is null or not defined");
    }    

    // 1. Let O be the result of calling ToObject passing the this 
    //    value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;
    
    // 4. If IsCallable(callbackfn) is false, throw a TypeError exception.
    if (typeof callbackfn !== "function") {
      throw new TypeError();
    }
    
    // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }
    
    // 6. Let k be 0.
    k = 0;
    
    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty internal 
      //    method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then      
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
        kValue = O[k];

        // ii. Let testResult be the result of calling the Call internal method 
        //     of callbackfn with T as the this value and argument list 
        //     containing kValue, k, and O.
        var testResult = callbackfn.call(T, kValue, k, O);

        // iii. If ToBoolean(testResult) is false, return false.
        if (!testResult) {
          return false;
        }
      }
      k++;
    }
    return true;
  };
}

/* POLYFILL: .trim() pollyfill for IE8 and below. */
if(typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    };
}

/* POLYFILL: prevent console.log from breaking old IE. */
if(!window.console) { console = { log: function() {} }; }


/* Use XDomainRequest for IE8 and IE9 */
var root = this;
(function( jQuery ) {

if ( root.XDomainRequest ) {
  jQuery.ajaxTransport(function( s ) {
    if ( s.crossDomain && s.async ) {
      if ( s.timeout ) {
        s.xdrTimeout = s.timeout;
        delete s.timeout;
      }
      var xdr;
      return {
        send: function( _, complete ) {
          function callback( status, statusText, responses, responseHeaders ) {
            xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
            xdr = undefined;
            complete( status, statusText, responses, responseHeaders );
          }
          xdr = new XDomainRequest();

          if(s.dataType){
              var headerThroughUriParameters = "header_Accept=" + encodeURIComponent(s.dataType);
              s.url = s.url + (s.url.indexOf("?") === -1 ? "?" : "&" ) + headerThroughUriParameters;
          }
          xdr.open( s.type, s.url );
          xdr.onload = function(e1, e2) {
            callback( 200, "OK", { text: xdr.responseText }, "Content-Type: " + xdr.contentType );
          };

          xdr.onerror = function(e) {
              console.error(JSON.stringify(e));
            callback( 404, "Not Found" );
          };
          if ( s.xdrTimeout ) {
            xdr.ontimeout = function() {
              callback( 0, "timeout" );
            };
            xdr.timeout = s.xdrTimeout;
          }
          xdr.send( ( s.hasContent && s.data ) || null );
        },
        abort: function() {
          if ( xdr ) {
            xdr.onerror = jQuery.noop();
            xdr.abort();
          }
        }
      };
    }
  });
}
})( (typeof jQuerySL !== 'undefined' ? jQuerySL : jQuery));
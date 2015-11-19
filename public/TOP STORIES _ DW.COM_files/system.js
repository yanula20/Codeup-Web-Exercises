
var jQuerySL = jQuery.noConflict(true);
	
	
if (typeof SCRIBBLE === 'undefined' || !SCRIBBLE) {
	/**
	* The SCRIBBLE global namespace object.  If SCRIBBLE is already defined, the
	* existing SCRIBBLE object will not be overwritten so that defined
	* namespaces are preserved.
	* @class SCRIBBLE
	* @static
	*/
	var SCRIBBLE = {};
}

/**
* Returns the namespace specified and creates it if it doesn't exist
* <pre>
* SCRIBBLE.namespace("property.package");
* SCRIBBLE.namespace("SCRIBBLE.property.package");
* </pre>
* Either of the above would create SCRIBBLE.property, then
* SCRIBBLE.property.package
*
* Be careful when naming packages. Reserved words may work in some browsers
* and not others. For instance, the following will fail in Safari:
* <pre>
* SCRIBBLE.namespace("really.long.nested.namespace");
* </pre>
* This fails because "long" is a future reserved word in ECMAScript
*
* @method namespace
* @static
* @param  {String*} arguments 1-n namespaces to create
* @return {Object}  A reference to the last namespace object created
*/
SCRIBBLE.namespace = function () {
	var a = arguments, o = null, i, j, d;
	for (i = 0; i < a.length; i = i + 1) {
		d = a[i].split(".");
		o = SCRIBBLE;
		for (j = 0; j < d.length; j = j + 1) {
			o[d[j]] = o[d[j]] || {};
			o = o[d[j]];
		}
	}
	return o;
};


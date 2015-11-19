/*!
 * Responsive JS Plugins v1.2.2
 */
// Placeholder
jQuery(function(){
    jQuery('input[placeholder], textarea[placeholder]').placeholder();
});
// FitVids
jQuery(document).ready(function(){
// Target your #container, #wrapper etc.
    jQuery("#wrapper").fitVids();
});

// Have a custom video player? We now have a customSelector option where you can add your own specific video vendor selector (mileage may vary depending on vendor and fluidity of player):
// jQuery("#thing-with-videos").fitVids({ customSelector: "iframe[src^='http://example.com'], iframe[src^='http://example.org']"});
// Selectors are comma separated, just like CSS
// Note: This will be the quickest way to add your own custom vendor as well as test your player's compatibility with FitVids.

// Responsive Menu (TinyNav)
jQuery(".menu").tinyNav({
	active: 'current_page_item', // Set the "active" class for default menu
	label: '', // String: Sets the <label> text for the <select> (if not set, no label will be added)
    header: '' // String: Specify text for "header" and show header instead of the active item
});

// Responsive Menu (Selectbox)
jQuery(function () {
    jQuery(".tinynav").selectbox();
});

//images loaded
(function (c, q) {
    var m = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="; c.fn.imagesLoaded = function (f) {
        function n() { var b = c(j), a = c(h); d && (h.length ? d.reject(e, b, a) : d.resolve(e)); c.isFunction(f) && f.call(g, e, b, a) } function p(b) { k(b.target, "error" === b.type) } function k(b, a) {
            b.src === m || -1 !== c.inArray(b, l) || (l.push(b), a ? h.push(b) : j.push(b), c.data(b, "imagesLoaded", { isBroken: a, src: b.src }), r && d.notifyWith(c(b), [a, e, c(j), c(h)]), e.length === l.length && (setTimeout(n), e.unbind(".imagesLoaded",
p)))
        } var g = this, d = c.isFunction(c.Deferred) ? c.Deferred() : 0, r = c.isFunction(d.notify), e = g.find("img").add(g.filter("img")), l = [], j = [], h = []; c.isPlainObject(f) && c.each(f, function (b, a) { if ("callback" === b) f = a; else if (d) d[b](a) }); e.length ? e.bind("load.imagesLoaded error.imagesLoaded", p).each(function (b, a) { var d = a.src, e = c.data(a, "imagesLoaded"); if (e && e.src === d) k(a, e.isBroken); else if (a.complete && a.naturalWidth !== q) k(a, 0 === a.naturalWidth || 0 === a.naturalHeight); else if (a.readyState || a.complete) a.src = m, a.src = d }) :
n(); return d ? d.promise(g) : g
    } 
})(jQuery);
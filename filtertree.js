// Copyright (c) 2011, Kevin Mahoney

(function ($) {

    var find_str = function (str, node) {
        // IE <9 doesn't have textContent, and text nodes don't have
        // innerText, so fall back to nodeValue.
        var text = node.textContent || node.innerText || node.nodeValue;
        return text && text.toLowerCase().indexOf(str) >= 0;
    };

    var update = function (str, root) {
        // use a closure to build show/hide lists and actually
        // show/hide them in batch.

        var show_list = [];
        var hide_list = [];

        var toggle = function(node, show) {
            if (show) {
                show_list.push(node);
            } else {
                hide_list.push(node);
            }
        };

        var update_li = function (node) {
            var children = node.childNodes;
            var childMatch = false;
            for (var i = 0, l = children.length; i < l; i++) {
                var child = children[i];
                if (child.tagName == "UL") {
                    if (update_ul(child)) childMatch = true;
                } else {
                    // LI child that is not a UL - check for match
                    if (find_str(str, child)) childMatch = true;
                }
            }
            toggle(node, childMatch);
            return childMatch;
        };

        var update_ul = function (node) {
            var children = node.childNodes;
            var childMatch = false;
            for (var i = 0, l = children.length; i < l; i++) {
                var child = children[i];
                if (child.tagName == "LI" && update_li(child)) childMatch = true;
            }
            toggle(node, childMatch);
            return childMatch;
        };

        update_ul(root);
        $(show_list).show();
        $(hide_list).hide();
    };

    $.fn.filtertree = function (root_selector) {
        var inp = this;
        var root = $(root_selector).get(0);
        inp.bind("keyup", function () {
            update(inp.val().toLowerCase(), root);
        })
    };

})(jQuery);

Template.toolbar.events({
    'click a#sidebar-toggle': function (e, t) {
        if ($("aside#sidebar").is(":visible")) {
            $("aside#sidebar").addClass("hidden-xs hidden-sm");
        } else {
            $("aside#sidebar").removeClass("hidden-xs hidden-sm");
        }
    }
});

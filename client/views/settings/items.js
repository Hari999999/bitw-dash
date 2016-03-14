Template.items.onCreated(function () {
    this.pagination = new Meteor.Pagination(Items, {
        sort: {
            name: 1
        }
    });
});

Template.items.onRendered(function () {
    $.material.init();
    Session.set("itemSearchAttr", $("table thead td.active").data("search-name"));
});

Template.items.helpers({
    templatePagination: function () {
        return Template.instance().pagination;
    },
    items: function () {
        if (Session.get("itemSearchAttr") && Session.get("itemSearchValue")) {
            var searchFilter = {};
            var searchObject;

            searchObject = {
                $regex: Session.get("itemSearchValue"), $options: 'i'
            };
            searchFilter[Session.get("itemSearchAttr")] = searchObject;

            Template.instance().pagination.filters(searchFilter);
        } else {
            Template.instance().pagination.filters({});
        }
        return Template.instance().pagination.getPage();
    },
    selectedItem: function () {
        return Session.equals("selectedItemId", this._id) ? "active" : "";
    },
    canEditItem: function () {
        return Session.get("selectedItemId") ? "" : "disabled";
    },
    statusIcon: function () {
        var item = Items.findOne({_id: Session.get("selectedItemId")});
        return item && item.isActive ? "fa-minus-circle" : "fa-check-circle";
    },
    changeStatusText: function () {
        var item = Items.findOne({_id: Session.get("selectedItemId")});
        return item && item.isActive ? "Deactivate" : "Activate";
    },
    activationState: function () {
        return this.isActive ? "" : "inactive";
    },
    price: function () {
        return this.currentPrice();
    }
});

Template.items.events({
    "click table#items-list tr": function (e, t) {
        Session.equals("selectedItemId", this._id) ?
            Session.set("selectedItemId", null) : Session.set("selectedItemId", this._id);
    },
    "submit #new-item-form": function (e, t) {
        e.preventDefault();

        var itemDoc = {
            _id: null,
            name: t.find("#new-item-name").value,
            description: t.find("#new-item-description").value,
            prices: [
                {
                    price: t.find("#new-item-price").value,
                    effectiveDate: new Date()
                }
            ]
        };

        this.item.set(itemDoc);
        var newItem = new Item(itemDoc);

        if (this.item.validate()) {
            newItem.save();
            t.find("form").reset();
            toastr.success("Item successfully created!");
        }

        // Prevent form reload
        return false;
    },
    "click button.btn-clear": function (e, t) {
        t.find("#new-item-form").reset();
    },
    "click a#change-item-status": function (e, t) {
        var item = Items.findOne({_id: Session.get("selectedItemId")});
        if (item) {
            Items.update({_id: item._id}, {$set: {isActive: !item.isActive}});
        }
    },
    "click table#items-list thead td": function (e, t) {
        if (!$(e.target).hasClass("disabled")) {
            t.$("table thead td.active").removeClass("active");
            t.$(e.target).addClass("active");

            Session.set("itemSearchAttr", $(e.target).data("search-name"));
        }
    },
    "keyup input#search-items": function (e, t) {
        $("#search-items-form").trigger("submit");
    },
    "submit #search-items-form": function (e, t) {
        e.preventDefault();

        var searchTerm = t.find("#search-items").value;
        if (searchTerm) {
            Session.set("itemSearchValue", searchTerm);
        } else {
            Session.set("itemSearchValue", null);
        }
        return false;
    },
    "change #item-search-field": function (e, t) {
        var selectedOption = t.$(e.target).val();
        Session.set("itemSearchAttr", selectedOption);
    }
});
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
            price: parseFloat(t.find("#new-item-price").value)
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
        item.set({ isActive: !item.isActive });
        Meteor.call("updateItem", item);
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

Template.editItemModal.onRendered(function () {
    $.material.init();
});

Template.editItemModal.helpers({
    selectedItem: function () {
        return Items.findOne({_id: Session.get("selectedItemId")});
    }
});

Template.editItemModal.events({
    "submit #edit-item-modal form": function (e, t) {
        e.preventDefault();

        var selectedItemId = Session.get("selectedItemId");

        if (selectedItemId) {

            var itemDoc = {
                _id: selectedItemId,
                name: t.find("#edit-item-name").value,
                description: t.find("#edit-item-description").value,
                price: parseFloat(t.find("#edit-item-price").value)
            };

            this.selectedItem = Items.findOne({_id: selectedItemId});

            this.selectedItem.set(itemDoc);

            if (this.selectedItem.validate()) {
                Meteor.call("updateItem", this.selectedItem, function (err) {
                    if (err) throw err;

                    $("#edit-item-modal").modal('hide');
                    toastr.success("Item successfully edited!");
                });
            }
        }

        // Prevent form reload
        return false;
    }
});

Template.deleteItemModal.helpers({
    "selectedItem": function () {
        return Items.findOne({_id: Session.get("selectedItemId")});
    }
});

Template.deleteItemModal.events({
    "submit #delete-item-modal form": function (e, t) {
        e.preventDefault();

        var selectedItem = Items.findOne({_id: Session.get("selectedItemId")});

        if (selectedItem) {

            Meteor.call("deleteItem", selectedItem, function (err) {
                if (err) throw err;

                $("#delete-item-modal").modal('hide');

                Session.set("selectedItemId", null);

                toastr.success("Item successfully removed!");
            });
        }

        // Prevent form reload
        return false;
    }
});

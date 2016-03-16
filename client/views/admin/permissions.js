Template.permissionsSearch.onRendered(function(){
    Session.set("permissionSearchAttr", $("table#permissions-list thead td.active").data("search-name"));
});

Template.permissionsSearch.events({
    "keyup input#search-permissions": function (e, t) {
        $("#search-permissions-form").trigger("submit");
    },
    "submit #search-permissions-form": function (e, t) {
        e.preventDefault();

        var searchTerm = t.find("#search-permissions").value;
        if (searchTerm) {
            Session.set("permissionSearchValue", searchTerm);
        } else {
            Session.set("permissionSearchValue", null);
        }

        return false;
    },
    "change #permission-search-field": function (e, t) {
        var selectedOption = t.$(e.target).val();
        Session.set("permissionSearchAttr", selectedOption);
    }
});

Template.newPermission.events({
    "submit #new-permission-form": function (e, t) {
        e.preventDefault();

        var permissionDoc = {
            module: t.find("#new-permission-module").value,
            operation: t.find("#new-permission-operation").value != "empty" ? t.find("#new-permission-operation").value : ""
        };

        this.permission.set(permissionDoc);
        var newPermission = new Permission(permissionDoc);

        if (this.permission.validate()) {
            newPermission.save();
            t.find("form").reset();
            toastr.success("Permission successfully created!");
        } else {
            toastr.error(getErrorMessage(this.permission.getValidationErrors()));
        }

        return false;
    }
});

Template.permissions.onCreated(function () {
    this.pagination = new Meteor.Pagination(Permissions, {
        sort: {
            name: 1
        }
    });
});

Template.permissions.helpers({
    templatePagination: function () {
        return Template.instance().pagination;
    },
    permissions: function () {
        if (Session.get("permissionSearchAttr") && Session.get("permissionSearchValue")) {
            var searchFilter = {};
            var searchObject = {
                $regex: Session.get("permissionSearchValue"),
                $options: 'i'
            };
            searchFilter[Session.get("permissionSearchAttr")] = searchObject;
            Template.instance().pagination.filters(searchFilter);
        } else {
            Template.instance().pagination.filters({});
        }
        return Template.instance().pagination.getPage();
    }
});

Template.permissions.events({
    "click table#permissions-list tr": function (e, t) {
        Session.equals("selectedPermissionId", this._id) ?
            Session.set("selectedPermissionId", null) : Session.set("selectedPermissionId", this._id);
    },
    "click table#permissions-list thead td": function (e, t) {
        if (!$(e.target).hasClass("disabled")) {
            t.$("table thead td.active").removeClass("active");
            t.$(e.target).addClass("active");

            Session.set("permissionSearchAttr", $(e.target).data("search-name"));
        }
    }
});

Template.permission.onRendered(function () {
    $.material.init();
});

Template.permission.helpers({
    selectedPermission: function () {
        return Session.equals("selectedPermissionId", this._id) ? "active" : "";
    }
});

Template.editPermissionModal.helpers({
    operationEquals: function (operationName) {
        return this.operation == operationName ? "selected" : "";
    },
    selectedPermission: function () {
        return Permissions.findOne({_id: Session.get("selectedPermissionId")});
    }
});

Template.editPermissionModal.events({
    "submit #edit-permission-modal form": function (e, t) {
        e.preventDefault();

        var selectedPermissionId = Session.get("selectedPermissionId");

        if (selectedPermissionId) {
            var permissionDoc = {
                module: t.find("#edit-permission-module").value,
                operation: t.find("#edit-permission-operation").value != "empty" ? t.find("#edit-permission-operation").value : ""
            };

            this.selectedPermission = Permissions.findOne({_id: selectedPermissionId});
            this.selectedPermission.set(permissionDoc);

            if (this.selectedPermission.validate()) {
                Meteor.call("updatePermission", this.selectedPermission, function(err){
                    if(err) throw err;

                    $("#edit-permission-modal").modal('hide');
                    t.find("form").reset();
                    toastr.success("Permission successfully updated!");
                });
            } else {
                toastr.error(getErrorMessage(this.selectedPermission.getValidationErrors()));
            }
        }
    }
});

Template.deletePermissionModal.helpers({
    selectedPermission: function () {
        return Permissions.findOne({_id: Session.get("selectedPermissionId")});
    }
});

Template.deletePermissionModal.events({
    "submit #delete-permission-modal form": function (e, t) {
        e.preventDefault();

        var selectedPermissionId = Session.get("selectedPermissionId");

        if (selectedPermissionId) {
            this.selectedPermission = Permissions.findOne({_id: selectedPermissionId});

            Meteor.call("deletePermission", this.selectedPermission, function(err){
                if(err) throw err;

                $("#delete-permission-modal").modal('hide');
                toastr.success("Permission successfully deleted!");
            });
        }
    }
});
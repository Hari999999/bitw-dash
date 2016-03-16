Template.rolesSearch.onRendered(function(){
    Session.set("roleSearchAttr", $("table#roles-list thead td.active").data("search-name"));
});

Template.rolesSearch.events({
    "keyup input#search-roles": function (e, t) {
        $("#search-roles-form").trigger("submit");
    },
    "submit #search-roles-form": function (e, t) {
        e.preventDefault();

        var searchTerm = t.find("#search-roles").value;
        if (searchTerm) {
            Session.set("roleSearchValue", searchTerm);
        } else {
            Session.set("roleSearchValue", null);
        }

        return false;
    },
    "change #role-search-field": function (e, t) {
        var selectedOption = t.$(e.target).val();
        Session.set("roleSearchAttr", selectedOption);
    }
});

Template.newRole.events({
    "submit #new-role-form": function (e, t) {
        e.preventDefault();

        var roleDoc = {
            name: t.find("#new-role-name").value
        };

        this.role.set(roleDoc);
        var newRole = new Role(roleDoc);

        if (this.role.validate()) {
            newRole.save();
            t.find("form").reset();
            toastr.success("Role successfully created!");
        } else {
            toastr.error(getErrorMessage(this.role.getValidationErrors()));
        }

        return false;
    }
});

Template.roles.onCreated(function () {
    this.pagination = new Meteor.Pagination(Roles, {
        sort: {
            name: 1
        }
    });
});

Template.roles.helpers({
    templatePagination: function () {
        return Template.instance().pagination;
    },
    roles: function () {
        if (Session.get("roleSearchAttr") && Session.get("roleSearchValue")) {
            var searchFilter = {};
            var searchObject = {
                $regex: Session.get("roleSearchValue"), $options: 'i'
            };
            searchFilter[Session.get("roleSearchAttr")] = searchObject;
            Template.instance().pagination.filters(searchFilter);
        } else {
            Template.instance().pagination.filters({});
        }
        return Template.instance().pagination.getPage();
    }
});

Template.roles.events({
    "click table#roles-list tr": function (e, t) {
        Session.equals("selectedRoleId", this._id) ?
            Session.set("selectedRoleId", null) : Session.set("selectedRoleId", this._id);
    },
    "click table#roles-list thead td": function (e, t) {
        if (!$(e.target).hasClass("disabled")) {
            t.$("table thead td.active").removeClass("active");
            t.$(e.target).addClass("active");

            Session.set("roleSearchAttr", $(e.target).data("search-name"));
        }
    }
});

Template.role.onRendered(function () {
    $.material.init();
});

Template.role.helpers({
    numberOfUsers: function (roleId) {
        return Meteor.users.find({"profile.roleId": roleId}).count();
    },
    selectedRole: function () {
        return Session.equals("selectedRoleId", this._id) ? "active" : "";
    }
});

Template.editRoleModal.helpers({
    selectedRole: function () {
        return Roles.findOne({_id: Session.get("selectedRoleId")});
    },
    availablePermissions: function () {
        return Permissions.find({_id: {$nin: this.permissions}});
    },
    hasPermissions: function () {
        return this.permissions ? true : false;
    },
    rolePermissions: function () {
        return Permissions.find({_id: {$in: this.permissions}});
    }
});

Template.editRoleModal.events({
    "click #add-permission-button": function (e, t) {
        e.preventDefault();

        // Get selected permission
        var selectedPermissionId = t.find("#available-permission").value;
        if (selectedPermissionId) {
            var selectedRoleId = Session.get("selectedRoleId");

            if (selectedRoleId) {
                Meteor.call("addPermission", selectedRoleId, selectedPermissionId, function(err){
                    if(err) throw err;

                    toastr.success("Permission added to Role!");
                });
            }
        }
    },
    "click .remove-permission": function (e, t) {
        e.preventDefault();

        // Get selected role
        var selectedRoleId = Session.get("selectedRoleId");
        if (selectedRoleId) {
            Meteor.call("removePermission", selectedRoleId, this._id, function(err){
                if(err) throw err;

                toastr.success("Permission removed from Role!");
            });
        }
    },
    "submit #edit-role-modal form": function (e, t) {
        e.preventDefault();

        var selectedRoleId = Session.get("selectedRoleId");

        if (selectedRoleId) {

            var roleDoc = {
                name: t.find("#edit-role-name").value
            };

            this.selectedRole = Roles.findOne({_id: selectedRoleId});

            this.selectedRole.set(roleDoc);

            if (this.selectedRole.validate()) {
                Meteor.call("updateRole", this.selectedRole, function(err){
                    if(err) throw err;

                    $("#edit-role-modal").modal('hide');
                    t.find("form").reset();
                    toastr.success("Role successfully updated!");
                });
            } else {
                toastr.error(getErrorMessage(this.selectedRole.getValidationErrors()));
            }

        }
    }
});

Template.deleteRoleModal.helpers({
    selectedRole: function () {
        return Roles.findOne({_id: Session.get("selectedRoleId")});
    }
});

Template.deleteRoleModal.events({
    "submit #delete-role-modal": function (e, t) {
        e.preventDefault();

        var selectedRoleId = Session.get("selectedRoleId");

        if (selectedRoleId) {
            this.selectedRole = Roles.findOne({_id: selectedRoleId});

            Meteor.call("deleteRole", this.selectedRole, function(err){
                if(err) throw err;

                $("#delete-role-modal").modal('hide');
                toastr.success("Role successfully deleted!");
            });
        }
    }
});

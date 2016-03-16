Template.usersSearch.onRendered(function(){
    Session.set("userSearchAttr", $("table#users-list thead td.active").data("search-name"));
});

Template.usersSearch.events({
    "keyup input#search-users": function (e, t) {
        $("#search-users-form").trigger("submit");
    },
    "submit #search-users-form": function(e, t){
        e.preventDefault();

        var searchTerm = t.find("#search-users").value;
        if(searchTerm){
            Session.set("userSearchValue", searchTerm);
        } else {
            Session.set("userSearchValue", null);
        }

        return false;
    },
    "change #user-search-field": function(e, t){
        var selectedOption = t.$(e.target).val();
        Session.set("userSearchAttr", selectedOption);
    }
});

Template.newUser.onRendered(function(){
    $.material.init();
});

Template.newUser.helpers({
    userRoles: function () {
        return Roles.find();
    }
});

Template.newUser.events({
    "submit #new-user-form": function (e, t) {
        e.preventDefault();

        // New user document
        var userDoc = {
            username: t.find("#new-user-username").value,
            password: t.find("#new-user-password").value,
            profile: {
                roleId: t.find("#new-user-role").value != "empty" ? t.find("#new-user-role").value : ""
            }
        };

        this.user.set(userDoc);

        if (this.user.validate()) {
            Meteor.call('addNewUser', userDoc, function (err) {
                if (err) {
                    Session.set("errorMessage", err.reason);
                } else {
                    $("#new-user-modal").modal('hide');
                    // Send notification to Admin(s)
                    Notify.admin("New User Created", "A new user has been created!");
                    t.find("form").reset();
                    toastr.success("User successfully created!");
                }
            });
        }

        // Prevent form reload
        return false;
    },
    "click button.btn-clear": function (e, t) {
        t.find("#new-user-form").reset();
    }
});

Template.users.onCreated(function () {
    this.pagination = new Meteor.Pagination(Meteor.users, {
        sort: {
            username: 1
        }
    });
});

Template.users.helpers({
    templatePagination: function () {
        return Template.instance().pagination;
    },
    users: function () {
        if (Session.get("userSearchAttr") && Session.get("userSearchValue")) {
            var searchFilter = {};
            var searchObject = {
                $regex: Session.get("userSearchValue"), $options: 'i'
            };
            searchFilter[Session.get("userSearchAttr")] = searchObject;
            Template.instance().pagination.filters(searchFilter);
        } else {
            Template.instance().pagination.filters({});
        }
        return Template.instance().pagination.getPage();
    },
    canEditUser: function () {
        return Session.get("selectedUserId") ? "" : "disabled";
    }
});

Template.users.events({
    "click table#users-list tr": function (e, t) {
        Session.equals("selectedUserId", this._id) ?
            Session.set("selectedUserId", null) : Session.set("selectedUserId", this._id);
    },
    "click table#users-list thead td": function (e, t) {
        var index = $(event.target).index() + 1;

        t.$("table thead td.active").removeClass("active");
        t.$("table thead td:nth-child(" + index + ")").addClass("active");

        Session.set("userSearchAttr", $(event.target).data("search-name"));
    }
});

Template.user.helpers({
    selectedUser: function () {
        return Session.equals("selectedUserId", this._id) ? "active" : "";
    },
    userRole: function () {
        return this.role() ? this.role().name : "";
    }
});

Template.editUserModal.helpers({
    userRoles: function () {
        return Roles.find();
    },
    selectedRole: function (roleId) {
        return Template.parentData(1).profile.roleId == roleId ? "selected" : "";
    },
    selectedUser: function () {
        this.selectedUser = Meteor.users.findOne({_id: Session.get("selectedUserId")});
        return this.selectedUser;
    }
});

Template.editUserModal.events({
    "submit #edit-user-modal form": function (e, t) {
        e.preventDefault();

        // Edit user document
        var userDoc = {
            profile: {
                roleId: t.find("#edit-user-role").value != "empty" ? t.find("#edit-user-role").value : ""
            }
        };

        var selectedUserId = Session.get("selectedUserId");

        if (selectedUserId) {

            this.selectedUser = Meteor.users.findOne({_id: selectedUserId});

            this.selectedUser.set(userDoc);

            // TODO: Remove this hack added for the validation to pass
            this.selectedUser.set({password: "P@ssw0rd!"});

            if (this.selectedUser.validate()) {
                // Update the selected user
                Meteor.call("updateUser", this.selectedUser, function(err){
                    if (err) {
                        Session.set("errorMessage", err.reason);
                    } else {
                        Session.set("selectedUserId", null);
                        $("#edit-user-modal").modal('hide');
                    }
                });
            }
        }

        // Prevent form reload
        return false;
    }
});

Template.deleteUserModal.helpers({
    selectedUser: function () {
        return Meteor.users.findOne({_id: Session.get("selectedUserId")});
    }
});

Template.deleteUserModal.events({
    "submit #delete-user-modal form": function (e, t) {
        e.preventDefault();

        var selectedUserId = Session.get("selectedUserId");

        if (selectedUserId) {
            this.selectedUser = Meteor.users.findOne({_id: selectedUserId});

            Meteor.call("deleteUser", this.selectedUser, function (err) {
                if (err) {
                    toastr.error(err.reason);
                } else {
                    $("#delete-user-modal").modal('hide');
                    Session.set("selectedUserId", null);
                    toastr.success("User successfully deleted!");
                }
            });
        }

        // Prevent form reload
        return false;
    }
});

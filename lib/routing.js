Router.configure({
    layoutTemplate: "layout",
    loadingTemplate: "loading"
});

Router.route("/", {
    name: "dashboard",
    action: function () {
        if (this.ready()) {
            // Display Login form is no user is logged in
            if (!Meteor.userId()) {
                Router.go("/sign-in");
            } else {
                this.render("dashboard");
            }
        }
    }
});

Router.route("/daily-sales", {
    name: "dailySales",
    action: function () {
        if (this.ready()) {
            // Display Login form is no user is logged in
            if (!Meteor.userId()) {
                Router.go("/sign-in");
            } else {
                this.render("dailySales");
            }
        }
    }
});

Router.route("/sign-in", {
    name: "signIn",
    action: function () {
        this.layout("layoutAnonymous");
        if (this.ready()) {
            // Render login form if no user is logged in
            if (!Meteor.userId()) {
                this.render("signIn");
            } else {
                Router.go("/");
            }
        }
    }
});

Router.route("/administer/users", {
    name: "userAdministration",
    action: function () {
        if (this.ready()) {
            // Render login form if no user is logged in
            if (!Meteor.userId()) {
                Router.go("/sign-in");
            } else {
                this.render("users");
            }
        }
    },
    data: function () {
        return {
            user: new User(),
            selectedUser: new User()
        };
    }
});

Router.route("/administer/roles-and-permissions", {
    name: "rolesAndPermissionsAdministration",
    action: function () {
        if (this.ready()) {
            // Render login form if no user is logged in
            if (!Meteor.userId()) {
                Router.go("/sign_in");
            } else {
                this.render("rolesAndPermissions");
            }
        }
    },
    data: function () {
        return {
            role: new Role(),
            selectedRole: new Role(),
            permission: new Permission(),
            selectedPermission: new Permission()
        };
    }
});

Router.route("/settings/sales-team", {
    name: "salesTeam",
    action: function () {
        if (this.ready()) {
            // Render login form if no user is logged in
            if (!Meteor.userId()) {
                Router.go("/sign-in");
            } else {
                this.render("salesTeam");
            }
        }
    },
    data: function () {
        return {
            salesperson: new Salesperson(),
            selectedSalesperson: new Salesperson()
        };
    }
});

Router.route("/settings/items", {
    name: "items",
    action: function () {
        if (this.ready()) {
            // Render login form if no user is logged in
            if (!Meteor.userId()) {
                Router.go("/sign-in");
            } else {
                this.render("items");
            }
        }
    },
    data: function () {
        return {
            item: new Item(),
            selectedItem: new Item()
        };
    }
});

Router.route("/notifications", {
    name: "notifications",
    action: function () {
        if (this.ready()) {
            // Render login form if no user is logged in
            if (!Meteor.userId()) {
                Router.go("/sign-in");
            } else {
                this.render("notificationsList");
            }
        }
    }
});

Router.route("/notification/:_id", {
    name: "notification",
    action: function () {
        if (this.ready()) {
            // Render login form if no user is logged in
            if (!Meteor.userId()) {
                Router.go("/sign-in");
            } else {
                Notifications.update({_id: this.params._id}, {$set: {isRead: true}});
                this.render("viewNotification");
            }
        }
    },
    data: function () {
        return {
            notification: Notifications.findOne({_id: this.params._id})
        };
    }
});

Router.route("/reports/daily-sales", {
    name: "dailySalesReport",
    action: function () {
        if (this.ready()) {
            // Display Login form is no user is logged in
            if (!Meteor.userId()) {
                Router.go("/sign-in");
            } else {
                this.render("dailySalesReport");
            }
        }
    }
});

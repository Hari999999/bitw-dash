Meteor.methods({
    "addNewUser": function (userDoc) {
        userDoc.profile.isSuper = false;
        // If valid input provided, create user and return userId
        Accounts.createUser(userDoc);
    },
    "updateUser": function (userObj) {
        userObj.save();
    },
    "deleteUser": function (userObj) {
        if(!userObj.profile.isSuper){
            userObj.remove();
        } else {
            throw new Meteor.Error("delete-super-error", "Cannot delete the super administrator account!");
        }
    },
    "checkIfEmailExists": function (email) {
        var count = Meteor.users.find({
            emails: {$elemMatch: {address: email}}
        }).count();

        if (count <= 0) {
            throw new Meteor.Error("No Email Found", "The email you provided does not belong to an exist account.");
        }
    },
    "sendPasswordRecoveryEmail": function (email) {
        // Find the user of with that email
        var user = Meteor.users.findOne({
            emails: {
                $elemMatch: {address: email}
            }
        });

        // Generate the link to the recovery page
        var recoveryUrl = Meteor.absoluteUrl("recover_password/" + user._id);

        // Allow the client to continue without waiting
        this.unblock();

        // Send the email
        Email.send({
            to: email,
            from: "noreply@onepageaccounting.com",
            subject: "One Page Accounting Support",
            html: "<h3>One Page Accounting - Password Recovery</h3>" +
            "<p>Dear Customer,</p>" +
            "<p>Please use the link provided below to recover your password.</p>" +
            "<a href='" + recoveryUrl + "'>Recover Your Password</a>"
        });
    },
    "sendEmailVerificationMessage": function () {
        Accounts.sendVerificationEmail(Meteor.userId());
    },
    "changeNewPassword": function (userId, password) {
        Accounts.setPassword(userId, password, {
            logout: false
        });
    }
});

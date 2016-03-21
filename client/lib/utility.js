trimInput = function (val) {
    return val.replace(/^\s*|\s*$/g, "");
};

cleanOutput = function (val) {
    if (val == undefined) {
        val = "false";
    }
    return val;
};

checkEmail = Match.Where(function (email) {
    check(email, String);
    return email.match(/^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/);
});

nonEmptyString = Match.Where(function (x) {
    check(x, String);
    return x.length > 0;
});

securePassword = Match.Where(function (password) {
    check(password, nonEmptyString);
    return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,14}/);
});

passwordLowercase = Match.Where(function (password) {
    check(password, nonEmptyString);
    return password.match(/^(?=.*[a-z])/);
});

passwordUppercase = Match.Where(function (password) {
    check(password, nonEmptyString);
    return password.match(/^(?=.*[A-Z])/);
});

passwordNumber = Match.Where(function (password) {
    check(password, nonEmptyString);
    return password.match(/^(?=.*\d)/);
});

passwordSpecialCharacter = Match.Where(function (password) {
    check(password, nonEmptyString);
    return password.match(/^(?=.*[$@$!%*?&])/);
});

passwordMinLength = Match.Where(function (password) {
    check(password, nonEmptyString);
    return password.length > 8;
});

passwordMaxLength = Match.Where(function (password) {
    check(password, nonEmptyString);
    return password.length < 14;
});

getErrorMessage = function (errorObject) {
    var message = "";
    for (var key in errorObject) {
        if (errorObject.hasOwnProperty(key)) {
            message += errorObject[key] + "</br>";
        }
    }
    return message;
};

Notify = {
    user: function (title, detail, receiverId) {
        // Send notification to User
        var notification = new Notification({
            receiverId: receiverId,
            title: title,
            detail: detail,
            isRead: false
        });
        notification.save();
    },
    admin: function (title, detail) {
        // Send notification to Admin(s)
        var notification = new Notification({
            title: title,
            detail: detail,
            isRead: false
        });
        notification.sendToAdmin();
    }
};

// Template Helpers
Template.registerHelper("selectedDate", function () {
    return Session.get("selectedDate") ?
        moment(Session.get("selectedDate"), "DD-MM-YYYY").format("MMMM DD, YYYY") :
        moment().format("MMMM DD, YYYY");
});

Template.registerHelper("dailyTotalGoal", function () {
    var dailyTotal = clientTotalDailySales.findOne({
        transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
    });
    return dailyTotal ? dailyTotal.goal : 0;
});

Template.registerHelper("dailyTotalGoalRevenue", function () {
    var dailyTotal = clientTotalDailySales.findOne({
        transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
    });
    return dailyTotal ? accounting.formatMoney(dailyTotal.goalRevenue,"") : 0;
});

Template.registerHelper("dailyTotalSold", function () {
    var dailyTotal = clientTotalDailySales.findOne({
        transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
    });
    return dailyTotal ? dailyTotal.sold : 0;
});

Template.registerHelper("dailyTotalSoldRevenue", function () {
    var dailyTotal = clientTotalDailySales.findOne({
        transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
    });
    return dailyTotal ? accounting.formatMoney(dailyTotal.soldRevenue,"") : 0;
});
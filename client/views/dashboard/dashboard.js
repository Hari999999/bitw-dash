// Start and End of current day
todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);
todayEnd = new Date();
todayEnd.setHours(23, 59, 59, 999);

Template.dashboard.onRendered(function(){
   Session.set("selectedDate", ""); //moment().format("DD-MM-YYYY"));
});

Template.dashboard.helpers({
    selectedDate: function () {
        return Session.get("selectedDate") ?
            moment(Session.get("selectedDate"), "DD-MM-YYYY").format("MMMM DD, YYYY") :
            moment().format("MMMM DD, YYYY")
    },
    selectedDateGoal: function () {
        var dailyTotal = clientTotalDailySales.findOne({
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailyTotal ? accounting.formatMoney(dailyTotal.goalRevenue, "") : 0;
    },
    selectedDateSales: function () {
        var dailyTotal = clientTotalDailySales.findOne({
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailyTotal ? accounting.formatMoney(dailyTotal.soldRevenue, "") : 0;
    },
    achievementPercentage: function () {
        var dailyTotal = clientTotalDailySales.findOne({
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailyTotal ? parseInt((dailyTotal.soldRevenue/dailyTotal.goalRevenue)*100) : 0;
    },
    selectedDateSalesTeam: function () {
        return clientSalespersonTotalDailySales.find({
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        }).count();
    },
    selectedDateReturns: function () {
        var dailyTotal = clientTotalDailySales.findOne({
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailyTotal ? dailyTotal.goal - dailyTotal.sold : 0;
    }
});

Template.dailyPerformance.helpers({
    selectedDate: function () {
        return Session.get("selectedDate") ?
            moment(Session.get("selectedDate"), "DD-MM-YYYY").format("MMMM DD, YYYY") :
            moment().format("MMMM DD, YYYY")
    },
    hasPerformers: function(){
        return clientSalespersonTotalDailySales.find({
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        }).count() > 0;
    },
    topPerformers: function(){
        return clientSalespersonTotalDailySales.find({
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        }, {sort: {soldRevenue: -1}, limit: 5});
    },
    salespersonName: function(){
        return SalesTeam.findOne({_id: this.salespersonId}).fullName();
    },
    salespersonGoal: function(){
        return accounting.formatMoney(this.goalRevenue,"");
    },
    salespersonSold: function(){
        return accounting.formatMoney(this.soldRevenue,"");
    },
    salespersonPercentage: function(){
        var percentage = 0;
        if(this.soldRevenue && this.goalRevenue){
            percentage = parseInt((this.soldRevenue/this.goalRevenue) * 100);
        }
        return percentage;
    }
});



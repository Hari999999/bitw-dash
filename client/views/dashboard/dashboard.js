// Start and End of current day
todayStart = new Date();
todayStart.setHours(0, 0, 0, 0);
todayEnd = new Date();
todayEnd.setHours(23, 59, 59, 999);

Template.dashboard.helpers({
    todaysSales: function(){
        return "268,089";
    },
    todaysDrivers: function(){
        return 5;
    },
    todaysAdditionalSales: function(){
        return 12;
    },
    todaysReturns: function(){
        return 10;
    }
});

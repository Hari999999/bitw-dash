Template.dailySales.onCreated(function () {
    Session.set("selectedDate", moment().format("DD-MM-YYYY"));
});

Template.dailySales.onRendered(function () {
    $.material.init();
});

Template.dailySales.helpers({
    items: function () {
        return Items.find({}, {sort: {name: 1}});
    },
    salesTeam: function () {
        return SalesTeam.find({}, {sort: {firstName: 1}});
    },
    salesPersonName: function () {
        return this.fullName();
    }
});

Template.setSalesDate.onRendered(function () {
    Session.set("selectedDate", moment().format("DD-MM-YYYY"));

    this.$('.date-time-picker').datetimepicker({
        format: "DD-MM-YYYY"
    });

    this.$('.date-time-picker input').attr("placeholder", moment(Session.get("selectedDate"), "DD-MM-YYYY").format("DD-MM-YYYY"));
});

Template.setSalesDate.events({
    "focus input#set-sales-date": function (e, t) {
        Session.set("selectedDate", e.target.value);
    },
    "blur input#set-sales-date": function (e, t) {
        Session.set("selectedDate", e.target.value);
    },
    "submit form#set-sales-date-form": function (e, t) {

    }
});

Template.activeCells.onRendered(function(){
    $.material.init();
});

Template.activeCells.helpers({
    salesPersonId: function () {
        return Template.parentData(1)._id;
    },
    salesPersonData: function () {
        return Template.parentData(1).fullName();
    },
    goalForItem: function () {
        var dailySales = Sales.findOne({
            salespersonId: Template.parentData(1)._id,
            itemId: this._id,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailySales ? dailySales.goal : 0;
    },
    goalRevenueForItem: function () {
        var dailySales = Sales.findOne({
            salespersonId: Template.parentData(1)._id,
            itemId: this._id,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        var goal = dailySales ? dailySales.goal : 0;
        return accounting.formatMoney(goal * this.price,"");
    },
    soldItem: function () {
        var dailySales = Sales.findOne({
            salespersonId: Template.parentData(1)._id,
            itemId: this._id,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailySales ? dailySales.sold : 0;
    },
    soldItemRevenue: function () {
        var dailySales = Sales.findOne({
            salespersonId: Template.parentData(1)._id,
            itemId: this._id,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        var sold = dailySales ? dailySales.sold : 0;
        return accounting.formatMoney(sold * this.price,"");
    }
});

Template.activeCells.events({
    "blur td.daily-entry input.sold": function (e, t) {
        var salespersonId = t.$(e.target).data("salesperson-id");
        var salespersonName = t.$(e.target).data("salesperson-name");
        var itemId = t.$(e.target).data("item-id");
        var itemPrice = parseFloat(t.$(e.target).data("item-price"));
        var itemName = t.$(e.target).data("item-name");
        var goalSelector = 'input[data-salesperson-id="' + salespersonId + '"][data-item-id="' + itemId + '"][data-entry-type="goal"]';
        var goal = parseInt(t.$(goalSelector).val(), 10);
        var sold = parseInt(t.$(e.target).val(), 10);

        var salesDoc = {
            salespersonId: salespersonId,
            salespersonName: salespersonName,
            itemId: itemId,
            itemPrice: itemPrice,
            itemName: itemName,
            goal: goal,
            sold: sold,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        };

        Meteor.call("addOrUpdateSale", salesDoc, function(err){
            if(err){
                toastr.error(err.reason);
            }
        });
    }
});

Template.salespersonTotals.onRendered(function(){
    $.material.init();
});

Template.salespersonTotals.helpers({
    salespersonTotalGoal: function () {
        var salespersonId = this._id;
        var dailyTotal = clientSalespersonTotalDailySales.findOne({
            salespersonId: salespersonId,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailyTotal ? dailyTotal.goal : 0;
    },
    salespersonTotalGoalRevenue: function () {
        var salespersonId = this._id;
        var dailyTotal = clientSalespersonTotalDailySales.findOne({
            salespersonId: salespersonId,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailyTotal ? accounting.formatMoney(dailyTotal.goalRevenue,"")  : 0;
    },
    salespersonTotalSold: function () {
        var salespersonId = this._id;
        var dailyTotal = clientSalespersonTotalDailySales.findOne({
            salespersonId: salespersonId,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailyTotal ? dailyTotal.sold : 0;
    },
    salespersonTotalSoldRevenue: function () {
        var salespersonId = this._id;
        var dailyTotal = clientSalespersonTotalDailySales.findOne({
            salespersonId: salespersonId,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailyTotal ? accounting.formatMoney(dailyTotal.soldRevenue,"") : 0;
    }
});

Template.itemTotals.onRendered(function(){
    $.material.init();
});

Template.itemTotals.helpers({
    itemTotalGoal: function () {
        var itemId = this._id;
        var dailyTotal = clientItemTotalDailySales.findOne({
            itemId: itemId,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailyTotal ? dailyTotal.goal : 0;
    },
    itemTotalGoalRevenue: function () {
        var itemId = this._id;
        var dailyTotal = clientItemTotalDailySales.findOne({
            itemId: itemId,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailyTotal ? accounting.formatMoney(dailyTotal.goalRevenue,"") : 0;
    },
    itemTotalSold: function () {
        var itemId = this._id;
        var dailyTotal = clientItemTotalDailySales.findOne({
            itemId: itemId,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailyTotal ? dailyTotal.sold : 0;
    },
    itemTotalSoldRevenue: function () {
        var itemId = this._id;
        var dailyTotal = clientItemTotalDailySales.findOne({
            itemId: itemId,
            transactionDate: moment(Session.get("selectedDate"), "DD-MM-YYYY").toDate()
        });
        return dailyTotal ? accounting.formatMoney(dailyTotal.soldRevenue,"") : 0;
    }
});
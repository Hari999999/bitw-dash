Template.dailySales.onCreated(function () {
    Session.set("selectedDate", moment().format("DD-MM-YYYY"));
});

Template.dailySales.onRendered(function () {
    $.material.init();
});

Template.dailySales.helpers({
    selectedDate: function () {
        return Session.get("selectedDate") ?
            moment(Session.get("selectedDate"), "DD-MM-YYYY").format("MMMM DD, YYYY") :
            moment().format("MMMM DD, YYYY")
    },
    items: function () {
        return Items.find();
    },
    salesTeam: function () {
        return SalesTeam.find();
    },
    salesPersonName: function () {
        return this.fullName();
    },
    salesPersonId: function () {
        return Template.parentData(1)._id;
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
        return (goal * this.price).toFixed(2);
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
        return (sold * this.price).toFixed(2);
    },
    salespersonTotalGoal: function () {
        var salespersonId = this._id;
        return 0;
    },
    salespersonTotalGoalRevenue: function () {
        var salespersonId = this._id;
        return 0;
    },
    salespersonTotalSold: function () {
        var salespersonId = this._id;
        return 0;
    },
    salespersonTotalSoldRevenue: function () {
        var salespersonId = this._id;
        return 0;
    },
    itemTotalGoal: function () {
        var itemId = this._id;
        return 0;
    },
    itemTotalGoalRevenue: function () {
        var itemId = this._id;
        return 0;
    },
    itemTotalSold: function () {
        var itemId = this._id;
        return 0;
    },
    itemTotalSoldRevenue: function () {
        var itemId = this._id;
        return 0;
    },
    totalGoal: function () {
        return 0;
    },
    totalGoalRevenue: function () {
        return 0;
    },
    totalSold: function () {
        return 0;
    },
    totalSoldRevenue: function () {
        return 0;
    }
});

Template.dailySales.events({
    "blur td.daily-entry input.sold": function (e, t) {
        var salespersonId = t.$(e.target).data("salesperson-id");
        var itemId = t.$(e.target).data("item-id");
        var goalSelector = 'input[data-salesperson-id="' + salespersonId + '"][data-item-id="' + itemId + '"][data-entry-type="goal"]';
        var goal = t.$(goalSelector).val();
        var sold = t.$(e.target).val();

        var salesDoc = {
            salespersonId: salespersonId,
            itemId: itemId,
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

Template.setSalesDate.onRendered(function () {
    this.$('.date-time-picker').datetimepicker({
        format: "DD-MM-YYYY"
    });
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
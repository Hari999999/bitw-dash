new Meteor.Pagination(Meteor.users);
new Meteor.Pagination(Roles);
new Meteor.Pagination(Permissions);
new Meteor.Pagination(Notifications);
new Meteor.Pagination(SalesTeam);
new Meteor.Pagination(Items);

//new Meteor.Pagination(Sales);
Meteor.publish("sales", function(){
   return Sales.find();
});

// Aggregate Publications
Meteor.publish("salespersonTotalDailySales", function () {
    ReactiveAggregate(this, Sales,
        [
            {
                $group: {
                    _id: {salespersonId: "$salespersonId", transactionDate: "$transactionDate"},
                    customId: {
                        $first: "$_id"
                    },
                    salespersonName: {
                        $first: "$salespersonName"
                    },
                    goal: {$sum: "$goal"},
                    goalRevenue: {
                        $sum: {
                            $multiply: ["$goal", "$itemPrice"]
                        }
                    },
                    sold: {$sum: "$sold"},
                    soldRevenue: {
                        $sum: {
                            $multiply: ["$sold", "$itemPrice"]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: "$customId",
                    salespersonId: "$_id.salespersonId",
                    salespersonName: "$salespersonName",
                    transactionDate: "$_id.transactionDate",
                    goal: "$goal",
                    goalRevenue: "$goalRevenue",
                    sold: "$sold",
                    soldRevenue: "$soldRevenue"
                }
            }
        ],
        {clientCollection: 'clientSalespersonTotalDailySales'});
});

Meteor.publish("itemTotalDailySales", function () {
    ReactiveAggregate(this, Sales,
        [
            {
                $group: {
                    _id: {itemId: "$itemId", transactionDate: "$transactionDate"},
                    customId: {
                        $first: "$_id"
                    },
                    itemName: {
                        $first: "$itemName"
                    },
                    goal: {$sum: "$goal"},
                    goalRevenue: {
                        $sum: {
                            $multiply: ["$goal", "$itemPrice"]
                        }
                    },
                    sold: {$sum: "$sold"},
                    soldRevenue: {
                        $sum: {
                            $multiply: ["$sold", "$itemPrice"]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: "$customId",
                    itemId: "$_id.itemId",
                    itemName: "$itemName",
                    transactionDate: "$_id.transactionDate",
                    goal: "$goal",
                    goalRevenue: "$goalRevenue",
                    sold: "$sold",
                    soldRevenue: "$soldRevenue"
                }
            }
        ],
        {clientCollection: 'clientItemTotalDailySales'});
});

Meteor.publish("totalDailySales", function () {
    ReactiveAggregate(this, Sales,
        [
            {
                $group: {
                    _id: "$transactionDate",
                    customId: {
                        $first: "$_id"
                    },
                    goal: {$sum: "$goal"},
                    goalRevenue: {
                        $sum: {
                            $multiply: ["$goal", "$itemPrice"]
                        }
                    },
                    sold: {$sum: "$sold"},
                    soldRevenue: {
                        $sum: {
                            $multiply: ["$sold", "$itemPrice"]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: "$customId",
                    transactionDate: "$_id",
                    goal: "$goal",
                    goalRevenue: "$goalRevenue",
                    sold: "$sold",
                    soldRevenue: "$soldRevenue"
                }
            }
        ],
        {clientCollection: 'clientTotalDailySales'});
});
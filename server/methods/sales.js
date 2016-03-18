Meteor.methods({
    "addOrUpdateSale": function (saleDoc) {
        var sale = Sales.findOne({
            salespersonId: saleDoc.salespersonId,
            itemId: saleDoc.itemId,
            transactionDate: saleDoc.transactionDate
        });
        if (sale) {
            Sales.update({_id: sale._id}, {$set: saleDoc});
        } else {
            var saleObj = new Sale();
            saleObj.set(saleDoc);
            saleObj.save();
        }
    },
    "updateSale": function (saleObj) {
        saleObj.save();
    },
    "deleteSale": function (saleObj) {
        saleObj.remove();
    }
});
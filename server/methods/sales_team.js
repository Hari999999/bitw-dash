Meteor.methods({
    "updateSalesperson": function(salespersonObj){
        salespersonObj.save();
    },
    "deleteSalesperson": function(salespersonObj){
        salespersonObj.remove();
    }
});
Meteor.methods({
    "updateItem": function(itemObj){
        itemObj.save();
    },
    "deleteItem": function(itemObj){
        itemObj.remove();
    }
});
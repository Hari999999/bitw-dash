Meteor.methods({
    "updatePermission": function(permissionObj){
        permissionObj.save();
    },
    "deletePermission": function(permissionObj){
        permissionObj.remove();
    }
});
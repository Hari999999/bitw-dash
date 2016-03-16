Meteor.startup(function(){

    // Create Permissions Available for the entire system
    if(Permissions.find({}).count() == 0){
        for(var i=0; i < Meteor.settings.public.modules.length; i++) {
            for (var j = 0; j < Meteor.settings.public.operations.length; j++) {
                Permissions.insert({
                    module: Meteor.settings.public.modules[i],
                    operation: Meteor.settings.public.operations[j]
                });
            }
        }
    }

    // Create the Administrator Role if it does not exist
    if(Roles.find({name: "Administrator"}).count() == 0){
        var adminRole = {
            name: "Administrator",
            permissions: []
        };

        // Add all permission available
        var permissionIds = Permissions.find({}, {_id: 1}).fetch();
        for(var k=0; k < permissionIds.length; k++){
            adminRole.permissions.push(permissionIds[k]._id);
        }
        Roles.insert(adminRole);
    }

    // Create the Driver Role if it does not exist
    if(Roles.find({name: "Driver"}).count() == 0){
        var surveyorRole = {
            name: "Driver",
            permissions: []
        };
        Roles.insert(surveyorRole);
    }

    //Create the Super Administrators user if it does not exist
    if(Meteor.users.find({username: "Admin"}).count() == 0){
        // Get the Admin Role
        var adminRole = Roles.findOne({name: "Administrator"});
        // Create the Administrator User
        Accounts.createUser({
            username: "Admin",
            password: "P@ssw0rd!",
            profile: {
                roleId: adminRole._id,
                isSuper: true
            }
        });
    }
});
Roles.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    }
});

Permissions.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    }
});

Meteor.users.allow({
    insert: function(userId, doc){
        var adminRole = Roles.find({name: "Administrator"});
        var adminUser = Meteor.users.find({_id: userId, "profile.roleId": adminRole.roleId});
        return adminUser ? true : false;
    },
    update: function(){
        return true;
    },
    remove: function(userId, doc){
        var adminRole = Roles.find({name: "Administrator"});
        var adminUser = Meteor.users.find({_id: userId, "profile.roleId": adminRole.roleId});
        return adminUser ? true : false;
    }
});

Notifications.allow({
    insert: function(){
        return true;
    },
    update: function(userId, doc){
        return userId == doc.receiverId;
    },
    remove: function(userId, doc){
        return userId == doc.receiverId;
    }
});

SalesTeam.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    }
});

Items.allow({
    insert: function(){
        return true;
    },
    update: function(){
        return true;
    },
    remove: function(){
        return true;
    }
});
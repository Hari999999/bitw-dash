Template.notificationsDropDown.helpers({
    "hasUnreadNotifications": function(){
        return Notifications.find({receiverId: Meteor.userId(), isRead: false}).count() > 0;
    },
    "totalUnread": function(){
        return Notifications.find({receiverId: Meteor.userId(), isRead: false}).count();
    },
    "unreadNotifications": function(){
        return Notifications.find({receiverId: Meteor.userId(), isRead: false}, {limit: 5, sort: {date_created: -1}});
    }
});

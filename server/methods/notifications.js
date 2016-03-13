Meteor.methods({
    "markAsRead": function (notificationIds) {
        Notifications.update({_id: {$in: notificationIds}}, {$set: {isRead: true}}, {multi: true});
    },
    "markAsUnread": function(notificationIds) {
        Notifications.update({_id: {$in: notificationIds}}, {$set: {isRead: false}}, {multi: true});
    },
    "deleteNotifications": function(notificationIds){
        Notifications.remove({_id: {$in: notificationIds}});
    }
});
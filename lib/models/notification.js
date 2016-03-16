Notification = Astro.Class({
    name: 'Notification',
    collection: Notifications,
    fields: {
        receiverId: 'string',
        title: 'string',
        detail: 'string',
        isRead: 'boolean',
        sentOn: {
            type: 'date',
            default: function(){
                return new Date();
            }
        }
    },
    methods: {
        sent: function () {
            return moment(this.sentOn).fromNow();
        },
        summary: function () {
            return this.detail.slice(0, 50) + " ...";
        },
        sendToAdmin: function () {
            var adminRole = Roles.findOne({name: "Administrator"});
            var admins = Meteor.users.find({"profile.roleId": adminRole._id}).fetch();
            for (var i = 0; i < admins.length; i++) {
                Notifications.insert({
                    receiverId: admins[i]._id,
                    title: this.title,
                    detail: this.detail,
                    isRead: false
                });
            }
        }
    }
});

Template.notificationsList.created = function () {
  this.pagination = new Meteor.Pagination(Notifications, {
    sort: {
      sentOn: -1
    }
  });
};

Template.notificationsList.helpers({
  templatePagination: function () {
    return Template.instance().pagination;
  },
  notificationsList: function () {
    return Template.instance().pagination.getPage();
  },
  hasNotifications: function () {
    return Notifications.find({receiverId: Meteor.userId()}).count() > 0;
  },
  notificationSelected: function () {
    return Session.get("isNotificationSelected") ? "" : "disabled";
  }
});

Template.notificationsList.events({
  "change #all-notifications": function (e, t) {
    if (e.target.checked) {
      t.$("table tbody tr>td input").prop("checked", true);
      Session.set("isNotificationSelected", true);
    } else {
      t.$("table tbody tr>td input").prop("checked", false);
      Session.set("isNotificationSelected", false);
    }
  },
  "change table tbody tr td input": function (e, t) {
    if (e.target.checked) {
      Session.set("isNotificationSelected", true);

      if ($("table tbody tr>td input:checked").length == $("table tbody tr>td input").length) {
        $("input#all-notifications").prop("checked", true);
      }
    } else {
      // Un-check the all box
      $("input#all-notifications").prop("checked", false);


      if ($("table tbody tr>td input:checked").length == 0) {
        Session.set("isNotificationSelected", false);
      }
    }
  },
  "click #mark-as-read": function (e, t) {
    var selectedNotificationIds = _.map(t.findAll("table tr td input:checked"), function (checkbox) {
      return checkbox.value;
    });
    Meteor.call("markAsRead", selectedNotificationIds);
  },
  "click #mark-as-unread": function (e, t) {
    var selectedNotificationIds = _.map(t.findAll("table tr td input:checked"), function (checkbox) {
      return checkbox.value;
    });
    Meteor.call("markAsUnread", selectedNotificationIds);
  },
  "click #delete-notification": function (e, t) {
    var selectedNotificationIds = _.map(t.findAll("table tr td input:checked"), function (checkbox) {
      return checkbox.value;
    });
    Meteor.call("deleteNotifications", selectedNotificationIds);
  }
});

Template.notificationsList.onRendered(function () {
  Session.set("selectedNotificationId", null);
});

Template.notificationsList.onDestroyed(function () {
  Session.set("selectedNotificationId", null)
});

Template.notificationItem.onRendered(function(){
  $.material.checkbox();
});

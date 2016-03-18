Meteor.subscribe("users");
Meteor.subscribe("roles");
Meteor.subscribe("permissions");
Meteor.subscribe("notifications");
Meteor.subscribe("salesTeam");
Meteor.subscribe("items");
Meteor.subscribe("sales");

// Aggregate Publication Collections
clientSalespersonTotalDailySales = new Meteor.Collection("clientSalespersonTotalDailySales");
clientItemTotalDailySales = new Meteor.Collection("clientItemTotalDailySales");
clientTotalDailySales = new Meteor.Collection("clientTotalDailySales");

// Aggregate Publications Subscriptions
Meteor.subscribe("salespersonTotalDailySales");
Meteor.subscribe("itemTotalDailySales");
Meteor.subscribe("totalDailySales");
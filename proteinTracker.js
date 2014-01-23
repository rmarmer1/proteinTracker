
Users = new Meteor.Collection('users');
History = new Meteor.Collection('history');

if (Meteor.isClient) {
  Template.userDetails.helpers({
    user: function () {
      return Users.findOne();
    }
  });

  Template.history.helpers({
    historyItem: function() {
      var historyItems = [
        {date: '10/23/2014 5:00 AM', value: 20 },
        {date: '10/23/2014 6:00 AM', value: 25 },
        {date: '10/23/2014 7:00 AM', value: 30 },
        {date: '10/23/2014 8:00 AM', value: 5 },
        {date: '10/23/2014 9:00 AM', value: 4 }
      ];
      return historyItems;
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    if (Users.find().count() === 0) {
      Users.insert({
        total: 120,
        goal: 200
      });
    }

//    if (History.find().count() === 0) {
//      History.insert({
//        value: 50,
//        date: new Date().toTimeString()
//      });
//
//      History.insert({
//        value: 30,
//        date: new Date().toTimeString()
//      });
//
//      History.insert({
//        value: 20,
//        date: new Date().toTimeString()
//      });
 //   }
  });
}
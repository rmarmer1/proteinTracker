
ProteinData = new Meteor.Collection('protein_data');
History = new Meteor.Collection('history');

ProteinData.allow({
  
  update: function (userId, data) {
    if (data.total < 0 )
      return true;
    return false;
  },

  insert: function (userId, data) {
    if (data.userId == userId < 0 )
      return true;
    return false;
  }
});

Meteor.methods({
  addProtein: function(amount) {
// If (while)'isSimulation' is true, the code is running on the client
// So when running on the server, a 'delay' of 3 seconds on the return will occur
// Since the code starts out on the client, isSimulation is initially true, and
// the else path adds 500 to the total, immediately! ... Then the code runs again
// but this time on the sever, with the delay. The server receives the actual 
// amount that the user input, correctly saves it to the DB, & updates (corrects)
// the dom. The delay just slows the whole process down to make sure we can see it! 
        if (!this.isSimulation) {
// Can't use parts of the below code in production, so will comment them out
// Will leave the 'amount = 500' code at 1st, however, just to √ if we run into 
// latency problems when the app is deployed to a production sever..

//            var Future = Npm.require('fibers/future');
//            var future = new Future();
//            Meteor.setTimeout(function () {
//                future.return();
//            }, 3 * 1000);
//            future.wait();
        } else {
            amount = 500;
        }

    ProteinData.update({userId: this.userId}, { $inc: {total: amount }});
      
      History.insert({
        value: amount,
        date: new Date().toTimeString(),
        userId: this.userId
      });
    },

    resetGoal: function(setGoalAmount){
      console.log('setGoalAmount is: ' + setGoalAmount);
      console.log('this.userId is: ' + this.userId);
      console.log('Meteor.userId() is: ' + Meteor.userId());
      ProteinData.update({userId: this.userId}, {$set: {goal: setGoalAmount }});
    },

    decrementBy100: function(){
      ProteinData.update(this._id, { $inc: { total: -100 } });
    } 
});

if (Meteor.isClient) {

Meteor.Router.add({
  '/': 'userDetails',
  '/settings': 'settings'
})

Meteor.subscribe('allProteinData');
Meteor.subscribe('allHistory');

  Deps.autorun( function() {
    if (Meteor.user())
      console.log('User logged in: ' + Meteor.user().profile.name);
    else
      console.log('User logged out!');

  });

  Template.userDetails.helpers({

    user: function () {
    
    var data = ProteinData.findOne();

      if (!data) {
      
        data = {
            userId: Meteor.userId(),
            total: 0,
            goal: 200
        };
        ProteinData.insert(data);
      }  
        return data;
    },
    lastAmount: function() { return Session.get('lastAmount'); }
  });

  Template.history.helpers({

    historyItem: function () {
      return History.find({}, {sort: {date: -1}});
    }
  });

  Template.userDetails.events({
    'click #addAmount' : function (e) {
      e.preventDefault();

      var amount = parseInt($('#amount').val());

      Meteor.call('addProtein', amount, function(error, id) {
        if (error)
          return alert(error.reason);
      });
      Session.set('lastAmount', amount);
    },

    'click #quickSubtract': function(e) {
      e.preventDefault();

      Meteor.call('decrementBy100', function(error, id) {
        if (error)
          return alert(error.reason);
      });
    }
});

 Template.settings.helpers({

    userGoal: function () {
        
        var data = ProteinData.findOne();
    
          if (!data) {
          
            data = {
                userId: Meteor.userId(),
                total: 0,
                goal: 200
            };
            ProteinData.insert(data);
          }  
            return data;
    }
  });

  Template.settings.events({
    'click #resetGoal': function(e) {
      e.preventDefault();

      var setGoalAmount = parseInt($('#setGoalAmount').val());
//      console.log('setGoalAmount is: ' + setGoalAmount);
//      console.log('this.userId is: ' + this.userId);
//     Meteor.call('resetGoal', setGoalAmount, function(error, id) {
//       if (error)
//       return alert(error.reason);

    ProteinData.update(this._Id, {$set: {'goal': 'setGoalAmount'}} );
//    Task.update(this._id, { $set: {'status': 'doing'}});
  } 
 });

}

if (Meteor.isServer) {
 
  Meteor.publish('allProteinData', function(){
    return ProteinData.find({ userId: this.userId });
  });

  Meteor.publish('allHistory', function(){
    return History.find({ userId: this.userId }, {sort: {date: -1}, limit: 5});
  });

  Meteor.startup(function () {

  });
}

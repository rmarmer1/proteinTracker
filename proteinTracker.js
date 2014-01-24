
ProteinData = new Meteor.Collection('protein_data');
History = new Meteor.Collection('history');

if (Meteor.isClient) {

Meteor.subscribe('allProteinData');
Meteor.subscribe('allHistory');

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
    }
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

      ProteinData.update(this._id, { $inc: {total: amount }});
      
      History.insert({
        value: amount,
        date: new Date().toTimeString(),
        userId: this.userId
      });
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

if (Meteor.is_client) {
  Template.main.loggedIn = function () {
    return Meteor.userId();
  };
}
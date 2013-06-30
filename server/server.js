Accounts.onCreateUser(function(options, user) {
  Meteor.users.update(
    {_id: user._id},
    { $set: { profile: { appIds: [] }}}
  );

  if (options.profile)
    user.profile = options.profile;

  return user;
});

Meteor.methods({
  addAppToUser: function(appId) {
    Meteor.users.update(
      { _id: this.userId },
      { $addToSet: { "profile.appIds": appId }});
  },

  fetchAppsForUser: function() {
    return Meteor.users.findOne({ _id: this.userId }).profile.appIds;
  }
});
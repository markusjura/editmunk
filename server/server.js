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
    console.log("Added the app!!!");
    Meteor.users.update(
      { _id: this.userId },
      { $addToSet: { profile: { appIds: appId }}});
  }
});
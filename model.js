/**
 * _id
 * created_at
 * name
 */
Apps = new Meteor.Collection('app');

App = {
  insert: function(name) {
    Session.set("activeApp", name);
    var id = Apps.insert({
      created_at: new Date().getTime(),
      name: name
    });

    return Apps.findOne({_id: id});
  },

  fetchNameForId: function(_id) {
    return Apps.findOne({ _id:_id }).name;
  }
}

/**
 * _id
 * created_at
 * updated_at
 * app_id
 * type => filetype
 * name
 * content
 */
Documents = new Meteor.Collection('document');

Document = {
  insert: function(document) {
    document._id = Documents.insert(document);
    return document;
  },

  fetchAllForAppId: function(appId) {
    return Documents.find({ app_id: appId }).fetch();
  },

  fetchLastForAppId: function(appId) {
    return Documents.find({app_id: appId}, {sort: {updated_at: -1}, limit: 1}).fetch()[0];
  },

  update: function(_id, propertiesToUpdate) {
    Documents.update({ _id: _id }, { $set : propertiesToUpdate });
  }

}
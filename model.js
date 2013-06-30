/**
 * _id
 * created_at
 * name
 */
Apps = new Meteor.Collection('app');

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

  fetchLastForAppId: function(appId) {
    return Documents.find({appId: appId}, {sort: {updated_at: -1}, limit: 1}).fetch()[0];
  },

  update: function(_id, propertiesToUpdate) {
    Documents.update({ _id: _id }, { $set : propertiesToUpdate });
  }

}
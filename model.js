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
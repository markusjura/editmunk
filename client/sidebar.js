// fetch the initial document list
Deps.autorun(function(c) {
  var activeAppId = Session.get("activeAppId");

  if (typeof activeAppId == 'undefined')
    return;

  var documents = Document.fetchAllForAppId(activeAppId);

  if(typeof Session.get("activeDocumentId") == 'undefined') {
    Session.set("activeDocumentId", Document.fetchLastForAppId(activeAppId));
  }

  if(documents && documents.length > 0) {
    var rendered = Meteor.render(function() {
      return Template.documentList({ documents: documents });
    });

    document.getElementById("document-list").innerHTML = '';
    document.getElementById("document-list").appendChild(rendered);
  }
});

Template.document.isActive = function() {
  return (this._id == Session.get("activeDocumentId")) ? "active" : "";
}

Template.documentList.events({
  'click .add-document' : function(evt, templ) {
    var newDate = new Date().getTime();
    var document = Document.insert({
      created_at: newDate,
      updated_at: newDate,
      appId: Session.get("activeAppId"),
      type: "feature",
      name: "first.feature",
      content: "document.write('Hello Editmunk');"
    });

    Session.set("activeDocumentId", document._id);
  },

  'click .document-name' : function(evt, tmpl) {
    Session.set("activeDocumentId", $(evt.target).attr('id'));
  }

});
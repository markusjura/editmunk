// fetch the initial document list
Template.sidebar.initSidebar = (function () {
  var activeAppId = Session.get("activeAppId");
  var documents = Document.fetchAllForAppId(activeAppId);

  if(documents && documents.length > 0) {
    var rendered = Meteor.render(function() {
      return Template.documentList({ documents: documents });
    });

    document.getElementById("document-list").innerHTML = '';
    document.getElementById("document-list").appendChild(rendered);

    if(typeof Session.get("activeDocument") == "undefined") {
      Session.set("activeDocument", Document.fetchLastForAppId(activeAppId));
    }
  }
});

Template.document.isActive = function() {
  return (this.toString() == Session.get("activeDocumentId")) ? "active" : "";
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
      content: "Given I am on the Welcome screen"
    });

    Session.set("activeDocumentId", document._id);
  },

  'click .document-name' : function(evt, tmpl) {
    Session.set("activeDocumentId", $(evt.target).attr('id'));
  }

});
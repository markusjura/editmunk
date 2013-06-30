function render_editor() {
  if($('#editor').length > 0) {
    var lastDocument = Document.fetchLastForAppId('default');

    // if no document exist => create one
    if(typeof lastDocument == 'undefined') {
      var newDate = new Date().getTime();
      lastDocument = Document.insert({
        created_at: newDate,
        updated_at: newDate,
        appId: "default",
        type: "feature",
        name: "first.feature",
        content: "Given I am on the Welcome screen"
      });
    }

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/xcode");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setValue(lastDocument.content);
    Session.set("document", lastDocument);

    editor.getSession().on('change', function(e) {
      // update the Documents collection
      Document.update(Session.get("document")._id, {
        content : editor.getValue(),
        updated_at : new Date().getTime()
      });
    });
  }
}

Meteor.startup(function () {
  $(document).ready(function (){
    $('.add-file,.edit-file').click(function() {
      $('#take-name').modal();
    });
  });
});

Template.main.loggedIn = function () {
  setTimeout(function() {
      render_editor();
    }, 100);

  return Meteor.userId();
};
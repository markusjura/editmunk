function render_editor() {
  if($('#editor').length > 0) {
    var lastDocument = Documents.find({}, {sort: {updated_at: -1}, limit: 1}).fetch()[0];

    // if no document exist => create one
    if(lastDocument.length == 0) {
      var newDate = new Date().getTime();
      lastDocument = Documents.insert({
        created_at: newDate,
        updated_at: newDate,
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

    // var query = Documents.find({_id: lastDocument});
    // handle = query.observe({
    //   changed : function(newDoc, oldIndex, oldDoc) {
    //     if(editor !== undefined)
    //       editor.setValue(newDoc.content);
    //   }
    // });

    console.log(Session.get("document")._id);
    console.log(editor.getValue());
    editor.getSession().on('change', function(e) {
    // update the Documents collection
    Documents.update({_id: Session.get("document")._id},
      { $set :
        {
          content : editor.getValue()//,
          // updated_at : new Date().getTime()
        }
      });

    });
  }
}


Template.main.loggedIn = function () {
  setTimeout(function() {
      render_editor();
    }, 100);

  return Meteor.userId();
};
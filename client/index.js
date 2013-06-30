function render_editor() {
  if($('#editor').length > 0) {
    var file = Files.findOne();

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/xcode");
    editor.getSession().setMode("ace/mode/javascript");

    editor.setValue(file.contents);
    Session.set("file", file);

    var query = Files.find({_id : Session.get("file")});

    handle = query.observe({
      changed : function(newDoc, oldIndex, oldDoc) {
        if(editor !== undefined)
          editor.setValue(newDoc.contents);
      }
    });

    editor.getSession().on('change', function(e) {
    // update the File collection
    Files.update({_id: Session.get("file")._id},
      { $set :
        {
          contents : editor.getValue()
        }
      });
    });
  }
}


if (Meteor.is_client) {
  Template.main.loggedIn = function () {
    setTimeout(function() {
        render_editor();
      }, 100);

    return Meteor.userId();
  };
}
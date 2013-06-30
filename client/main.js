function render_editor() {
  if($('#editor').length > 0) {
    var file = Files.insert({
      contents : "Welcome to Editmunk!",
      type: "javascript",
      directory: false,
      children: []
    });

    Session.set("file", file);
    Session.set("theme", "xcode");
    Session.set("type", Files.findOne({_id : Session.get("file")}).type);

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/" + Session.get("theme"));
    editor.getSession().setMode("ace/mode/" + Session.get("type"));

    var query = Files.find({_id : Session.get("file")});

    var handle = query.observe({
      changed : function(newDoc, oldIndex, oldDoc) {
        if(editor !== undefined)
          editor.setValue(newDoc.contents);
      }
    });

    editor.getSession().on('change', function(e) {
    // update the File collection
    Files.update({_id: Session.get("file")},
      { $set :
        {
          contents : editor.getValue()
        }
      });
    });
  }
}


if (Meteor.is_client) {
  Meteor.startup(function () {
    $(document).ready(function (){
    $('.add-file,.edit-file').click(function() {
      $('#take-name').modal();
    });
      render_editor();
    });
  });

  Template.main.loggedIn = function () {
    setTimeout(function() {
        render_editor();
      }, 100);

    return Meteor.userId();
  };
}
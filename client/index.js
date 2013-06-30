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
    Session.set("document", lastDocument._id);

    var query = Documents.find({_id: lastDocument._id});

    handle = query.observe({
      changed : function(newDoc, oldDoc) {
        if(editor !== undefined && (
            newDoc.content !== editor.getValue())){
          editor.setValue(newDoc.content);
        }
      }
    });

    handle = editor.on('change', function(e) {
      // update the Documents collection
      if(editor.getValue() != '') {
        console.log( 'id of the current doc', Session.get("document"));
        Document.update(Session.get("document"), {
          content : editor.getValue(),
          updated_at : new Date().getTime()
        });
      }
    });
  }
}

Meteor.startup(function () {
  $(document).ready(function (){
    $('.add-app,.add-file,.edit-file').click(function() {
      $('#take-name').modal();
      $('#take-name').find('#save-button').click(function() {
        $('#take-name').modal('hide');
        var name = $("#take-name").find('input').val();
        var app = App.insert(name);
        Meteor.call('addAppToUser', app._id);
        $("#take-name").find('input').val('');
      });
    });

    Meteor.call('fetchAppsForUser', function(error, apps) {
      if(error) console.log(error);

      if(apps && apps.length > 0) {
        $('#apps-list').prepend("<li class='divider'></div>");
        for(var app in apps) {
         $('#apps-list').prepend("<li><a href='#'>"+ App.fetchNameForId(apps[0]) +"</a></li>");
        }
      }
    });
  });
});

Template.main.loggedIn = function () {
  setTimeout(function() {
      render_editor();
    }, 100);

  return Meteor.userId();
};
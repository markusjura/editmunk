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
        console.log("newDoc : ",newDoc.content);
        if(editor !== undefined){
          editor.setValue(newDoc.content);
        }
      }
    });

    handle = editor.on('change', function(e) {
      // update the Documents collection
      if(editor.getValue() !== '') {
        Document.update(Session.get("document"), {
          content : editor.getValue(),
          updated_at : new Date().getTime()
        });
      }
    });
  }
}

// fetching the inital app list
Meteor.call('fetchAppsForUser', function(error, apps) {
  if(error) {
    console.log(error);
    return;
  }

  if(apps && apps.length > 0) {
    var rendered = Meteor.render(function() {
      return Template.appList({ apps: apps });
    });
    document.getElementById("apps-list").innerHTML = '';
    document.getElementById("apps-list").appendChild(rendered);

    if(typeof Session.get("activeApp") == "undefined") {
      Session.set("activeApp", App.fetchNameForId(apps[0]));
      Session.set("activeAppId", apps[0]);

      var sidebar = Template.sidebar.initSidebar({});
    }
  }
});

Meteor.startup(function () {
  var fragment = Meteor.render(
    function () {
      var name = Session.get("activeApp") || "None";
      return name;
    }
  );
  document.getElementById("activeApp").appendChild(fragment);
});

Template.main.loggedIn = function () {
  setTimeout(function() {
      render_editor();
    }, 100);

  return Meteor.userId();
};

Template.app.isActive = function() {
  return (this.toString() == Session.get("activeAppId")) ? "active" : "";
}

Template.app.getName = function() {
  return App.fetchNameForId(this.toString());
}

Template.appList.events({
  'click .add-app' : function(evt, templ) {
    evt.stopPropagation();
    evt.preventDefault();

    $('#take-name').modal();
    $('#take-name').find('#save-button').click(function() {
      $('#take-name').modal('hide');
      var name = $("#take-name").find('input').val();
      var app = App.insert(name);
      Meteor.call('addAppToUser', app._id);
      $("#take-name").find('input').val('');
    });
  },

  'click .appName' : function(evt, tmpl) {
    Session.set("activeApp", $(evt.target).html());
    Session.set("activeAppId", $(evt.target).attr('id'));
  }

});

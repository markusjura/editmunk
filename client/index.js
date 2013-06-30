COUNT=0;
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
        content: "document.write('Hello Editmunk');"
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
        COUNT++;
        if(editor !== undefined && COUNT <= 2000){
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

    Meteor.call('fetchAppsForUser', fetchAppList);
  }
}

// fetching the inital app list
function fetchAppList(error, apps) {
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

    if(typeof Session.get("activeApp") == "undefined" ||
        Session.get("activeApp") === null) {
      Session.set("activeApp", App.fetchNameForId(apps[0]));
      Session.set("activeAppId", apps[0]);

      var sidebar = Template.sidebar.initSidebar({});
    }
  }
}

Deps.autorun(function() {
  $('#activeApp').html(Session.get("activeApp"));
});

Meteor.call('fetchAppsForUser', fetchAppList);

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

Template.listDrop.loggedIn = function () {
  setTimeout(function() {
      render_editor();
    }, 100);

  return Meteor.userId();
};

Template.app.isActive = function() {
  return (this.toString() == Session.get("activeAppId")) ? "active" : "";
};

Template.app.getName = function() {
  return App.fetchNameForId(this.toString());
};

Template.appList.events({
  'click .add-app' : function(evt, templ) {
    evt.stopPropagation();
    evt.preventDefault();
    var modal = $('#take-name').modal();

    $(modal).find('#save-button').click(function() {
      var name = $(modal).find('#add-input').val();
      $(modal).modal('hide');
      var app = App.insert(name);
      Meteor.call('addAppToUser', app._id);
      $(modal).find('input').val('');
      Meteor.call('fetchAppsForUser', fetchAppList);
    });

  },

  'click .appName' : function(evt, tmpl) {
    Session.set("activeApp", $(evt.target).html());
    Session.set("activeAppId", $(evt.target).attr('id'));
  }

});

Template.modal.modName = 'take-name';
Template.modal.modValue = 'add-input';
Template.modal.saveTrigger = 'save-button';

Deps.autorun(function(){
  if(!Meteor.userId()){
    console.log("User is not logged in !");
    Session.set('activeApp', null);
    Session.set('activeAppId', null);
  }
});

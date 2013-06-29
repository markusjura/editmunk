function render_editor() {
  if($('#editor').length > 0) {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/xcode");
    editor.getSession().setMode("ace/mode/javascript");
  }
}


if (Meteor.is_client) {
  Meteor.startup(function () {
    $(document).ready(function (){
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
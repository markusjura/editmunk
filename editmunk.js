if (Meteor.isClient) {
  Meteor.startup(function () {
    $(document).ready(function (){
      var editor = ace.edit("editor");
      editor.setTheme("ace/theme/monokai");
      editor.getSession().setMode("ace/mode/javascript");
    });
  });

  Template.hello.greeting = function () {
    return "Welcome to editmunk!";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Posts = new Meteor.Collection('posts');
//
// https://github.com/EventedMind/iron-router/issues/553
//
if (Meteor.isClient) {

  Template.hello.greeting = function () {
    return "Welcome to iron-router.";
  };

  Template.hello.events({
    'click input': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Router.configure({
    loadingTemplate: 'loading',
    waitOn: function(pause) {
      return [Meteor.subscribe('posts', {path: this.path})];
    },
    onBeforeAction: 'loading',
    data: function() {
      return {
        posts: Posts.find()
      };
    },
  });

  Router.map(function(){
    this.route('home',{path: '/'});
    this.route('one');
    this.route('two');
    this.route('three');
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    ['/','/one','/two', '/three'].forEach(function(path){
      var c = Posts.find({path: path}).count();
      if(c<1000)
      {
        for(var i=c;i<=1000;i++){
          Posts.insert({title: "Page "+path+" post # "+i,date: new Date(),path:path})}
      }
    });
  });

  Meteor.publish('posts', function(q){
    q = q == undefined ? {} : q;
    return Posts.find(q);
  });
}

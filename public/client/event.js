var Event = angular.module('Event',['ui.bootstrap'])
.controller('UserPromptController', function($scope, $http, $location, UserService){
  if (!UserService.getCurrentUser()) {
    UserService.setCurrentUser(prompt('What is your name?') || 'anonymous');
    $http({
      method: 'POST',
      url: '/event/'+$location.path()+'/invitees',
      data: {name: UserService.getCurrentUser(),
             status: $scope.currentUserStatus}
    })
  }
})
.service('CommentsService', function(){
  console.log("starting comments service");
  this._comments = [];
  this.addComment = function(username, comment){
    this._comments.push({username: username, comment: comment});
  };
  this.getComments = function(){
    return this._comments;
  }
})
.service('UserService', function(){
  console.log("starting user service");
  this._currentUser = null;
  this._status = 'NotAttending';
  this.setCurrentUser = function(user){
    this._currentUser = user;
  };
  this.getCurrentUser = function(){
    return this._currentUser;
  };
  this.setStatus = function(status){
    this._status = status;
  };
  this.getStatus = function(status){
    return this._status;
  }
})
.controller('EventController', function($scope, $location, $http){
  console.log('loc hash: ',$location.path());
  $http({
    method: 'GET',
    url: $location.path()
  }).then(function(obj){
    $scope = _.extend($scope,obj.data);
    var formattedLocation = $scope.location.split(' ').join('+');
    $scope.map = "http://maps.googleapis.com/maps/api/staticmap?center="+
                 formattedLocation +
                 "&markers=color:red|"+formattedLocation+
                 "&zoom=13"+
                 "&size=600x300"+
                 "&maptype=roadmap"+
                 "&sensor=false";
  }).catch(function(obj){
    console.log('eventController get failed: ', obj);
  })
})
.controller('ButtonsCtrl',function($scope, $http, $location, UserService){
  $scope.updateStatus = function(){
    UserService.setStatus($scope.currentUserStatus);
    $http({
      method: 'POST',
      url: $location.path()+'/invitees/'+UserService.getCurrentUser(),
      data: {name: UserService.getCurrentUser(),
             status: UserService.getStatus()}
    }).then(function(){
      console.log('status update success!');
    }).catch(function(err){
      console.log('status update err: ',err);
    });
  };
})
.controller('CommentsController', function($scope, $http, $location, CommentsService, UserService){
  $scope.comments = [];
  $http({
    method: 'GET',
    url: $location.path()+'/comments',
  }).then(function(obj){
    console.log("from :",$location.path()+'/comments');
    for (var i = 0; i < obj.data.length; i++) {
      console.log(obj.data[i].username+": "+obj.data[i].comment);
      CommentsService.addComment(obj.data[i].username, obj.data[i].comment);
      $scope.comments.push(obj.data[i].username+": "+obj.data[i].comment);
    };
  }).catch(function(err){
    console.log("ERROR when getting comments: ", err);
  });
  $scope.addComment = function(){
    console.log("addComment");
    return $http({
      method: 'POST',
      url: $location.path()+'/comments',
      data: {username: UserService.getCurrentUser(), text: $scope.comment}
    }).then(function(data){
      CommentsService.addComment('testUser', $scope.comment);
      $scope.comments.push(UserService.getCurrentUser()+': '+$scope.comment);
      console.log("success!");
    }).catch(function(err){
      console.log("ERR: ", err);
    })
    // $scope.comments.push($scope.comment);
  };
})
.controller('InviteesController', function($scope, $http, $location){
  $http({
    method: 'GET',
    url: $location.path()+'/invitees'
  }).then(function(obj){
    for (var i = 0; i < obj.data.length; i++) {
      var invitee = obj.data[i];
      if(invitee.status === 'Not Attending'){

      }else if(invitee.status === 'Maybe'){
      }else if(invitee.status === 'Attending'){
      obj.data[i]
      }
    };
    console.log('invitees: ',obj);
  }).catch(function(err){
    console.log('invitees ERR: ',err);
  });
});

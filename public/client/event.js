var Event = angular.module('Event',['ui.bootstrap','ngCookies'])
.controller('UserPromptController', function($scope, $cookies, $http, $location, UserService){
  console.log($cookies.user)
  if (!$cookies.user) {
    UserService.setCurrentUser(prompt('What is your name?') || 'anonymous');
    $http({
      method: 'POST',
      url: $location.path()+'/invitees',
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
.service('UserService', function($cookies){
  this._currentUser = null;
  this._status = 'NotAttending';
  this.setCurrentUser = function(user){
    this._currentUser = user;
    $cookies.user = user;
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
                 "&size=500x300"+
                 "&maptype=roadmap"+
                 "&sensor=false";
  }).catch(function(obj){
    console.log('eventController get failed: ', obj);
  })
})
.service('InviteeService', function(){

})
.controller('AttendanceController',function($scope, $http, $location, UserService){
  $scope.attending = [];
  $scope.maybeAttending = [];
  $scope.notAttending = [];
  $scope.noResponse = [];
  $scope.getAttendees = function(){
    $http({
      method: 'GET',
      url: $location.path()+'/invitees'
    }).then(function(obj){
      for (var i = 0; i < obj.data.length; i++) {
        var invitee = obj.data[i];
        if(invitee.status === 'Not Attending'){
          $scope.notAttending.push(invitee.name);
        }else if(invitee.status === 'Maybe'){
          $scope.maybeAttending.push(invitee.name);
        }else if(invitee.status === 'Attending'){
          $scope.attending.push(invitee.name);
        }else if(invitee.status === 'No Response'){
          $scope.noResponse.push(invitee.name)
        }
      };
      console.log('invitees: ',obj);
    }).catch(function(err){
      console.log('invitees ERR: ',err);
    });
  };
  $scope.getAttendees();
  $scope.currentUserStatus = "No Response"
  $scope.updateStatus = function(){
    UserService.setStatus($scope.currentUserStatus);
    $http({
      method: 'POST',
      url: $location.path()+'/invitees/'+UserService.getCurrentUser(),
      data: {name: UserService.getCurrentUser(),
             status: UserService.getStatus()}
    }).then(function(){
      console.log('status update success!');
      $scope.getAttendees();
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
    return $http({
      method: 'POST',
      url: $location.path()+'/comments',
      data: {username: UserService.getCurrentUser(), text: $scope.comment}
    }).then(function(data){
      CommentsService.addComment(UserService.getCurrentUser(), $scope.comment);
      $scope.comments.push(UserService.getCurrentUser()+': '+$scope.comment);
      console.log("success!");
    }).catch(function(err){
      console.log("ERR: ", err);
    })
    // $scope.comments.push($scope.comment);
  };
});

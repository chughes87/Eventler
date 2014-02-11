var Event = angular.module('Event',[])
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
.controller('EventController', function($scope, $location, $http){
  console.log('loc hash: ',$location.path());
  $http({
    method: 'GET',
    url: '/event'+$location.path()
  }).then(function(obj){
    console.log('eventController get data: ', obj);
    $scope = _.extend($scope,obj.data);
  }).catch(function(obj){
    console.log('eventController get failed: ', obj);
  })
})
.controller('CommentsController', function($scope, $http, $location, CommentsService){
  $scope.comments = [];
  $http({
    method: 'GET',
    url: '/event'+$location.path()+'/comments',
  }).then(function(obj){
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
      url: '/comments',
      data: {username: 'testUser', text: $scope.comment}
    }).then(function(data){
      CommentsService.addComment('testUser', $scope.comment);
      $scope.comments.push('testUser: '+$scope.comment);
      console.log("success!");
    }).catch(function(err){
      console.log("ERR: ", err);
    })
    // $scope.comments.push($scope.comment);
  };
});

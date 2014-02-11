var Eventler = angular.module('Eventler',[])
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
.controller('CommentsController', function($scope, $http, CommentsService){
  $scope.comments = []
  $http({
    method: 'GET',
    url: '/comments',
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
    $http({
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

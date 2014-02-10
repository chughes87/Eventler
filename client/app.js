var Eventler = angular.module('Eventler',[])
.controller('CommentsController', function($scope){
  $scope.comments = ['this event sucks', 'OMG KARAOKE!', 'why did you hire a clown? Honesly...'];
});
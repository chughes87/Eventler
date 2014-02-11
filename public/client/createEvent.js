console.log('TEST');
var CreateEvent = angular.module('CreateEvent', [])
.controller('FormController',function($scope, $http, $location){
  console.log('creating eventcontroller');
  $scope.createEvent = function(event){
    return $http({
      method: 'POST',
      url: '/events',
      data: event
    }).then(function(data){
      console.log("event post success: "+data);
      $location.path('/'+data.id)
    }).catch(function(err){
      console.log("event post error: "+err);
    });
  };
});
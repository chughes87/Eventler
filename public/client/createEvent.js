var CreateEvent = angular.module('CreateEvent', [])
.controller('FormController',function($scope, $http, $location){
  console.log('creating eventcontroller');
  $scope.createEvent = function(event){
    console.log("creating event");
    return $http({
      method: 'POST',
      url: '/events',
      data: event
    }).then(function(obj){
      $location.path('/event/'+obj.data.id);
    }).catch(function(err){
      console.log("event post error: ", err);
    });
  };
});
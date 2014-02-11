var Eventler = angular.module('Eventler', ['ngRoute', 'Event', 'CreateEvent'])
// shortly.loggedIn = false;
.config(function($routeProvider){
  $routeProvider
    .when('/', {
      templateUrl : '../views/createEvent.html',
      controller  : 'FormController'
    })
    .when('/event/:event_id', {
      templateUrl : '../views/event.html',
      controller  : 'EventController'
    })
    .otherwise({
      redirectTo: '/'
    })
});
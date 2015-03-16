'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/view1'});
}]);

// myApp.controller('myCtrl', function($scope){
//   /* Chart options */
//   $scope.options = { /* JSON data */ };
//
//   /* Chart data */
//   $scope.data = { /* JSON data */ }
//
// })

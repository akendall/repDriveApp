'use strict';

var ngModule = angular.module('myApp.view1', ['ngRoute', 'angularCharts'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'TrackerCtrl'
  });
}])

ngModule.controller('TrackerCtrl', [
  '$scope',
  '$http',
  '$window',
  '$templateCache',
  function($scope, $http, $window, $templateCache) {
    $scope.reviewData = null;
    $scope.method = 'GET';
    $scope.url = 'https://secure.reviewtrackers.com/api/locations/18598/reviews?api_token=274b859d23b5e2778b46&sort=publishDate&order=desc&per_page=100&page=1';
    $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
      success(function(data, status, filter) {
        console.log(data);
        $scope.status = status;
        $scope.locationName = data.locationName;
        $scope.reviewData = data.reviews;
      }).
      error(function(data, status) {
        $scope.reviewData = data || "Request failed";
        $scope.data = {
        }
        $scope.status = status;
    });

//  working urls
    // URL = https://secure.reviewtrackers.com/api/locations/18598/reviews?api_token=274b859d23b5e2778b46&sort=publishDate&order=desc&per_page=50&page=1
    // URL = 'http://private-anon-5bbbfaa14-reviewtrackers.apiary-mock.com/api/sites?api_token=274b859d23b5e2778b46&page=1&per_page=50';
    $scope.setSiteData = function(){

      $scope.showReviews = true;
      var sites = [
          {name:'Cars', reviews:0, data:{}},
          {name:'Google',reviews:0, data:{}},
          {name:'yelp', reviews:0, data:{}},
          {name:'Citysearch', reviews:0, data:{}},
          {name:'other', reviews:0, data:{}},
        ];

      for(var i = 0; i < $scope.reviewData.length; i++){
        switch($scope.reviewData[i].siteName){
          case "Cars":
            sites[0].reviews++;
            sites[0].data = sites[0];
            break;
          case "Google":
            sites[1].reviews++;
            sites[0].data = sites[0];
            break;
          case "yelp":
            sites[2].reviews++;
            sites[0].data = sites[0];
            break;
          case "Citysearch":
            sites[3].reviews++;
            sites[0].data = sites[0];
            break;
          default:
            sites[4].reviews++;
            sites[0].data = sites[0];
        }
      }
      $scope.config = {
        title: 'Reviews by Site',
        tooltips: true,
        labels: false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {},
        legend: {
          display: true,
          //could be 'left, right'
          position: 'right'
        }
      };
      $scope.data = {
        series: ['Cars', 'Google', 'yelp', 'Citysearch', 'other'],
        data: [{
          x: "Cars",
          y: [sites[0].reviews]
        }, {
          x: "Google",
          y: [sites[1].reviews]
        }, {
          x: "yelp",
          y: [sites[2].reviews]
        }, {
          x: "Citysearch",
          y: [sites[3].reviews]
        }, {
          x: "other",
          y: [sites[4].reviews]
        }]
      };
    }

    $scope.setData = function(reviews){
      $scope.config = {
        title: 'Reviews : Overall score = ' + $scope.overallScore,
        tooltips: true,
        labels: false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {},
        legend: {
          display: true,
          //could be 'left, right'
          position: 'right'
        }
      };
      $scope.data = {
        series: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
        data: [{
          x: "1 Star",
          y: [reviews[0]]
        }, {
          x: "2 Star",
          y: [reviews[1]]
        }, {
          x: "3 Star",
          y: [reviews[2]]
        }, {
          x: "4 Star",
          y: [reviews[3]]
        }, {
          x: "5 Star",
          y: [reviews[4]]
        }]
      };
    }
    $scope.fetch = function() {
      $scope.showReviews = true;
      $scope.code = null;
      $scope.response = null;
      var reviews = [0,0,0,0,0];
      $scope.totalReviews = $scope.reviewData.totalReviews;

      var reviewTotal = 0;
      for(var i = 0; i < $scope.reviewData.length; i++){
        switch($scope.reviewData[i].rating){
          case 5:
            reviews[4]++;
            break;
          case 4:
            reviews[3]++;
            break;
          case 3:
            reviews[2]++;
            break;
          case 2:
            reviews[1]++;
            break;
          default:
            reviews[0]++;
          }
        reviewTotal += $scope.reviewData[i].rating;
      }
      $scope.overallScore = reviewTotal / 50;
      $scope.setData(reviews);
      $scope.reviews = $scope.reviewData;
    };

    $scope.bySiteName = function(value){
      for(var i = 0; i< $scope.reviewData.length; i++){
        if(($scope.reviewData[i].siteName.toUpperCase() === value.toUpperCase()) || (value.toUpperCase() === 'OTHER' && $scope.reviewData[i].siteNametoUpperCase())){
          $scope.filteredData.push($scope.reviewData[i]);
        }
      }
    }
    $scope.byDate = function(value){
      $scope.filteredData = $scope.reviewData;
      if(value === ">"){
        $scope.filteredData.sort(function(a,b){
          return new Date(b.date) - new Date(a.date);
        });
      } else {
        $scope.filteredData.sort(function(a,b){
          return new Date(a.date) - new Date(b.date);
        });
      }
    }
    $scope.filterBy = function(filter, value){
      $scope.filteredData = [];
      $scope.filterValue = "";
      if(filter === 'google,yelp,...,all'){
        return $scope.bySiteName(value);
      } else if (filter === '>or<'){
        return $scope.byDate(value);
      }else{
        if(value === 'all' || value === 'All'){
          return $scope.filteredData = $scope.reviewData;
        }
        for(var i = 0; i< $scope.reviewData.length; i++){
          if($scope.reviewData[i].rating === parseInt(value)){
            $scope.filteredData.push($scope.reviewData[i]);
          }
        }
      }
    }

    $scope.getReview = function(review){
      var index = document.querySelector("[name=filterValueList]").selectedIndex;
      $scope.reviewDisplay = "";
      $scope.currentReview = $scope.filteredData[index];
    }

}]);

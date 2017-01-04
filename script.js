var app = angular.module("Gflick", ['uiGmapgoogle-maps']);



app.controller("flicker", function($http,$scope,$scope, $log, $timeout,$anchorScroll,$location){
    var page = '10';
    var base = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key=';
    var api_key = '2d18b4b58397e0f73968ee0755a79a5c';
    var auth_token = '72157677278492840-779808da05e88571';
    var api_sig = '4cd9fd8791897029628b06ebe838f837';
    var lat = '37.7994';
    var lon = '122.3950';
    var url = base + api_key +'&per_page=50&page='+page+'&format=json&nojsoncallback=1&lat='+ lat +'&lon=' + lon ;
    // var url = base + api_key +'&per_page=50&page='+page+'&format=json&nojsoncallback=1';
    //$log.log(url);

      //  fet images with default lat long
    $http.get(url).success(function(data){
       $scope.photos = data.photos.photo;
       $scope.pages = data.photos.pages;

    });

    // for pagination
    $scope.next = function(){
        page++;
        var url = base + api_key +'&per_page=50&page='+page+'&format=json&nojsoncallback=1&lat='+ lat +'&lon=' + lon ;
        //$log.log(url);
        $http.get(url).success(function(data){
           $scope.photos = data.photos.photo;
           $scope.pages = data.photos.pages;
            $('.photo').animate().scrollLeft(0);
        });
    },

    // For map

    $scope.map = {center: {latitude: 43.14351298090284, longitude: -100.84718750000002 }, zoom: 4};
    $scope.options = {scrollwheel: false};
    $scope.coordsUpdates = 0;
    $scope.dynamicMoveCtr = 0;

    // For marker
    $scope.marker = {
     id: 0,
     coords: {
       latitude: 43.14351298090284,
       longitude: -100.84718750000002
     },
     options: { draggable: true },
     //  Marker events
     events: {
       dragend: function (marker, eventName, args) {
         //$log.log('marker dragend');
         var lat = marker.getPosition().lat(); //check for latest lat
         var lon = marker.getPosition().lng(); //check for latest long
         //$log.log(lat);
         //$log.log(lon);

         //Update url based on lat lang
         var url = base + api_key +'&per_page=50&page='+page+'&format=json&nojsoncallback=1&lat='+ lat +'&lon=' + lon ;
        //  $log.log(url);

        //  again fetch images with updated lat lang
         $http.get(url).success(function(data){
              $scope.photos = data.photos.photo;
         });

        // for enable draging marker from one pplace to another and some other class
         $scope.marker.options = {
           draggable: true,
           labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
           labelAnchor: "100 0",
           labelClass: "marker-labels"
         };
       }
     }
    };

    //for checking how many times you have drag the marker
    $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
     if (_.isEqual(newVal, oldVal))
       return;
     $scope.coordsUpdates++;
    });

});

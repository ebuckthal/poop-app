//Setting up route
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

   $routeProvider.when('/', { 
      templateUrl: 'views/index.html' 
   }).otherwise( {
      redirectTo: '/'
   });;

   $locationProvider.html5Mode(true).hashPrefix('!');

}]);

var app = angular.module('poop-app', ['ui.bootstrap', 'ui.router']);

app.config(function ($stateProvider, $urlRouterProvider) {
   $stateProvider
      .state('home', {
         url: '/',
         templateUrl: 'views/home.html'
      })
      .state('leaderboards', {
         url: '/leaderboards',
         templateUrl: 'views/leaderboards.html'
      })
      .state('play', {
         abstract: true,
         url: '/play',
         template: '<ui-view>',
      })
      .state('play.id', {
         url: '/{gameId:[0-9]{1,4}}',
         templateUrl: 'views/play.html',
         controller: ['$scope', '$stateParams',
            function ($scope, $stateParams) {
               $scope.gameId = $stateParams.gameId;
               $scope.datas = [0,1,2,3,4,5,6,7,8,9];

               $scope.row_start = [0,1,2,3,4,5,6,7,8,9];
               $scope.col_start = [0,1,2,3,4,5,6,7,8,9];

               $scope.row_cur = [0,1,2,3,4,5,6,7,8,9];
               $scope.col_cur = [0,1,2,3,4,5,6,7,8,9];

               $scope.g_row = -1;
               $scope.g_col = -1;
            }
         ]
      })
   ;

   $urlRouterProvider
      .otherwise('/');

});

app.factory('Global', function() {
   var current_user = window.user;
      return {
         currentUser: function() {
            return current_user;
         },
         isSignedIn: function() {
            return !!current_user;
         }
      };
});


app.controller('HeaderController', ['$scope', 'Global',
   function($scope, Global) {
      $scope.global = Global;
      $scope.navbarEntries = [
         {
            "title": "Leaderboards",
            "link": "leaderboards"
         },
         {
            "title": "About",
            "link": "about"
         }
      ];
   }]
);

app.directive('snap', function() {
   return function($scope, element, attrs) {

      var cells = [];
      var last_x = 0;
      var start_x = 0;
      var sel_col = -1;
      var sel_row = -1;
      var rows = $scope.datas.length;
      var cols = $scope.datas.length;

      function drawCol(c, t, x) {
         x = (typeof x === "undefined") ? $scope.col_cur.indexOf(c)*60+1 : x;
         t = (typeof t === "undefined") ? 0 : t;

         for(var j = 0; j < rows; j++) {
            cells[c][j].animate({
               x: x 
            }, t); 
         }
      }

      function drawRow(r, t, y) {
         y = (typeof y === "undefined") ? $scope.row_cur.indexOf(r)*60+1 : y;
         t = (typeof t === "undefined") ? 0 : t;

         for(var i = 0; i < cols; i++) {
            cells[i][r].animate({
               y: y
            }, t);
         }
      }

      function boardToCell(c, r) {
         return cells[$scope.col_cur[c]][$scope.row_cur[r]];
      }

      function colToX(col) {
         return Math.max(0, Math.min(col*60+1, 600));
      }

      function rowToY(row) {
         return Math.max(0, Math.min(row*60+1, 600));
      }

      function xToCol(x) {
         return Math.floor(Math.min(9, Math.max(0, (x-1)/60)));
      }

      function yToRow(y) {
         return Math.floor(Math.min(9, Math.max(0, (y-1)/60)));
      }

      function grab(mouse_x,mouse_y) {

         start_x = mouse_x - document.getElementsByTagName("svg")[0].offsetLeft;
         start_y = mouse_y - document.getElementsByTagName("svg")[0].offsetTop;

         last_x = start_x;
         last_y = start_y;

         sel_col = $scope.col_cur[xToCol(start_x)];
         sel_row = $scope.row_cur[yToRow(start_y)];

      }

      function drop() {

         if(sel_col > 0) {
            drawCol(sel_col);
         }

         if(sel_row > 0) {
            drawRow(sel_row);
         }

         sel_col = -1;
         sel_row = -1;
      }

      function updateCells(dx, dy, mouse_x, mouse_y) {

         //set selected to my pos
         var x = start_x + dx;
         var y = start_y + dy;

         var cur_col = xToCol(x);
         var prev_col = xToCol(last_x);

         var cur_row = yToRow(y);
         var prev_row = yToRow(last_y);

         if(sel_col > -1 && cur_col != prev_col) {
            console.log("swapping columns!");
            console.log($scope.col_cur);

            var tmp = $scope.col_cur[prev_col];
            $scope.col_cur[prev_col] = $scope.col_cur[cur_col]; 
            $scope.col_cur[cur_col] = tmp;

            //redraw what we just were hovering over
            drawCol($scope.col_cur[prev_col], 100);
         }

         if(sel_row > -1 && cur_row != prev_row) {
            console.log("swapping rows!");
            console.log($scope.row_cur);

            var tmp = $scope.row_cur[prev_row];
            $scope.row_cur[prev_row] = $scope.row_cur[cur_row]; 
            $scope.row_cur[cur_row] = tmp;

            //redraw what we just were hovering over
            drawRow($scope.row_cur[prev_row], 100);
         }


         drawCol(sel_col, 0, x-29);
         drawRow(sel_row, 0, y-29);
         last_x = x;
         last_y = y;
      }


      //SNAP ELEMENTS
   
      var s = Snap(element[0]);

      var bg = s.rect(0,0,600,600);

      var p = s.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
         fill: "none",
         stroke: "#bada55",
         strokeWidth: 5
      });
      p = p.pattern(0,0,10,10);

      bg.attr({
         fill: p
      });


      for(var i = 0; i < cols; i++) {

         cells[i] = [];

         for(var j = 0; j < rows; j++) {
            cells[i][j] = s
               .rect(i*60+2, j*60+2, 57, 57)
               .attr({
                  fill: "#" + (55 * (1+i+j))
               })
               .mouseover( function() {

               })
               .mouseout( function() {

               })
               .drag(
                  function(dx,dy,x,y) { //onmove
                     updateCells(dx,dy,x,y);
                  },
                  function(x,y) { //onstart
                     grab(x,y);
                  },
                  function() { //onend
                     drop();
                  }
               );
         }
      }
   }
});

angular.bootstrap(document, ['poop-app']);

// bundling dependencies
//window.angular.module('ngff.controllers', ['ngff.controllers.header','ngff.controllers.index']);
//window.angular.module('ngff.services', ['ngff.services.global',]);

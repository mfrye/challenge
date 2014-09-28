(function(){
  'use strict';


  angular.module('challenge-main',['ngRoute'])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'main/main.html',
          controller: 'MainCtrl'
        });
    })

    .controller('MainCtrl', function ($scope, $famous, $timeout) {
      var PhysicsEngine = $famous['famous/physics/PhysicsEngine'];
      var Circle = $famous['famous/physics/bodies/Circle'];
      var Wall = $famous['famous/physics/constraints/Wall'];
      var Walls = $famous['famous/physics/constraints/Walls'];

      var CIRCLES = 1;
      var RADIUS = 40;
      var WIDTH = 800;
      var HEIGHT = 600;
      var COLORS = ["#b58900"];
      var SPEED_INCREASE = 0.01

      var running = false;
      var timer;
      var speedTimer;
      $scope.score = 0;

      function addScore() {
        timer = $timeout(function() {
          $scope.score = $scope.score + 100;
          addScore();
        }, 100);
      }

      function increaseSpeed() {
        var circle = $scope.circles[0];
        speedTimer = $timeout(function() {
          var speed = circle.getVelocity();
          var s1 = speed[0];
          var s2 = speed[1];

          var new_s1 = s1 > 0 ? s1 + SPEED_INCREASE : s1 - SPEED_INCREASE;
          var new_s2 = s2 > 0 ? s2 + SPEED_INCREASE : s2 - SPEED_INCREASE;

          circle.setVelocity([new_s1, new_s2, 0]);
          increaseSpeed();
        }, 1000)
        
      }


      $scope.colorMap = {};

      var physicsEngine = new PhysicsEngine();

      // TODO: have multiple circles colliding into each other
      $scope.circles = _.map(_.range(CIRCLES), function(i){
        var circ = new Circle({
          radius: RADIUS,
          position: [Math.random() * WIDTH, Math.random() * HEIGHT]
        });
        physicsEngine.addBody(circ);
        circ.show = true;
        circ._id = Math.random();
        $scope.colorMap[circ._id] = _.sample(COLORS);
        return circ;
      });

      $scope.startGame = function(circle) {
        if (!running) {
          running = true;
          circle.setVelocity([0.05,0.05,0]);
          addScore();
          increaseSpeed();
        } 
      };

      $scope.mouseLeave = function(circle) {
        if (running) {
          running = false;
          circle.setVelocity([0,0,0]);

          // Stop timers
          $timeout.cancel(timer);
          $timeout.cancel(speedTimer);

          // Show / reset score
          alert('Your score was ' + $scope.score + '!');
          $scope.score = 0;
        }
      };

      //set up walls
      var leftWall    = new Wall({normal : [1,0,0],  distance : 0, restitution : 1});
      var rightWall   = new Wall({normal : [-1,0,0], distance : WIDTH, restitution : 1});
      var topWall     = new Wall({normal : [0,1,0],  distance : 0, restitution : 1});
      var bottomWall  = new Wall({normal : [0,-1,0], distance : HEIGHT, restitution : 1});

      var walls = [topWall, rightWall, bottomWall, leftWall];
      physicsEngine.attach(walls, $scope.circles);

    });

})();
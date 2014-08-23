'use strict';

var sinOnRange = function(range) {
  return range / 2 + (range / 2) * Math.sin(new Date().getTime() / 200);
};

angular.module('angularPathsExample', ['paths'])
  .controller('PieCtrl', function($scope, $interval) {
    $scope.pie = {
      data: [
        { name: 'Italy', population: 59859996 },
        { name: 'Mexico', population: 118395054 },
        { name: 'France', population: 65806000 },
        { name: 'Argentina', population: 50117096 },
        { name: 'Japan', population: 127290000 }
      ],
      accessor: function(x) { return x.population; }
    };

    $interval(function() {
      $scope.pie.data[0].population = sinOnRange(59859996);
    }, 100);
  })
  .controller('BarCtrl', function($scope, $interval) {
    $scope.bar = {
      data: [
        [
          { name: 'Italy', population: 59859996 },
          { name: 'Spain', population: 46704314 },
          { name: 'France', population: 65806000 },
          { name: 'Romania', population: 20121641 },
          { name: 'Greece', population: 10815197 }
        ],
        [
          { name: 'Zambia', population: 14580290 },
          { name: 'Cameroon', population: 20386799 },
          { name: 'Nigeria', population: 173615000 },
          { name: 'Ethiopia', population: 86613986 },
          { name: 'Ghana', population: 24658823 }
        ]
      ],
      accessor: function(x) { return x.population; },
      gutter: 10
    };

    $interval(function() {
      $scope.bar.data[0][0].population = sinOnRange(59859996);
    }, 100);
  })
  .controller('StockCtrl', function($scope, $interval) {
    $scope.stock = {
      data: [
        [
          { year: 2012, month: 1, value: 13 },
          { year: 2012, month: 2, value: 12 },
          { year: 2012, month: 3, value: 15 }
        ],
        [
          { year: 2012, month: 1, value: 21 },
          { year: 2012, month: 2, value: 22 },
          { year: 2012, month: 3, value: 22 }
        ]
      ],
      xaccessor: function(data) {
        var d = new Date();
        d.setYear(data.year);
        d.setMonth(data.month - 1);
        return d.getTime();
      },
      yaccessor: function(d) { return d.value; },
      closed: true
    };

    $interval(function() {
      $scope.stock.data[0][0].value = sinOnRange(13);
    }, 100);
  })
  .controller('SmoothLineCtrl', function($scope, $interval) {
    $scope.smoothLine = {
      data: [
        [
          { year: 2012, month: 1, value: 13 },
          { year: 2012, month: 2, value: 12 },
          { year: 2012, month: 3, value: 15 }
        ],
        [
          { year: 2012, month: 1, value: 21 },
          { year: 2012, month: 2, value: 22 },
          { year: 2012, month: 3, value: 22 }
        ]
      ],
      xaccessor: function(data) {
        var d = new Date();
        d.setYear(data.year);
        d.setMonth(data.month - 1);
        return d.getTime();
      },
      yaccessor: function(d) { return d.value; },
      closed: true
    };

    $interval(function() {
      $scope.smoothLine.data[0][0].value = sinOnRange(13);
    }, 100);
  })
  .controller('RadarCtrl', function($scope, $interval) {
    $scope.radar = {
      data: [
        { hp: 45, attack: 49, defense: 80, sp_attack: 65, sp_defense: 65, speed: 45 },
        { hp: 60, attack: 62, defense: 63, sp_attack: 80, sp_defense: 80, speed: 60 },
        { hp: 80, attack: 82, defense: 83, sp_attack: 100, sp_defense: 100, speed: 80 },
        { hp: 45, attack: 25, defense: 50, sp_attack: 25, sp_defense: 25, speed: 35 }
      ],
      accessor: {
        attack: function(x) { return x.attack; },
        defense: function(x) { return x.defense; },
        speed: function(x) { return x.speed; },
        hp: function(x) { return x.hp; },
        sp_attack: function(x) { return x.sp_attack; },
      },
      rings: 5
    };

    $interval(function() {
      $scope.radar.data[0].attack = sinOnRange(49);
    }, 100);
  });
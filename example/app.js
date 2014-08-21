'use strict';

angular.module('angularPathsExample', ['paths'])
  .controller('PieCtrl', function($scope) {
    $scope.pie = {
      data: [
        { name: 'Italy', population: 59859996 },
        { name: 'Mexico', population: 118395054 },
        { name: 'France', population: 65806000 },
        { name: 'Argentina', population: 40117096 },
        { name: 'Japan', population: 127290000 }
      ],
      accessor: function(x) { return x.population; }
    };
  });
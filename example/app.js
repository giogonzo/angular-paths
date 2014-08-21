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
  })
  .controller('BarCtrl', function($scope) {
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
  })
  .controller('StockCtrl', function($scope) {
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
  });
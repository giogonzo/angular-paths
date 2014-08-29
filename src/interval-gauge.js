'use strict';

angular.module('paths.IntervalGauge', []).constant('IntervalGauge', {
  graph: 'IntervalGauge',
  defaults: function(viewport) {
    return {
      width: viewport.innerWidth,
      height: viewport.innerHeight
    };
  }
});
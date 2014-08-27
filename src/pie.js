'use strict';

angular.module('paths.Pie', []).constant('Pie', {
  graph: 'Pie',
  defaults: function(viewport) {
    return {
      center: [viewport.innerWidth / 2, viewport.innerHeight / 2],
      r: 0,
      R: Math.min(viewport.innerWidth, viewport.innerHeight) / 2
    };
  }
});
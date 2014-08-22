'use strict';

angular.module('paths.Pie', []).constant('Pie', {
  graph: 'Pie',
  defaults: function(viewport) {
    return {
      center: [viewport.width / 2, viewport.height / 2],
      r: 0,
      R: Math.min(viewport.width, viewport.height) / 2
    };
  }
});
'use strict';

angular.module('paths.Radar', []).constant('Radar', {
  graph: 'Radar',
  defaults: function(viewport) {
    return {
      center: [viewport.innerWidth / 2, viewport.innerHeight / 2],
      r: Math.min(viewport.innerWidth, viewport.innerHeight) / 2
    };
  }
});
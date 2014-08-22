'use strict';

angular.module('paths.Bar', []).constant('Bar', {
  graph: 'Bar',
  defaults: function(viewport) {
    return {
      width: viewport.width,
      height: viewport.height
    };
  }
});
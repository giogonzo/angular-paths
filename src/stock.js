'use strict';

angular.module('paths.Stock', []).constant('Stock', {
  graph: 'Stock',
  defaults: function(viewport) {
    return {
      width: viewport.innerWidth,
      height: viewport.innerHeight
    };
  }
});
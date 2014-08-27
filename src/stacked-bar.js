'use strict';

angular.module('paths.StackedBar', []).constant('StackedBar', {
  graph: 'StackedBar',
  defaults: function(viewport) {
    return {
      width: viewport.innerWidth,
      height: viewport.innerHeight
    };
  }
});

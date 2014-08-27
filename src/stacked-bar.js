'use strict';

angular.module('paths.StackedBar', []).constant('StackedBar', {
  graph: 'StackedBar',
  defaults: function(viewport) {
    return {
      width: viewport.width,
      height: viewport.height
    };
  }
});

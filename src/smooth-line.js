'use strict';

angular.module('paths.SmoothLine', []).constant('SmoothLine', {
  graph: 'SmoothLine',
  defaults: function(viewport) {
    return {
      width: viewport.width,
      height: viewport.height
    };
  },
  selectedItem: 'smoothLine'
});
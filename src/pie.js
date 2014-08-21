'use strict';

angular.module('paths.Pie', []).constant('Pie', {
  graph: 'Pie',
  defaults: function(viewport) {
    return {
      center: [viewport.width / 2, viewport.height / 2],
      r: 0,
      R: Math.min(viewport.width, viewport.height) / 2
    };
  },
  template: [
    '<svg ',
      'ng-attr-width="{{viewport.width}}" ',
      'ng-attr-height="{{viewport.height}}" ',
      'ng-attr-transform="translate({{viewport.width / 2}}, {{viewport.height / 2}})">',

      '<path ng-repeat="curve in curves" ',
        'ng-attr-d="{{curve.sector.path.print()}}" ',
      '/>',

    '</svg>'
  ].join('')
});
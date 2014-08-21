'use strict';

angular.module('paths.Bar', []).constant('Bar', {
  graph: 'Bar',
  defaults: function(viewport) {
    return {
      width: viewport.width,
      height: viewport.height
    };
  },
  template: [
    '<svg ',
      'ng-attr-width="{{viewport.width}}" ',
      'ng-attr-height="{{viewport.height}}">',

      '<path ng-repeat="curve in curves" ',
        'ng-attr-d="{{curve.line.path.print()}}" ',
      '/>',

    '</svg>'
  ].join('')
});
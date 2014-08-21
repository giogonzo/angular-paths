'use strict';

angular.module('paths.Stock', []).constant('Stock', {
  graph: 'Stock',
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

      '<path ',
        'ng-attr-d="{{stock.line.path.print()}}" ',
        'stroke="black" ',
        'fill="none" ',
      '/>',

      '<path ',
        'ng-attr-d="{{stock.area.path.print()}}" ',
        'stroke="none" ',
        'fill="black" ',
      '/>',

    '</svg>'
  ].join('')
});
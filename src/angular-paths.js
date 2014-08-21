'use strict';

(function() {
var angularPaths = angular.module('paths', []);
var prefix = 'paths';

[{
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
}].forEach(function(dir) {
  var fullName = prefix + dir.graph;
  angularPaths.directive(fullName, function($compile) {
    var self = {
      scope: {}
    };
    self.scope[fullName] = '=';
    return angular.extend(self, {
      restrict: 'AE',
      link: function(scope, element, attributes) {
        var init = function() {
          scope.$watch(fullName, function(source, oldSource) {
            if (!!source && !!source.data) {
              scope.curves = paths[dir.graph](
                angular.extend(source, dir.defaults(scope.viewport))
              ).curves;
            }
          }, true);

          var contents = angular.element(dir.template);
          $compile(contents)(scope);
          element.append(contents);
        };

        scope.$watchCollection(function() {
          return {
            width: element.width(),
            height: element.height()
          };
        }, function(viewport, oldViewport) {
          if (!!viewport.width && !!viewport.height) {
            scope.viewport = viewport;
            if (!!oldViewport) {
              init();
            }
          }
        });
      }
    });
  });
});
})();
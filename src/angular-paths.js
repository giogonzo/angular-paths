'use strict';

angular.module('paths', [
  'paths.Pie',
  'paths.Bar',
  'paths.Stock'
]).config(function($compileProvider, Pie, Bar, Stock) {
  [
    Pie,
    Bar,
    Stock
  ].forEach(function(dir) {
    var name = 'paths' + dir.graph;

    $compileProvider.directive(name, function($compile) {
      var self = {
        scope: {}
      };
      self.scope[name] = '=';

      return angular.extend(self, {
        restrict: 'AE',
        link: function(scope, element, attributes) {

          var init = function() {
            scope.$watch(name, function(source, oldSource) {
              if (!!source && !!source.data) {
                scope.curves = paths[dir.graph](
                  angular.extend(dir.defaults(scope.viewport), source)
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
});

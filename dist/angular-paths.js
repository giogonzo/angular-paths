'use strict';

angular.module('paths', [
  'getTemplate',
  'paths.PathsProvider',
  'paths.Pie',
  'paths.Bar',
  'paths.Stock',
  'paths.SmoothLine'
]).config(["PathsProvider", "$compileProvider", "Pie", "Bar", "Stock", "SmoothLine", function(PathsProvider, $compileProvider, Pie, Bar, Stock, SmoothLine) {
  [
    Pie,
    Bar,
    Stock,
    SmoothLine
  ].forEach(function(dir) {
    var name = 'paths' + dir.graph,
      path = PathsProvider.Paths[dir.graph];

    $compileProvider.directive(name, function($compile, $getTemplate) {
      return {
        scope: true,
        replace: true,
        restrict: 'AE',
        link: function(scope, element, attributes) {
          var _graphCfg; // once-binded graph config

          var updateGraph = function() {
            scope.curves = path(_graphCfg).curves.map(function(curve) {
              return angular.extend(curve, {
                _line: !!curve.line ? curve.line.path.print() : undefined,
                _area: !!curve.area ? curve.area.path.print() : undefined,
                _sector: !!curve.sector ? curve.sector.path.print() : undefined
              });
            });
          };

          var startSizeWatch = function() {
            // keep watching until we get a valid DOM computed size
            // or stop right away if we have user provided dimensions
            var sizeWatchDereg = scope.$watchCollection(function() {
              return {
                width: element.width(),
                height: element.height()
              };
            }, function(viewport, oldViewport) {
              // ovveride with user sizes if available
              viewport = angular.extend(viewport, {
                width: (_graphCfg || {}).width || viewport.width,
                height: (_graphCfg || {}).height || viewport.height
              });

              if (!!viewport.width && !!viewport.height) {
                scope.viewport = viewport;

                if (!!oldViewport) {
                  init();
                }

                if (!!_graphCfg && !!_graphCfg.width && !!_graphCfg.height) {
                  // stop watching since we are using
                  // user's dimensions
                  sizeWatchDereg();
                }
              }
            });
          };

          var init = function() {
            var scopeName = attributes[name];
            var initWatchDereg = scope.$watch(scopeName, function(graphCfg) {
              if (!!graphCfg && !!graphCfg.data) {
                // stop watching the whole config
                initWatchDereg();
                _graphCfg = angular.extend(dir.defaults(scope.viewport), graphCfg);

                // set up a deep watch for 'data' only
                scope.$watch(scopeName + '.data', function(data) {
                  // redraw
                  _graphCfg.data = data;
                  updateGraph();
                // TODO: check whether it makes sense to optimize
                // this with a $watchCollection
                // on 1 (more?) nesting levels
                }, true);

                // handle 'template' option
                var templateOrUrl = !!_graphCfg && !!_graphCfg.template ? _graphCfg.template : attributes.pathsTemplate;
                if (!!templateOrUrl) {
                  $getTemplate(templateOrUrl).then(function(template) {
                    var contents = angular.element(template);
                    $compile(contents)(scope);
                    element.html(contents);
                  });
                }

                // first draw
                updateGraph();
              }
            });
          };

          startSizeWatch();
        }
      };
    });
  });
}]);

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
'use strict';

angular.module('paths.PathsProvider', []).provider('Paths', function() {
  return {
    Paths: paths,
    $get: function() {
      return paths;
    }
  };
});
'use strict';

angular.module('paths.Pie', []).constant('Pie', {
  graph: 'Pie',
  defaults: function(viewport) {
    return {
      center: [viewport.width / 2, viewport.height / 2],
      r: 0,
      R: Math.min(viewport.width, viewport.height) / 2
    };
  }
});
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
'use strict';

angular.module('paths.Stock', []).constant('Stock', {
  graph: 'Stock',
  defaults: function(viewport) {
    return {
      width: viewport.width,
      height: viewport.height
    };
  },
  selectedItem: 'stock'
});
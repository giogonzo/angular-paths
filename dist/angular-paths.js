(function(angular) {
'use strict';

angular.module('paths', [
  'getTemplate',
  'paths.PathsProvider',
  'paths.Pie',
  'paths.Bar',
  'paths.Stock',
  'paths.SmoothLine',
  'paths.Radar',
  'paths.IntervalGauge'
]).config(["PathsProvider", "$compileProvider", "Pie", "Bar", "Stock", "SmoothLine", "Radar", "IntervalGauge", function(PathsProvider, $compileProvider, Pie, Bar, Stock, SmoothLine, Radar, IntervalGauge) {
  [
    Pie,
    Bar,
    Stock,
    SmoothLine,
    Radar,
    IntervalGauge
  ].forEach(function(dir) {
    var name = 'paths' + dir.graph;

    var print = function(prop) {
      return function(curve) {
        var printed = {};
        printed['_' + prop] = !!curve[prop] || !!curve.path ? (curve[prop] || curve).path.print() : undefined;
        return angular.extend(curve, printed);
      };
    };
    var printLine = print('line');
    var printArea = print('area');
    var printSector = print('sector');
    var printPolygon = print('polygon');

    var scaleStepWith = function(scaleFn) {
      return function(step) {
        return {
          value: step.value,
          position: scaleFn(step.position)
        };
      };
    };

    $compileProvider.directive(name, /*@ngInject*/ ["$compile", "$getTemplate", "Paths", function($compile, $getTemplate, Paths) {
      return {
        scope: true,
        replace: true,
        restrict: 'AE',
        link: function(scope, element, attributes) {
          var _graphCfg, // once-binded graph config
            measuredSize,
            sizeWatchDereg;

          var updateGraph = function() {
            var graph = Paths[dir.graph](_graphCfg);
            scope.curves = (graph.curves || []).map(printLine).map(printArea).map(printSector).map(printPolygon);
            scope.rings = (graph.rings || []).map(printPolygon);

            scope.x = graph.x;
            scope.y = graph.y;

            scope.scale = graph.scale;
            scope.xscale = graph.xscale || graph.scale;
            scope.yscale = graph.yscale || graph.scale;

            if (!!scope.x && !!scope.xscale) {
              scope._x = scope.x.map(scaleStepWith(scope.xscale));
            }
            if (!!scope.y && !!scope.yscale) {
              scope._y = scope.y.map(scaleStepWith(scope.yscale));
            }
          };

          var startSizeWatch = function() {
            // keep watching until we get a valid DOM computed size
            // or stop right away if we have user provided dimensions
            sizeWatchDereg = scope.$watchCollection(function() {
              return {
                width: element[0].offsetWidth,
                height: element[0].offsetHeight
              };
            }, function(size) {
              measuredSize = size;

              if (!_graphCfg) {
                init();
              }
            });
          };

          var init = function() {
            var scopeName = attributes[name];
            scope.$watch(scopeName, function(graphCfg) {
              if (!!graphCfg && !!graphCfg.data) {
                // init viewport
                var viewport = {
                  width: graphCfg.width || measuredSize.width,
                  height: graphCfg.height || measuredSize.height,
                  paddingTop: graphCfg.paddingTop || graphCfg.padding || 0,
                  paddingRight: graphCfg.paddingRight || graphCfg.padding || 0,
                  paddingBottom: graphCfg.paddingBottom || graphCfg.padding || 0,
                  paddingLeft: graphCfg.paddingLeft || graphCfg.padding || 0
                };
                scope.viewport = angular.extend(viewport, {
                  innerWidth: viewport.width - viewport.paddingLeft - viewport.paddingRight,
                  innerHeight: viewport.height - viewport.paddingTop - viewport.paddingBottom
                });

                if (!_graphCfg) { // first run
                  // handle 'template' option
                  var templateOrUrl = !!graphCfg && !!graphCfg.template ? graphCfg.template : attributes.pathsTemplate;
                  if (!!templateOrUrl) {
                    $getTemplate(templateOrUrl).then(function(template) {
                      var contents = angular.element(template);
                      $compile(contents)(scope);
                      element.empty().append(contents);
                    });
                  }
                }

                // update config
                _graphCfg = angular.extend(dir.defaults(scope.viewport), graphCfg, {
                  width: viewport.innerWidth,
                  height: viewport.innerHeight
                });

                updateGraph();
              }
            }, true);
          };

          startSizeWatch();
        }
      };
    }]);
  });
}]);

'use strict';

angular.module('paths.Bar', []).constant('Bar', {
  graph: 'Bar',
  defaults: function(viewport) {
    return {
      width: viewport.innerWidth,
      height: viewport.innerHeight
    };
  }
});
'use strict';

angular.module('paths.IntervalGauge', []).constant('IntervalGauge', {
  graph: 'IntervalGauge',
  defaults: function(viewport) {
    return {
      width: viewport.innerWidth,
      height: viewport.innerHeight
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
      center: [viewport.innerWidth / 2, viewport.innerHeight / 2],
      r: 0,
      R: Math.min(viewport.innerWidth, viewport.innerHeight) / 2
    };
  }
});
'use strict';

angular.module('paths.Radar', []).constant('Radar', {
  graph: 'Radar',
  defaults: function(viewport) {
    return {
      center: [viewport.innerWidth / 2, viewport.innerHeight / 2],
      r: Math.min(viewport.innerWidth, viewport.innerHeight) / 2
    };
  }
});
'use strict';

angular.module('paths.SmoothLine', []).constant('SmoothLine', {
  graph: 'SmoothLine',
  defaults: function(viewport) {
    return {
      width: viewport.innerWidth,
      height: viewport.innerHeight
    };
  }
});
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
})(window.angular);
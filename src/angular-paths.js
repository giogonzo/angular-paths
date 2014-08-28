'use strict';

angular.module('paths', [
  'getTemplate',
  'paths.PathsProvider',
  'paths.Pie',
  'paths.Bar',
  'paths.StackedBar',
  'paths.Stock',
  'paths.SmoothLine',
  'paths.Radar'
]).config(function(PathsProvider, $compileProvider, Pie, Bar, StackedBar, Stock, SmoothLine, Radar) {
  [
    Pie,
    Bar,
    StackedBar,
    Stock,
    SmoothLine,
    Radar
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

    $compileProvider.directive(name, /*@ngInject*/ function($compile, $getTemplate, Paths) {
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
            _graphCfg = {}; // init
            var scopeName = attributes[name];
            var initWatchDereg = scope.$watch(scopeName, function(graphCfg) {
              if (!!graphCfg && !!graphCfg.data) {
                // stop watching the whole config
                initWatchDereg();

                if (!angular.isUndefined(_graphCfg.width) && !angular.isUndefined(_graphCfg.height)) {
                  // stop watching since we are using
                  // user's dimensions
                  sizeWatchDereg();
                }

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

                // init config using directive defaults
                _graphCfg = angular.extend(dir.defaults(scope.viewport), graphCfg, {
                  width: viewport.innerWidth,
                  height: viewport.innerHeight
                });

                // set up a deep watch for 'data' only
                scope.$watch(scopeName + '.data', function(data) {
                  // first draw + redraws
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
                    element.empty().append(contents);
                  });
                }
              }
            });
          };

          startSizeWatch();
        }
      };
    });
  });
});

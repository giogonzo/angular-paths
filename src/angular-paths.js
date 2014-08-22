'use strict';

angular.module('paths', [
  'getTemplate',
  'paths.Pie',
  'paths.Bar',
  'paths.Stock',
  'paths.SmoothLine'
]).config(function($compileProvider, Pie, Bar, Stock, SmoothLine) {
  [
    Pie,
    Bar,
    Stock,
    SmoothLine
  ].forEach(function(dir) {
    var name = 'paths' + dir.graph;

    $compileProvider.directive(name, function($compile, $getTemplate) {
      var scope = {};
      scope[name] = '=';

      return {
        scope: true,
        replace: true,
        restrict: 'AE',
        link: function(scope, element, attributes) {
          var _graphCfg; // once-binded graph config

          var updateGraph = function(graphConfig) {
            scope.curves = paths[dir.graph](
              angular.extend(dir.defaults(scope.viewport), graphConfig)
            ).curves;
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
                // TODO
                // if (!!dir.selectedItem && scope.curves.length > 0) {
                //   scope[dir.selectedItem] = scope.curves[0];
                // }

                // stop watching the whole config
                initWatchDereg();
                _graphCfg = graphCfg;

                // set up a deep watch for 'data' only
                scope.$watch(scopeName + '.data', function(data) {
                  // redraw
                  updateGraph(angular.extend(_graphCfg, {
                    data: data
                  }));
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
                updateGraph(_graphCfg);
              }
            });
          };

          startSizeWatch();
        }
      };
    });
  });
});

'use strict';

angular.module('paths.PathsProvider', []).provider('Paths', function() {
  return {
    Paths: paths,
    $get: function() {
      return paths;
    }
  };
});
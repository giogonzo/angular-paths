module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/paths-js/dist/global/paths.js',
      'bower_components/angular-get-template/dist/angular-get-template.js',
      'src/**/*.js',
      'test/spec/**/*.js'
    ],
    // exclude: [],
    port: 8080,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome']
  });
};

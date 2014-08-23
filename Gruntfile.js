'use strict';

module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/{,*/}*.js'
      ]
    },

    clean: {
      dist: {
        files: [{
          src: ['dist']
        }]
      },
      example: {
        files: [{
          src: 'example/lib/*'
        }]
      }
    },

    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: 'angular-paths.js',
          dest: 'dist'
        }]
      }
    },

    concat: {
      options: {
         banner: '(function (angular) {\n',
        footer: '})(window.angular);'
      },
      dist: {
        dest: 'dist/angular-paths.js',
        src: ['src/{,*/}*.js']
      },
    },

    copy: {
      example: {
        files: [{
          expand: true,
          cwd: 'bower_components/angular/',
          dest: 'example/lib/',
          src: 'angular.js'
        }, {
          expand: true,
          cwd: 'bower_components/paths-js/dist/global/',
          dest: 'example/lib/',
          src: 'paths.js'
        }, {
          expand: true,
          cwd: 'bower_components/angular-get-template/dist/',
          dest: 'example/lib/',
          src: 'angular-get-template.js'
        }, {
          expand: true,
          cwd: 'dist/',
          dest: 'example/lib/',
          src: 'angular-paths.js'
        }]
      }
    },

    watch: {
      js: {
        files: [
          'src/{,*/}*.js'
        ],
        tasks: ['example'],
      }
    },
  });

  grunt.registerTask('build', [
    'newer:jshint',
    'clean:dist',
    'concat:dist',
    'ngAnnotate'
  ]);

  grunt.registerTask('example', [
    'build',
    'clean:example',
    'copy:example'
  ]);

  grunt.registerTask('watch-example', [
    'example',
    'watch'
  ]);

  grunt.registerTask('default', ['build']);
};

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: '<%= pkg.main %>/<%= pkg.name %>.js',
        dest: '<%= pkg.bin.cconsole %>'
      }
    },
    jshint: {
      dev : ['tasks/hashfilter.js']
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadTasks('./grunt/tasks');
  grunt.loadNpmTasks('jshint')

  // Default task(s).
  grunt.registerTask('default', ['jshint']);

};
/*global module:false*/
module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    // pkg: grunt.file.readJSON('package.json'),
    // banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
    //   '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
    //   '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
    //   '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
    //   ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    // concat: {
    //   options: {
    //     banner: '<%= banner %>',
    //     stripBanners: true
    //   },
    //   dist: {
    //     src: ['lib/<%= pkg.name %>.js'],
    //     dest: 'dist/<%= pkg.name %>.js'
    //   }
    // },
    uglify: {
      // options: {
      //   banner: '<%= banner %>'
      // },
      dist: {
        src: '_site/js/index.js',
        dest: '_site/js/index.min.js'
      }
    },
    'string-replace': {
      'test-js': {
        files: {
          '_site/index.html': '_site/index.html',
        },
        options: {
          replacements: [
            {
              pattern: '<!-- <script src="/js/index.min.js"></script> -->',
              replacement: '<script src="/js/index.min.js"></script>'
            },{
              pattern: '<script src="/js/index.js"></script>',
              replacement: '<!-- <script src="/js/index.js"></script> -->'
            }
          ]
        }
      }
    },
    // watch: {
    //   gruntfile: {
    //     files: '<%= jshint.gruntfile.src %>',
    //     tasks: ['jshint:gruntfile']
    //   },
    //   lib_test: {
    //     files: '<%= jshint.lib_test.src %>',
    //     tasks: ['jshint:lib_test', 'qunit']
    //   }
    // },
    'jekyll': {
      'default': {}
    },
    'ftp-deploy': {
      arctour: {
        auth: {
          host: 'ftp.arctour.co.uk',
          port: 21,
          authKey: 'ben'
        },
        src: '_site',
        dest: '/subdomains/sessions'
      }
    }
  });

  // Default task.
  grunt.registerTask('default', [/*'concat',*/ 'uglify', 'string-replace', 'jekyll', 'ftp-deploy']);

};

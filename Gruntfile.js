var pkg = require('./package.json');

module.exports = function (grunt) {
  var exampleFile = grunt.option('src-file');
  
  grunt.initConfig({
        browserify: {
            lib: {
                src: pkg.main,
                dest: './dist/' + pkg.main,
                options: {
                    debug: true,
                    extensions: ['.js'],
                    transform: ["babelify"]
                }
            },
            example: {
                src: './examples/' + exampleFile,
                dest: './dist/' + exampleFile,
                options: {
                    debug: true,
                    extensions: ['.js'],
                    transform: ["babelify"]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-browserify");
    grunt.registerTask('build', ['browserify:lib']);
};
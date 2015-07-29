module.exports = function (grunt) {
    grunt.initConfig({

    // define source files and their destinations
    uglify: {
        files: { 
            src: 'public/*.js',  // source files mask
            dest: 'dist/',    // destination folder
            flatten: true,
            expand: true,    // allow dynamic building
            ext: '.min.js',   // replace .js to .min.js
            compress: true
        }
    },
    mochaTest: {
        test: {
            options: {
                reporter: "min"
            },
            src: [ "test/*.js" ]
        }
    },
    watch: {
        js:  { 
            files: [
                'public/*.js',
                'test/test.*.js'
            ], 
            tasks: [ 'mochaTest' ] 
        },
        uglify: {
            files: [
                'public/*.js'
            ],
            tasks: [ 'mochaTest', 'uglify']
        }
    }
});

// load plugins
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-mocha-test');

// register at least this one task
grunt.registerTask('default', [ 'uglify' ]);


};
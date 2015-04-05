module.exports = (grunt) ->

    # Showcase the time used by the task runner
    require('time-grunt') grunt

    # Project configuration.
    grunt.initConfig({

        # Reads the configs from package.json
        pkg: grunt.file.readJSON('package.json'),

        # Turns the style.scss file in a readable style.css file
        less: 
            frontend:
                options: 
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'style.css.map',
                    sourceMapFilename: '<%= pkg.core_styles %>/style.css.map'
                src: '<%= pkg.data_styles %>/base/bootstrap.less',
                dest: '<%= pkg.core_styles %>/style.css'
                    

        # Puts every .js file together in one file
        concat:
            frontend:
                files:
                    '<%= pkg.core_scripts %>/script.js': [
                        '<%= pkg.data_scripts %>/lib/jquery-1.11.1.min.js',
                        '<%= pkg.data_scripts %>/transition.js',
                        '<%= pkg.data_scripts %>/alert.js',
                        '<%= pkg.data_scripts %>/button.js',
                        '<%= pkg.data_scripts %>/carousel.js',
                        '<%= pkg.data_scripts %>/collapse.js',
                        '<%= pkg.data_scripts %>/dropdown.js',
                        '<%= pkg.data_scripts %>/modal.js',
                        '<%= pkg.data_scripts %>/tooltip.js',
                        '<%= pkg.data_scripts %>/popover.js',
                        '<%= pkg.data_scripts %>/scrollspy.js',
                        '<%= pkg.data_scripts %>/tab.js',
                        '<%= pkg.data_scripts %>/affix.js',
                        '<%= pkg.data_scripts %>/custom.js'
                    ]


    })

    # Load the plugins:
    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-less'

    # Default task(s).
    grunt.registerTask 'frontend-scripts', [
        'concat:frontend'
    ]
    grunt.registerTask 'frontend-styles', [
        'less:frontend'
    ]
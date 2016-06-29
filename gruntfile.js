module.exports = function(grunt) {

	grunt.initConfig({
		// Minify the CSS
		cssmin: {
			target: {
				files: [{
					src: ['src/material.min.css', 'src/styles.css'], dest: 'dist/result.min.css' }
				]}
		},
		// Rewrite the minifed stuff into the processed HTML file
		processhtml: {
			dist: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['*.html'],
					dest: './dist',
					ext: '.html'
				}]
			}
		},
		// Extract the critical CSS
		critical: {
			dist: {
				options: {
					base: './',
					css: [
                'dist/result.min.css'
            ],
					minify: true,
					dimensions: [{
						width: 1300,
						height: 900
					},
					{
						width: 500,
						height: 900
					}]
				},
				src: 'dist/index.html',
        dest: 'dist/index.html'
			}
		},
		// Copy all of the images across to dist
		copy: {
		  main: {
		    expand: true,
				flatten: true,
				 filter: 'isFile',
		    src: 'src/images/*',
		    dest: 'dist/images/',
		  }
		}
	});

grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-processhtml');
grunt.loadNpmTasks('grunt-critical');
grunt.loadNpmTasks('grunt-contrib-copy');

grunt.registerTask('default', ['cssmin', 'processhtml', 'critical', 'copy']);
};

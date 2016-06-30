module.exports = function(grunt) {

	grunt.initConfig({
		// Minify the CSS
		cssmin: {
			target: {
				files: [{
					src: ['src/css/material.min.css', 'src/css/site.css'], dest: 'dist/css/result.min.css' }
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
		// Minify the JS files
		uglify: {
        dist: {
            files: [
                { src: ['src/js/material.min.js', 'src/js/fetch.js', 'src/js/index.js'], dest: 'dist/js/index.min.js' },
                { src: ['src/js/material.min.js', 'src/js/fetch.js', 'src/js/beer.js'], dest: 'dist/js/beer.min.js' },
                { src: ['src/js/material.min.js', 'src/js/fetch.js', 'src/js/style.js'], dest: 'dist/js/style.min.js' },
								{ src: ['src/js/material.min.js'], dest: 'dist/js/about.min.js' }
            ]
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
		},
		// Copy all of the data across to dist
		copy: {
			main: {
				expand: true,
				flatten: true,
				 filter: 'isFile',
				src: 'src/data/*',
				dest: 'dist/data/',
			}
		}
	});

grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-processhtml');
grunt.loadNpmTasks('grunt-contrib-copy');

grunt.registerTask('default', ['cssmin', 'processhtml', 'copy', 'uglify']);
};

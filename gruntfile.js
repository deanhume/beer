module.exports = function (grunt) {

	var uid = (new Date().getTime()).toString(36);

	grunt.initConfig({
		// Minify the CSS
		cssmin: {
			target: {
				files: [{
					src: ['src/css/material.min.css', 'src/css/site.css'], dest: 'dist/css/result-' + uid + '.min.css'
				}
				]
			}
		},
		// Rewrite the minifed stuff into the processed HTML file
		processhtml: {
			options: {
				data: {
					message: uid
				}
			},
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
					{ src: ['src/js/material.min.js', 'src/js/fetch.js', 'src/js/index.js'], dest: 'dist/js/index-' + uid + '.min.js' },
					{ src: ['src/js/material.min.js', 'src/js/fetch.js', 'src/js/beer.js'], dest: 'dist/js/beer-' + uid + '.min.js' },
					{ src: ['src/js/material.min.js', 'src/js/fetch.js', 'src/js/style.js'], dest: 'dist/js/style-' + uid + '.min.js' },
					{ src: ['src/js/material.min.js', 'src/js/settings.js'], dest: 'dist/js/settings-' + uid + '.min.js' },
					{ src: ['src/js/material.min.js'], dest: 'dist/js/about-' + uid + '.min.js' }
				]
			}
		},
		// Copy all of the images across to dist
		copy: {
			images: {
				expand: true,
				flatten: true,
				filter: 'isFile',
				src: 'src/images/*',
				dest: 'dist/images/',
			},
			imagesSrm: {
				expand: true,
				flatten: true,
				filter: 'isFile',
				src: 'src/images/srm/*',
				dest: 'dist/images/srm',
			},
			rootFiles: {
				expand: true,
				flatten: true,
				filter: 'isFile',
				src: 'src/*.js',
				dest: 'dist/',
			},
			listJsFiles: {
				expand: false,
				flatten: true,
				filter: 'isFile',
				src: 'src/js/list.min.js',
				dest: 'dist/js/list.min.js',
			},
			googleSwFiles: {
				expand: false,
				flatten: true,
				filter: 'isFile',
				src: 'src/js/offline-google-analytics-import.js',
				dest: 'dist/js/offline-google-analytics-import.js',
			},
			data: {
				expand: true,
				flatten: true,
				filter: 'isFile',
				src: 'src/data/*',
				dest: 'dist/data/',
			},
			bowerComponents: {
				expand: true,
				cwd: 'src/bower_components/',
				src: '**/*',
				dest: 'dist/bower_components/',
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['cssmin', 'processhtml', 'copy', 'uglify']);
};

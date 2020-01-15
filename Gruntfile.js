module.exports = function( grunt )
{

	"use strict";

	grunt.initConfig( {
		compress: {
			main: {
				options: {
					archive: "./build/DXSyncCLI.zip"
				},
				files: [
					{
						expand: true,
						cwd: ".",
						src: [ "index.js", "install.cmd", "install.sh", "package.json", "README.md", "LICENSE", "NOTICE" ],
						dest: "/",
						filter: "isFile"
					},
					{
						expand: true,
						cwd: ".",
						src: "bin/**",
						dest: "/"
					},
					{
						expand: true,
						cwd: ".",
						src: "lib/**",
						dest: "/"
					},
					{
						expand: true,
						cwd: ".",
						src: "precompiled_modules/**",
						dest: "/"
					}
				]
			}
		}
	} );

	grunt.loadNpmTasks( "grunt-contrib-compress" );

	grunt.registerTask( "default", [] );

	grunt.registerTask( "build", [ "compress:main", "_build" ] );

	/**
     * Builds the app
     */
	grunt.registerTask( "_build", function() {
	} );

};

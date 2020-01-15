/*
Copyright HCL Technologies Ltd. 2001, 2020
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

var should = require( "should" ),
	helper = require( "./helper" ),
	server = require( "./server" ),
	syncWatcher = require( "../lib/watcher" );

describe( "sync-watcher", function() {

	describe( "sync-watcher", function() {
		var hook, webDavServer, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			syncPoint = helper.createSyncPointWithContent( "local-sync-watch", function() {
				server.startServerWithContent( "server-sync-watch", function( s ) {
					webDavServer = s;
					done();
				} );
			} );
		} );
		afterEach( function( done ) {
			server.closeServer( webDavServer, function() {
				hook.unhook();
				helper.resetLogger( function() {
					helper.cleanupSyncPoint( done );
				} );
			} );
		} );

		it( "Should print warning for windows", function( done ) {
			var originalPlatform = syncWatcher.__get__( "getProcessPlatform" ),
				initPathWatcher = syncWatcher.__get__( "initPathWatcher" );
			syncWatcher.__set__( "initPathWatcher", function() {
				var result = initPathWatcher();
				syncWatcher.__set__( "getProcessPlatform", function() {
					return "win32";
				} );
				return result;
			} );

			try {
				syncWatcher.watch( {
					localDir: syncPoint
				} ).then( function( w ) {
					w.unwatch();
					hook.captured().should.containEql( "Due to platform limitations on Windows" );
					done();
				} );
			}
			catch ( e ) {
				console.log( e );
			}
			syncWatcher.__set__( "getProcessPlatform", originalPlatform );
			syncWatcher.__set__( "initPathWatcher", initPathWatcher );

		} );

		it( "Test isConflictFile", function( ) {
			var isConflictFile = syncWatcher.isConflictFile;
			isConflictFile( "test.resolve" ).should.be.true();
			isConflictFile( "test.delete" ).should.be.true();
			isConflictFile( "test.txt" ).should.be.false();
		} );

		it( "Should be unable to find pathwatcher", function( done ) {
			var getPathWatcherThroughRequire = syncWatcher.__get__( "getPathWatcherThroughRequire" );
			syncWatcher.__set__( "getPathWatcherThroughRequire", function(modulePath) {
				throw new Error( "pathwatcher not found" );
			} );
			try {
				syncWatcher.watch( {
					localDir: syncPoint
				} ).then( function( w ) {
					w.unwatch();
					should.fail();
				}, function() {
					hook.captured().should.containEql( "Unable to watch files due to missing pathwatcher module" );
					done();
				} );
			}
			catch ( e ) {
			}
			syncWatcher.__set__( "getPathWatcherThroughRequire", getPathWatcherThroughRequire );
		} );

	} );

} );

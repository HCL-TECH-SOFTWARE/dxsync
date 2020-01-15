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
	sync = helper.getSyncModule();

describe( "sync-boundary", function() {

	it( "Should fail due to invalid sync mode", function( done ) {
		var innerSync = require( "../lib/sync" ),
			SyncProcess = innerSync.__get__( "SyncProcess" );
		var s = new SyncProcess( {}, null );
		s.sync( 10 ).then( function() {
			should.fail();
		}, function( err ) {
			err.should.containEql( "Invalid mode variable passed." );
			done();
		} ).catch( function( e ) {
			should.fail();
		} );
	} )

} )

describe( "sync-empty", function() {
	this.timeout( 10000 );
	describe( "sync-empty-theme", function() {
		var hook, webDavServer, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stdout );
			syncPoint = helper.createSyncPointWithContent( "local-onetheme", function() {
				server.startServerWithContent( "server-onetheme", function( s ) {
					webDavServer = s;
					done();
				} );
			} );
		} );
		afterEach( function( done ) {
			helper.requestCancel( helper.getEventEmitter(), function() {
				server.closeServer( webDavServer, function() {
					hook.unhook();

					helper.cleanupSyncPoint( done );
				} );
			} );
		} );

		it( "Should run through an empty 2-way sync (CLI)", function( done ) {

			process.argv = [ "dir", "shell", "run" ];
			sync.runCLI( syncPoint );

			setTimeout( function() {
				hook.captured().should.containEql( "Started 2-way synchronization..." );
				hook.captured().should.containEql( "Synchronization complete." );
				hook.captured().should.containEql( "Total      : 0" );
				done();
			}, 500 );
		} )

		it( "Should run through an empty 2-way sync", function( done ) {

			sync.runSync( syncPoint, null );

			setTimeout( function() {
				hook.captured().should.containEql( "Started 2-way synchronization..." );
				hook.captured().should.containEql( "Synchronization complete." );
				hook.captured().should.containEql( "Total      : 0" );
				done();
			}, 500 );
		} )

		it( "Should run through an empty push sync", function( done ) {

			process.argv = [ "dir", "shell", "push" ];
			sync.runCLI( syncPoint );

			setTimeout( function() {
				hook.captured().should.containEql( "Uploading updated files..." );
				hook.captured().should.containEql( "Synchronization complete." );
				hook.captured().should.containEql( "Total      : 0" );
				done();
			}, 500 );
		} )

		it( "Should run through an empty pull sync", function( done ) {

			process.argv = [ "dir", "shell", "pull" ];
			sync.runCLI( syncPoint );

			setTimeout( function() {
				hook.captured().should.containEql( "Downloading updated files..." );
				hook.captured().should.containEql( "Synchronization complete." );
				hook.captured().should.containEql( "Total      : 0" );
				done();
			}, 500 );
		} )

	} )

	describe( "sync-no-config", function() {
		var hook, syncPoint;
		beforeEach( function( done ) {
			hook = helper.captureStream( process.stderr );
			syncPoint = helper.createSyncPointWithContent( "local-noconfig", done );
		} );
		afterEach( function( done ) {
			hook.unhook();
			helper.requestCancel( helper.getEventEmitter(), function() {

				helper.cleanupSyncPoint( done );
			} );
		} );

		it( "Should run through an empty 2-way sync (CLI)", function( done ) {

			process.argv = [ "dir", "shell", "run" ];
			sync.runCLI( syncPoint );

			setTimeout( function() {
				hook.captured().should.containEql( "Unable to load dxsync settings in this directory." );
				done();
			}, 100 );
		} )

		it( "Should run through an empty 2-way sync", function( done ) {

			sync.runSync( syncPoint, null );

			setTimeout( function() {
				hook.captured().should.containEql( "Unable to load dxsync settings in this directory." );
				done();
			}, 100 );
		} )

		it( "Should run through an empty push sync", function( done ) {

			process.argv = [ "dir", "shell", "push" ];
			sync.runCLI( syncPoint );

			setTimeout( function() {
				hook.captured().should.containEql( "Unable to load dxsync settings in this directory." );
				done();
			}, 100 );
		} )

		it( "Should run through an empty pull sync", function( done ) {

			process.argv = [ "dir", "shell", "pull" ];
			sync.runCLI( syncPoint );

			setTimeout( function() {
				hook.captured().should.containEql( "Unable to load dxsync settings in this directory." );
				done();
			}, 100 );
		} )

	} )

} )

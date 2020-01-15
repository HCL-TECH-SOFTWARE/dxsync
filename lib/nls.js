/*
Copyright HCL Technologies Ltd. 2001, 2020
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

exports.loadNlsFile = function() {
	var json,
		locale = process.env.LANG || "en",
		idx = locale.indexOf( "." );
	if ( idx != -1 ) {
		locale = locale.substring( 0, idx );
	}
	if ( locale == "nb_NO" ) {

		// change Norwegian – Bokmal to no.json
		locale = "no";
	}

	function safeRead( locale ) {
		try {
			return require( "./nls/" + locale + ".json" );
		}
		catch ( e ) {
			return null;
		}
	}
	json = safeRead( locale );

	// fallback 1
	if ( !json ) {
		idx = locale.indexOf( "_" );
		if ( idx != -1 ) {
			locale = locale.substring( 0, idx );
			json = safeRead( locale );
		}
	}

	// fallback 2 -  we know this works
	if ( !json ) {
		json = require( "./nls/en.json" );
	}
	return json;
}
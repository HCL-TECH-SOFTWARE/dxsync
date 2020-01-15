/*
Copyright HCL Technologies Ltd. 2001, 2020
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

function startServer(_user, done) {

	var options = {
		port: 10039
	};
	var userManager = new webdav.SimpleUserManager();
	var user;
	if (!_user) {
		user = userManager.addUser("wpsadmin", "wpsadmin", false);
	} else {
		user = userManager.addUser(_user.username, _user.password, false);
	}

	// Privilege manager (tells which users can access which files/folders)
	var privilegeManager = new webdav.SimplePathPrivilegeManager();
	privilegeManager.setRights(user, "/", ["all"]);

	options.httpAuthentication = new webdav.HTTPBasicAuthentication(userManager, "WPS");
	options.privilegeManager = privilegeManager;

	var server = new webdav.WebDAVServer(options);

	helper.mkdirRecursive(BUILD_DIR + "/server/assets");
	server.setFileSystem("/dav/fs-type1", new webdav.PhysicalFileSystem(BUILD_DIR + "/server/assets"), function () {
		server.start(function () {
			done(server);
		});
	});
}

try {
	var webdav = require("webdav-server").v2,
		path = require("path"),
		helper = require("./helper"),
		BUILD_DIR = path.normalize(__dirname + "/../build");

	exports.startServerWithAuthentication = function (done, user) {

		helper.deleteFolderRecursive(BUILD_DIR + "/server", function () {
			startServer(user, done);
		});
		return BUILD_DIR + "/server/assets";
	};

	exports.startServerWithAuthenticationKeepFolder = function (done, user) {

		startServer(user, done);

		return BUILD_DIR + "/server/assets";
	};

	exports.startServerWithContent = function (content, done, user) {

		helper.deleteFolderRecursive(BUILD_DIR + "/server", function () {
			helper.copyFolderRecursive(__dirname + "/resources/" + content, BUILD_DIR + "/server/assets");
			startServer(user, done);
		});
		return BUILD_DIR + "/server/assets";
	};

	exports.closeServer = function (server, done) {
		server.stop(function (err) {
			if (err) {
				throw err;
			}
			console.log("Server closed");

			helper.deleteFolderRecursive(BUILD_DIR + "/server", function () {
				setTimeout(done, 500);
			});
		});
	};
} catch (e) {
	console.log("ERROR: ", e);
	if (e && (e + "").indexOf("Cannot find module 'gnu-tools'") != -1) {
		console.log("Testcases are not able to execute until you fix the test component issues.\nPlease check file https://github.com/hcl-dx/dxsync/tree/master/test/issues_in_dependencies.txt");
	}
	throw e;
}

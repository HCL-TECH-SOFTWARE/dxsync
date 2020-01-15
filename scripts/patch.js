/*
Copyright HCL Technologies Ltd. 2001, 2020
Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/
// An utility tool used by developer to download and patch pathwatcher.
// It will modify pathwatcher/package.json to support load with pre-compiled binary.
// The final tarball will be created at precompiled_modules/pathwatcher-${version}.tgz

// Sample usage:
//     node scripts/patch.js 8.1.0

var path = require("path");
var fs = require("fs-extra");
var dnp = require("download-npm-package");
var execa = require("execa");

if (process.argv.length < 3) {
	console.error("Please specify version, like 'node scripts/download.js 8.1.0'");
	return;
}

var BUILD_DIR = path.resolve(__dirname, "../build");
var BUILD_PW_DIR = path.resolve(BUILD_DIR, "pathwatcher");
var version = process.argv[2]
var package = "pathwatcher@" + version;

fs.removeSync(BUILD_PW_DIR);

console.log("Downloading " + package + " ...");

dnp({
	arg: package,
	dir: BUILD_DIR
}).then(function () {
	console.log("Patch library...");

	// Slightly modify pathwatcher/package.json to support load with pre-compiled binary
	var pwPkgFile = path.resolve(BUILD_PW_DIR, "package.json");
	var pwPkg = fs.readJsonSync(pwPkgFile);
	pwPkg.scripts = {
		install: "node load.js || node-gyp rebuild"
	}
	fs.writeJsonSync(pwPkgFile, pwPkg, { spaces: 2 });

	// Copy load.js
	fs.copyFileSync(path.resolve(__dirname, "load.js"), path.resolve(BUILD_PW_DIR, "load.js"));

	// Pack tarball
	var exeProcess = execa("npm", ["pack"], { cwd: BUILD_PW_DIR });

	exeProcess.stdout.pipe(process.stdout);
	exeProcess.stderr.pipe(process.stderr);

	exeProcess.then(function () {
		var tarball = "pathwatcher-" + version + ".tgz";
		var target = path.resolve(__dirname, "../precompiled_modules/" + tarball);

		// Move tarball to precompiled_modules
		fs.moveSync(path.resolve(BUILD_PW_DIR, tarball), target, { overwrite: true });
		fs.removeSync(BUILD_PW_DIR);

		console.log("Done! Tarball is downloaded and patched at: " + target);
	}).catch(function (err) {
		console.error(err);
	});
}).catch(function (err) {
	console.error(err);
})

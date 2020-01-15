[TOC]

## Prerequisites

1. Node.js 12
2. Node.js addon compiler tool (to compile `pathwatcher` module)
   - Linux: https://github.com/nodejs/node-gyp#on-unix
   - Mac: https://github.com/nodejs/node-gyp#on-macos
   - Windows: https://github.com/nodejs/node-gyp#on-windows
3. Docker (to run HCL Digital Experience)



## Node.js 12 Upgrade Changes

- All dependencies are upgraded to latest version except:
  - Latest `node-notifier` 6.0.0 cause high resource usage on Windows/Mac, sometimes the unit tests hang or even fail. So only upgrade to 5.4.3.
- Upgrade  `pathwatcher` to latest 8.1, the `pre-compiled_modules` is also updated to contain pre-compiled binaries of 8.1 for win32/win64/linux64/mac64 platforms
- `graceful-fs` is replaced by `fs-extra` which is more stable and has more features
- `rewire` is replaced by babel transform `@babel/register` with plugin `babel-plugin-rewire`
- `istanbul` is replaced by `nyc`
- `jscs` is replaced by `eslint`
- `jsDAV` is replaced by `webdav-server`
- Fixed Unit Tests after upgrade



Besides the above changes, other changes are to fix code style lint errors.



## Run Unit Tests

```bash
# Install all dependencies
npm i

# Lint code
npm run lint

# Run unit tests
npm test
```



## Run HCL Digital Experience

```bash
docker run -p 30015:30015 ibmcom/websphere-portal:latest

# When you see log: "Server WebSphere_Portal open for e-business; process id is 118", the HCL portal server is started successfully
```

You can visit http://localhost:30015/wps/myportal/Home, login with `wpsadmin/wpsadmin` to see it's running.



## Install CLI globally

```bash
# Uninstall existing CLI if any
npm uninstall -g dxsync

# Run install.sh or install.cmd on Windows
./install.sh

# Run CLI, it should print help info
dxsync
```



## CLI Usage

### Run `dxsync init` command

```bash
# Create an empty dir, let's call it "themeone"
mkdir themeone

# Init dxsync for "themeone" dir
cd themeone
dxsync init
# Then CLI will prompt several questions
```

Enter following answers for CLI prompt questions:

| Question                            | Answer                |
| ----------------------------------- | --------------------- |
| Hostname                            | localhost             |
| Username                            | wpsadmin              |
| Password                            | wpsadmin              |
| Path to the content handler servlet | /wps/mycontenthandler |
| Secure Connection (https)?          | false                 |
| Port                                | 30015                 |

Then CLI connects to HCL Portal server and get themes list, like following:

```
Connecting to the remote server...
Fetching themes from http://localhost:30015/wps/mycontenthandler/dav/fs-type1/themes/
The following themes were found. Please select which one you would like to connect to:
1. Portal8.5
2. Simple
3. ThemeDevSite
4. Toolbar8.5
prompt: Enter a number between 1 and 4:  
```

Enter number `1` to select the first `Portal8.5` theme, then the `dxsync init` command completes.



### Run `dxsync pull` command

```bash
# Also within "themeone" dir, run:
dxsync pull
```



The CLI will download the theme files from server like following:

```
HCL Digital Experience File Sync" v1.0.3
***************************************
 
Configuration:
  URL: http://localhost:30015/wps/mycontenthandler/dav/fs-type1/themes/Portal8.5
  username: wpsadmin
  password: ********
  secure: false
  syncIntervalMin: 5
  threads: 10
  filterRegex: ^\.|~$|.bak$|.resolve$|.delete$|.conflict$
 
Downloading updated files... Phase 1...
File download complete: Plain.html
File download complete: preview.gif
File download complete: preview_rtl.gif
File download complete: preview.png
File download complete: readme.txt
File download complete: theme.html
File download complete: theme_sidenav.html
File download complete: menuDefinitions/pageAction.json
File download complete: modules/readme.txt
File download complete: menuDefinitions/skinAction.json
File download complete: images/favicon.ico
File download complete: js/head.js
File download complete: js/highContrast.js
......
File download complete: nls/sidenav/theme_sidenav_uk.html
File download complete: nls/sidenav/theme_sidenav_tr.html
Phase 2...
Synchronization complete.
 
Synchronization Report:
Total      : 418
Uploaded   : 0
Downloaded : 418
Deleted    : 0 / 0 (Local/Remote)
Conflicts  : 0 / 0 (Resolved)
No Action  : 0
Errors     : 0

Idle...
```

It should report 418 total downloaded.



### Run `dxsync push` command

```bash
# Also within "themeone" dir, edit any file, like "reademe.txt", then run:
dxsync push
```

The CLI will upload the edited file to server:

```
HCL Digital Experience File Sync" v1.0.3
***************************************
 
Configuration:
  URL: http://localhost:30015/wps/mycontenthandler/dav/fs-type1/themes/Portal8.5
  username: wpsadmin
  password: ********
  secure: false
  syncIntervalMin: 5
  threads: 10
  filterRegex: ^\.|~$|.bak$|.resolve$|.delete$|.conflict$
 
Uploading updated files... Phase 1...
Uploading file: readme.txt
File upload complete: readme.txt
Phase 2...
Synchronization complete.
 
Synchronization Report:
Total      : 418
Uploaded   : 1
Downloaded : 0
Deleted    : 0 / 0 (Local/Remote)
Conflicts  : 0 / 0 (Resolved)
No Action  : 417
Errors     : 0

Idle...
```



**TIP**: you can also actually change some css file (like change the color of `body#content` in `css/default/default_view.css`), push it to server, then visit http://localhost:30015/wps/myportal/Home in browser incognito mode (because the css will be cached in browser) to see the color change.



### Run `dxsync run` command 

```bash
# Also within "themeone" dir, run:
dxsync run
```

The CLI immediately performs first sync, then it keeps running to monitor local file change and remote change from server:

```
HCL Digital Experience File Sync" v1.0.3
***************************************
 
Configuration:
  URL: http://localhost:30015/wps/mycontenthandler/dav/fs-type1/themes/Portal8.5
  username: wpsadmin
  password: ********
  secure: false
  syncIntervalMin: 5
  threads: 10
  filterRegex: ^\.|~$|.bak$|.resolve$|.delete$|.conflict$
 
Started 2-way synchronization... Phase 1...
Phase 2...
Synchronization complete.
 
Synchronization Report:
Total      : 418
Uploaded   : 0
Downloaded : 0
Deleted    : 0 / 0 (Local/Remote)
Conflicts  : 0 / 0 (Resolved)
No Action  : 418
Errors     : 0

Watching files in '/Users/mac/Downloads/mytheme' for changes...
 
Idle...
Starting next synchronization in 5 minutes...
```



Now if you edit any file, it will be auto uploaded to server immediately.

But it will check the server for remote change in an interval of every 5 minutes. So to verify the 2-way sync works, you can:

1. Create another empty dir (let's call it `themetwo`), init it and pull the files as described in above sections
2. Within `themetwo` dir, edit some file and `dxsync push` the change to server
3. Within `themeone` dir, wait at most 5 minutes, you should see the remote change synced to local



**NOTE**: the globally installed CLI uses pre-compiled `pathwatcher` module (so that user doesn't need install compiler tool). If the pre-compiled module does not work on your platform, try install CLI with `--from-source` flag, then the `pathwatcher` module will be built from source:

```bash
./install.sh --from-source
# or on Windows: install.cmd --from-source
```

 

## Uninstall CLI

Simply run:

```bash
npm uninstall -g dxsync
```



## How to pre-compile `pathwatcher`

Typically, when a npm library provides pre-compiled binaries, it sets `scripts.install` configuration in `package.json` to use some custom install script to load the pre-compiled binary.

For example, the widely used `node-sass` library: https://github.com/sass/node-sass/blob/v4.13.0/package.json#L31. As for now this is the proven best practice to do.

But the `pathwatcher` library doesn't provide pre-compiled binaries. So we need to do 2 things:

1. Patch the library:

   A script `scripts/patch.js` is provided for this, simply run:

   ```bash
   node scripts/patch.js 8.1.0
   # The argument 8.1.0 is the version number of pathwatcher.
   ```

   This script will download the library and slightly modify its `package.json` to load the pre-compiled binary. The final tarball will be created at `precompiled_modules/pathwatcher-${version}.tgz`

   **Note**: the version number should match the `dependencies.pathwatcher` configuration defined in `dxsync/package.json`

   

2. Compile native binaries:

   - Install Node.js 12 and compiler tool:
     - Linux: https://github.com/nodejs/node-gyp#on-unix
     - Mac: https://github.com/nodejs/node-gyp#on-macos
     - Windows: https://github.com/nodejs/node-gyp#on-windows

   - Download the release zip from https://github.com/atom/node-pathwatcher/releases
   - Unzip downloaded release zip, then simply run `npm install` within it. The binary file will be generated at `build/Release/pathwatcher.node`
   - Copy `pathwatcher.node` to `precompiled_modules`:
     - 64bit Mac: copy it to `precompiled_modules/binary/darwin/x64`
     - 64bit Linux: copy it to `precompiled_modules/binary/linux/x64`
     - 64bit Windows: copy it to `precompiled_modules/binary/win32/x64`
     - 32bit Windows: copy it to `precompiled_modules/binary/win32/ia32`



## How to build release zip

Simply run:

```bash
./node_modules/.bin/grunt build
```

The release zip will generated at `build/DXSyncCLI.zip`


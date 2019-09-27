// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const {spawn, execFile, execSync} = require('child_process');
const path = require('path');
const { ipcMain, dialog } = require('electron');
const fs = require('fs');
let player_id = -1;

let app_path = '';
fs.readFile('script\\path.txt', (err, res) => {
	app_path = res.toString();
});

function config(data) {
	spawn('python', ['script\\config.py', 'script', 'default_system.cfg', 'default_game.cfg', data[1]]);
}

async function runGame(data) {
	let option = {
		type: 'question',
		buttons: ['NO', 'YES'],
		defaultId: 0,
		title: 'Question',
		message: 'Do you want run WatchDog',
		detail: 'You only run watch dog when you are host, unless data will duplicate on server. Many thanks.',
	};

	let result = await dialog.showMessageBox(null, option);
	if (result.response === 1) {
		spawn('python', ['script\\watch_dog.py']);
	}

	execSync(`python script\\update_config.py ${path.dirname(path.dirname(app_path))} system.cfg game.cfg ${data[1]}`);
	execFile(app_path, (err, res) => {
		if (err) {
			console.log(err)
		} else {
			console.log(res)
		}
	});
}

function choiceFile(func, data) {
	let options = {
		title: 'Choice game application',
		defaultPath: '.',
		buttonLabel: 'Run',
		filters: [
			{name: 'Application', extensions: ['exe']}
		],
		properties: ['showHiddenFiles'],
		message: 'This message will only be shown on macOS'
	};
	dialog.showOpenDialog(null, options, (filePaths) => {
		app_path = filePaths[0];
		fs.writeFile('script\\path.txt', app_path, (err, res) => {
			if (err) {
				console.log(err)
			}
		});
		func(data)
	});
}


ipcMain.on('submitForm', function(event, data) {
	if (data[0] === "register") {
		try {
			if (!fs.existsSync(app_path)) {
				choiceFile(config, data)
			} else {
				config(data)
			}
		} catch(err) {
			console.error(err)
		}
	} else if (data[0] === "successful") {
		try {
			player_id = data[1];
			if (!fs.existsSync(app_path)) {
				choiceFile(runGame, data)
			} else {
				runGame(data)
			}
		} catch(err) {
			console.error(err)
		}
	}
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 640,
		resizable: false,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: true,
		}
	});

	mainWindow.loadFile('build/index.html');

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		execSync(`python script\\config.py ${path.dirname(path.dirname(app_path))} system.cfg game.cfg ${player_id}`);
		mainWindow = null
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) createWindow()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
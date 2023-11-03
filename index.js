const { app, BrowserWindow, globalShortcut, ipcMain } = require( "electron" );
const fs = require( "node:fs" );
const path = require( "node:path" );
const { autoUpdater } = require( "electron-updater" );
require( "@electron/remote/main" ).initialize();

let mainWin;
let debug = false;
app.on( "window-all-closed", () => app.quit() );
app.on(
	"ready", () => {
		console.log(
			"\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[33m\x1B[1m[INFO] \x1B[0m- Starting..."
		);

		const appPath = app.getPath("userData");
		const settingsPath = path.join(appPath, "settings.json");
		if (!fs.existsSync( appPath )) fs.mkdirSync( appPath );
		if (!fs.existsSync( settingsPath )) fs.writeFileSync(settingsPath, JSON.stringify({ debug: false }, null, "\t"));
		
		const settings = JSON.parse(fs.readFileSync( settingsPath , "utf-8" ));
		debug = settings?.debug || false;
		
		if (!debug) registerShortcuts();
		createWindow();

		autoUpdater.autoInstallOnAppQuit = true;
		autoUpdater.autoDownload = false;
		autoUpdater.allowPrerelease = true;
	
		autoUpdater.on(
			"update-available", (a) => {
				ipcMain.on( "allow-update", () => autoUpdater.downloadUpdate() );
				if (!mainWin.isDestroyed()) mainWin.webContents.send( "update-available", a );
			},
		);
		
		autoUpdater.checkForUpdates().catch(() => {});
	},
);

const registerShortcuts = () => {
	globalShortcut.register( "Control+R", () => false );
	globalShortcut.register( "Control+Shift+R", () => false );
};

const createWindow = () => {
	const win = new BrowserWindow({
		title: "Bedrock Tools (Beta)",
		icon: "build/icon.png",

		minWidth: 1040,
		minHeight: 600,
		width: 1080,
		height: 660,

		frame: false,
		autoHideMenuBar: true,
		resizable: true,
		titleBarStyle: "hidden",
		webPreferences: {
			devTools: debug,
			preload: path.join( __dirname, "src/engine.js" ),
			webSecurity: true,
			nodeIntegration: true,
			contextIsolation: false,
			// https://stackoverflow.com/questions/69059668/enableremotemodule-is-missing-from-electron-v14-typescript-type-definitions
			// @ts-expect-error - missing the type definition
			enableRemoteModule: true,
		},
	});
	
	mainWin = win;
	require( "@electron/remote/main" ).enable( win.webContents );
	app.setAppUserModelId( "Bedrock Tools" );
	win.loadFile(path.join( __dirname, "index.html" ));
	win.show();
};
const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const remote = require("@electron/remote/main");
const fs = require("node:fs");
const path = require("node:path");

let debug = false;
remote.initialize();

app.setPath("userData", path.join(process.env.LOCALAPPDATA, "com.xkingdark.mclauncher"));
app.setPath("sessionData", path.join(process.env.LOCALAPPDATA, "com.xkingdark.mclauncher"));
app.on("window-all-closed", () => app.quit());
app.on(
	"ready", () => {
		console.log(
			"\x1B[0m".concat(new Date().toLocaleTimeString()).concat(" \x1B[33m\x1B[1m[INFO] \x1B[0m- Starting...")
		);

		const appPath = path.join(process.env.APPDATA, "com.xkingdark.mclauncher");
		const settingsPath = path.join(appPath, "settings.json");
		if (!fs.existsSync(appPath)) fs.mkdirSync(appPath);
		if (!fs.existsSync(settingsPath)) fs.writeFileSync(settingsPath, JSON.stringify({ debug: false }, null, "\t"));
		
		const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
		debug = settings?.debug || false;
		
		if (!debug) registerShortcuts();
		createWindow();
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
			preload: path.join(__dirname, "src/engine.js"),
			webSecurity: true,
			nodeIntegration: true,
			contextIsolation: false,
			// https://stackoverflow.com/questions/69059668/enableremotemodule-is-missing-from-electron-v14-typescript-type-definitions
			// @ts-expect-error - missing the type definition
			enableRemoteModule: true,
		},
	});
	
	remote.enable(win.webContents);
	win.loadFile(path.join(__dirname, "index.html"));
	win.show();
};
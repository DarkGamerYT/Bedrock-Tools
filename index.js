const { app, BrowserWindow, globalShortcut } = require( "electron" );
const fs = require( "node:fs" );
const path = require( "node:path" );
require( "@electron/remote/main" ).initialize();

let debug = false;
app.on( "window-all-closed", () => app.quit() );
app.on("ready",
	() => {
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
	},
);

const registerShortcuts = () => {
	globalShortcut.register(
		"Control+R",
		() => false,
	);

	globalShortcut.register(
		"Control+Shift+R",
		() => false,
	);
};

const createWindow = () => {
	const win = new BrowserWindow(
		{
			minWidth: 1040,
			minHeight: 600,
			width: 1080,
			height: 660,
			title: "Bedrock Tools (Beta)",
			icon: "./src/assets/imgs/beta.png",
			autoHideMenuBar: true,
			resizable: true,
			titleBarStyle: "hidden",
			webPreferences: {
				preload: __dirname + "/engine.js",
				devTools: debug,
				webgl: true,
				webSecurity: true,
				nodeIntegration: true,
				contextIsolation: false,
				// https://stackoverflow.com/questions/69059668/enableremotemodule-is-missing-from-electron-v14-typescript-type-definitions
				// @ts-expect-error - missing the type definition
				enableRemoteModule: true,
			},
		},
	);
	
	require( "@electron/remote/main" ).enable( win.webContents );
	app.setAppUserModelId( "Bedrock Tools" );
	win.show();
	win.loadFile(path.join(__dirname, "src/index.html" ));
};
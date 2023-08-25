require( "@electron/remote/main" ).initialize();
const {
	app,
	BrowserWindow,
	globalShortcut,
} = require( "electron" );
const express = require( "express" );
const server = express();
server.use(express.static( "." ));

const debug = true;
const port = 8000;
app.on( "window-all-closed", () => app.quit() );
app.on("ready",
	() => {
		console.log(
			"\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[33m\x1B[1m[INFO] \x1B[0m- Starting..."
		);
		
		if (!debug) registerShortcuts();
		server.listen(
			port, () => {
				console.log(
					"\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[33m\x1B[1m[INFO] \x1B[0m- The server is now running on port \x1B[33m" + port + "\x1B[0m!",
				);

				createWindow();
			},
		);
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
			minWidth: 1010,
			minHeight: 640,
			width: 1070,
			height: 648,
			title: "Bedrock Tools (Beta)",
			icon: "./src/assets/imgs/beta.png",
			autoHideMenuBar: true,
			resizable: true,
			titleBarStyle: "hidden",
			titleBarOverlay: {
				color: "#e6e8eb",
				height: 38,
			},
			webPreferences: {
				preload: __dirname + "/engine.js",
				devTools: debug,
				webgl: true,
				webSecurity: true,
				nodeIntegration: true,
				contextIsolation: false,
				enableRemoteModule: true,
			},
		},
	);

	require( "@electron/remote/main" ).enable( win.webContents );
	app.setAppUserModelId( "Bedrock Tools" );

	win.show();
	win.loadURL( "http://127.0.0.1:8000/src" );
};
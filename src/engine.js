const electron = require( "@electron/remote" );
const fs = require( "node:fs" );
const path = require( "node:path" );

const settingsPath = path.join(electron.app.getPath("userData"), "settings.json");
const sounds = JSON.parse(fs.readFileSync(path.join(__dirname, "sound_definitions.json"), "utf-8" ));
for (let sound in sounds) for (const s of sounds[sound].sounds) new Audio( "sounds/" + s.name );
globalThis.BedrockTools = {
    version: "0.1.2-beta",
    router: {
        isTransitioning: false,
        routes: [],
        history: {
            list: [],
            async go(path) {
                window.logger.debug( "[ROUTER] Replacing path to", path );
    
                this.list.push( path );
                const route = BedrockTools.router.routes.find((r) => r.route == path);
                BedrockTools.router.isTransitioning = true;
    
                if (!route) return BedrockTools.loadUI(BedrockTools.router.routes.find((r) => r.route == "/empty_route"));
                await BedrockTools.loadUI( route );
            },
            async goBack() {
                if (this.list.length <= 1 || BedrockTools.router.isTransitioning) return;
                window.logger.debug( "[ROUTER] Going back." );
                
                this.list.pop();
                if (!this.list[this.list.length - 1]) return;
                const route = BedrockTools.router.routes.find((r) => r.route == this.list[this.list.length - 1]);
                if (!route) return BedrockTools.loadUI(BedrockTools.router.routes.find((r) => r.route == "/empty_route"), true);
                
                BedrockTools.router.isTransitioning = true;
                await BedrockTools.loadUI( route, true );
            },
        },
    },

    sound: {
        play: (id) => {
            window.logger.debug( "[SOUND] Sound with id '" + id + "' has been requested." );
            if (
                sounds.hasOwnProperty(id)
                && sounds[id].sounds.length > 0
            ) {
                const sound = sounds[id];
                const randomSound = sound.sounds[Math.floor( Math.random() * sound.sounds.length )].name;
                const audio = new Audio( "sounds/" + randomSound );
                audio.play();
            };
        },
    },

    settings: {
        get: (key) => {
            const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
            return settings[key] ?? defaultSettings[key];
        },
        set: (key, value) => {
            const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
            if (defaultSettings.hasOwnProperty( key )) {
                settings[key] = value ?? defaultSettings[key];
                fs.writeFileSync(settingsPath, JSON.stringify(settings, null, "\t"));
            };
        },
    },

    functions: {
        onClick: {},
        onChange: {},
    },
    
    loadUI: async (route, isBack = false) => {
        const app = document.getElementById( "app" );
        if (!app) return;
        
        app.className = isBack ? "uiLeavingBack" : "uiLeaving";
        await new Promise((res) => setTimeout(() => res(), 0.2 * 1000)); //wait for 400 milliseconds
        app.className = isBack ? "uiEnteringBack" : "uiEntering";
        app.innerHTML = route ? route.component() : "";
        if (route?.extra) route.extra();
        const back = document.getElementById( "back" );
        const settings = document.getElementById( "settings" );
        if (back) back.addEventListener( "click", () => { BedrockTools.sound.play( 'ui.click' ); BedrockTools.router.history.goBack(); } );
        if (settings) settings.addEventListener( "click", () => { BedrockTools.sound.play( 'ui.click' ); BedrockTools.router.history.go( "/settings" ) } );

	    const currentWindow = electron.getCurrentWindow();
        const closeApp = document.getElementById( "closeApp" );
        const maximizeApp = document.getElementById( "maximizeApp" );
        const minimizeApp = document.getElementById( "minimizeApp" );
        if (closeApp) closeApp.addEventListener( "click", () => electron.app.exit());
        if (maximizeApp) maximizeApp.addEventListener( "click", () => currentWindow.isMaximized() ? currentWindow.unmaximize() : currentWindow.maximize());
        if (minimizeApp) minimizeApp.addEventListener( "click", () => currentWindow.minimize());

        await new Promise((res) => setTimeout(() => res(0), 0.25 * 1000));
        BedrockTools.router.isTransitioning = false;
    },
    loadModal: (component) => document.getElementById( "popup" ).innerHTML = component,
    sendToast: ({ title = "", body = "", icon = null, timeout = 4, instant = false, onClick = () => {} }) => {
        const id = Date.now();
        if (instant) toastQueue = [{ id, title, body, icon, timeout, onClick }, ...toastQueue];
        else toastQueue.push({ id, title, body, icon, timeout, onClick });

        const interval = setInterval(
            async() => {
                const options = toastQueue[0];
                if (options.id == id) {
                    clearInterval(interval);

                    await sendToast(options);
                    toastQueue = toastQueue.filter((t) => t.id != options.id);
                };
            },
        );
    },
};

let toastQueue = [];
const sendToast = async(options) => {
    BedrockTools.functions.onClick[options.id] = options?.onClick;
    const toast = document.getElementById( "toast" );
    if (!toast) return;

    toast.className = "toast toastLeaving";
    await new Promise((res) => setTimeout(() => res(0), 0.25 * 1000));
    toast.className = "toast toastEntering";
    BedrockTools.sound.play( "ui.toast_in" );
    toast.innerHTML = (
        `<div class="toastElement" onClick="BedrockTools.functions.onClick['${options.id}']();">
            <div class="toastElement_">
                ${
                    options?.icon
                    ? `<img src="${options?.icon}" draggable="false" style="height: 36px; width: 36px; image-rendering: pixelated; margin-right: 1rem;">`
                    : ""
                }
                <div>
                    <span class="toastHeader">${options.title}</span>
                    <span class="toastSubtitle">${options.body}</span>
                </div>
            </div>
        </div>`
    );
    
    await new Promise((res) => setTimeout(() => res(0), options.timeout * 1000));
    const toastOptions = toastQueue[0];
    if (toastOptions.id == options.id) {
        toast.className = "toast toastLeaving";
        BedrockTools.sound.play( "ui.toast_out" );
        await new Promise((res) => setTimeout(() => res(0), 0.5 * 1000));
    };

    delete BedrockTools.functions.onClick[options.id];
};

const defaultSettings = {
    debug: false,
    alpha_notice: true,
    right: false,
    discordrpc: true,
};

globalThis.logger = {
    /**
     * 
     * @param  {...any} data 
     * @returns 
     */
    info: (...data) => console.log(
		"\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[33m\x1B[1m[INFO] \x1B[0m-", ...data,
	),

    /**
     * 
     * @param  {...any} data 
     * @returns 
     */
    debug: (...data) => {
        if (BedrockTools.settings.get( "debug" ))
        console.log(
            "\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[33m\x1B[1m[DEBUG] \x1B[0m-", ...data,
        );
    },
    
    /**
     * 
     * @param  {...any} data 
     * @returns 
     */
    error: (...data) => console.log(
		"\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[31m\x1B[1m[ERROR] \x1B[0m-", ...data,
	),
};
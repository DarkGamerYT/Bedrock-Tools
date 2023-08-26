const fs = require( "node:fs" );
const Router = {
    routes: [],
    history: {
        list: [],
        go(path) {
            window.logger.debug( "[ROUTER] Replacing path to", path );

            this.list.push( path );
            const route = Router.routes.find((r) => r.route == path);
            if (!route) return window.engine.loadUI(Router.routes.find((r) => r.route == "/empty_route"));
            window.engine.loadUI( route );
        },
        goBack() {
            window.logger.debug( "[ROUTER] Going back." );
            this.list.pop();
            if (!this.list[this.list.length - 1]) return;
            const route = Router.routes.find((r) => r.route == this.list[this.list.length - 1]);
            if (!route) return window.engine.loadUI(Router.routes.find((r) => r.route == "/empty_route"), true);
            window.engine.loadUI( route, true );
        },
    },
};

const sounds = JSON.parse(fs.readFileSync( __dirname + "/src/sound_definitions.json" ));
for (let sound in sounds) for (const s of sounds[sound].sounds) new Audio( "/src/assets/sounds/" + s.name );
const Sound = {
    play: (id) => {
        window.logger.debug( "[SOUND] Sound with id '" + id + "' has been requested." );
        if (
            sounds.hasOwnProperty(id)
            && sounds[id].sounds.length > 0
        ) {
            const sound = sounds[id];
            const randomSound = sound.sounds[Math.floor( Math.random() * sound.sounds.length )].name;
            const audio = new Audio( "/src/assets/sounds/" + randomSound );
            audio.play();
        };
    },
};

const Logger = {
    info: (...data) => console.log(
		"\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[33m\x1B[1m[INFO] \x1B[0m-", ...data,
	),
    debug: (...data) => console.log(
		"\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[33m\x1B[1m[DEBUG] \x1B[0m-", ...data,
	),
    error: (...data) => console.log(
		"\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[31m\x1B[1m[ERROR] \x1B[0m-", ...data,
	),
};

const Engine = {
    loadUI: async (route, isBack = false) => {
        const app = document.getElementById( "app" );
        app.className = isBack ? "uiLeavingBack" : "uiLeaving";
        await new Promise((res) => setTimeout(() => res(), 0.2 * 1000)); //wait for 400 milliseconds
        app.className = isBack ? "uiEnteringBack" : "uiEntering";
        app.innerHTML = route.component();
        if (route?.extra) route.extra();
        const back = document.getElementById( "back" );
        const settings = document.getElementById( "settings" );
        if (back) back.addEventListener( "click", () => { window.sound.play( 'ui.modal_hide' ); Router.history.goBack(); } );
        if (settings) settings.addEventListener( "click", () => { window.sound.play( 'ui.modal_hide' ); Router.history.go( "/settings" ) } );
    },
    loadModal: (component) => document.getElementById( "popup" ).innerHTML = component,
};

const settingsPath = process.env.APPDATA + "/bedrocktools/settings.json";
const Settings = {
    get: (key) => {
        const settings = JSON.parse(fs.readFileSync(settingsPath));
        return settings[key] ?? defaultSettings[key];
    },
    set: (key, value) => {
        const settings = JSON.parse(fs.readFileSync(settingsPath));
        if (defaultSettings.hasOwnProperty( key )) {
            settings[key] = value ?? defaultSettings[key];
            fs.writeFileSync( settingsPath, JSON.stringify(settings, null, 4) );
        };
    },
};

const defaultSettings = {
    debug: false,
    alpha_notice: true,
    right: false,
    discordrpc: true,
};

window.router = Router;
window.sound = Sound;
window.logger = Logger;
window.engine = Engine;
window.settings = Settings;
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

const Sound = {
    play: (id) => {
        window.logger.debug( "[SOUND] Sound with id '" + id + "' has been requested." );
        const sounds = JSON.parse(fs.readFileSync( "./src/sound_definitions.json" ));
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
		"\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[35m\x1B[1m[ERROR] \x1B[0m-", ...data,
	),
};

const Engine = {
    loadUI: async (route, isBack = false) => {
        const app = document.getElementById( "app" );
        app.className = isBack ? "uiLeavingBack" : "uiLeaving";
        await new Promise((res) => setTimeout(() => res(), 0.8 * 1000)); //wait 1 second
        app.className = isBack ? "uiEnteringBack" : "uiEntering";
        app.innerHTML = route.component();
        const back = document.getElementById( "back" );
        const settings = document.getElementById( "settings" );
        if (back) back.addEventListener( "click", () => { window.sound.play( 'ui.modal_hide' ); Router.history.goBack(); } );
        if (settings) settings.addEventListener( "click", () => { window.sound.play( 'ui.modal_hide' ); Router.history.go( "/settings" ) } );
    },
};

window.router = Router;
window.sound = Sound;
window.logger = Logger;
window.engine = Engine;
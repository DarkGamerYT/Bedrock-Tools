const electron = require( "@electron/remote" );
const Router = require( "./engine/Router" );
const Sound = require( "./engine/Sound" );
const Settings = require( "./engine/Settings" );
globalThis.BedrockTools = {
    version: "0.1.2-beta",
    router: Router,
    sound: Sound,
    settings: Settings,
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
        try {
            app.innerHTML = route ? route.component() : "";
            if (route?.metadata?.onLoad) route.metadata.onLoad();
        } catch {
            app.innerHTML = ErrorRoute();
        };
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

const ErrorRoute = () => {
    setTimeout(() => BedrockTools.router.history.goBack(), 5000);
    return (
        `<div class="popup">
            <div class="popup_">
                <div class="popup__" style="width: auto;">
                    <div style="background-color: #e0e0e0;border-bottom: 3px solid #919191;padding: 2rem;text-align: center;gap: 6px;">
                        <div style="font-family: MinecraftTen;font-size: 21px;">An error has occurred</div>
                        <div style="font-size: 13.5px;">Going back to the previous screen...</div>
                    </div>
                </div>
            </div>
        </div>`
    );
};
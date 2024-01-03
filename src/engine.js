const fs = require( "fs" );
const { Cubemap } = require( "../libs/@hatchibombotar-cubemap/index.js" );
let loadedFacets = {};
const loadFacet = async (facet) => {
	try {
		const f = await require( __dirname + "/facets/" + facet + ".js" );
	
		BedrockTools.logger.debug( "Facet Loaded: " + facet, f );
		loadedFacets[ facet ] = f;
	} catch(e) { console.error(e); };
};

const facets = JSON.parse(fs.readFileSync( __dirname + "/facets.json" ));
(async() => { for (const facet of facets) await loadFacet( facet ); })();

globalThis.BedrockTools = {
    version: "0.1.4-beta",
    startTime: Date.now(),
    facets: loadedFacets,

    requestFacet: (facet) => {
        if (BedrockTools.facets.hasOwnProperty(facet)) {
            BedrockTools.logger.debug( `Sending Facet: ${facet}` );
            return BedrockTools.facets[ facet ];
        } else throw new Error( `MISSING FACET: ${facet}` );
    },

    logger: {
        /** @param  {...any} data */
        info: (...data) => console.log( "\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[33m\x1B[1m[INFO] \x1B[0m-", ...data ),
        /** @param  {...any} data */
        debug: (...data) => {
            //if (BedrockTools.settings.get( "debug" ))
            console.log( "\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[33m\x1B[1m[DEBUG] \x1B[0m-", ...data );
        },
        /** @param  {...any} data */
        error: (...data) => console.log( "\x1B[0m" + new Date().toLocaleTimeString() + " \x1B[31m\x1B[1m[ERROR] \x1B[0m-", ...data ),
    },

    loadUI: async (route, isBack = false) => {
        const app = document.getElementById( "app" );
        if (!app) return;
        const router = BedrockTools.facets[ "core.router" ];
        const sound = BedrockTools.facets[ "core.sound" ];
        const settingsF = BedrockTools.facets[ "core.settings" ];
        
        let animationsEnabled = settingsF.get("animations");
        if (animationsEnabled) {
            app.className = isBack ? "uiLeavingBack" : "uiLeaving";
            await new Promise((res) => setTimeout(() => res(), 0.2 * 1000)); //wait for 400 milliseconds
            app.className = isBack ? "uiEnteringBack" : "uiEntering";
        };
        
        try {
            app.innerHTML = route ? route.component() : "";
            window.scrollTo({ top: 0 });
            if (route?.metadata?.onLoad) route.metadata.onLoad();
        } catch(e) {
            app.innerHTML = ErrorRoute();
            console.error(e);
        };

        const back = document.getElementById( "back" );
        const settings = document.getElementById( "settings" );
        if (back) back.addEventListener( "click", () => { sound.play( 'ui.click' ); router.history.goBack(); } );
        if (settings) settings.addEventListener( "click", () => { sound.play( 'ui.click' ); router.history.go( "/settings" ) } );

	    const currentWindow = electron.getCurrentWindow();
        const closeApp = document.getElementById( "closeApp" );
        const maximizeApp = document.getElementById( "maximizeApp" );
        const minimizeApp = document.getElementById( "minimizeApp" );
        if (closeApp) closeApp.addEventListener( "click", () => electron.app.exit());
        if (maximizeApp) maximizeApp.addEventListener( "click", () => currentWindow.isMaximized() ? currentWindow.unmaximize() : currentWindow.maximize());
        if (minimizeApp) minimizeApp.addEventListener( "click", () => currentWindow.minimize());

        await new Promise((res) => setTimeout(() => res(0), 0.25 * 1000));
        router.isTransitioning = false;
    },
    loadModal: (component) => document.getElementById( "popup" ).innerHTML = `<div class="mainBackground"></div><div class="uiEntering" style="min-width: 435px;">${component}</div>`,
    clearModal: () => document.getElementById( "popup" ).innerHTML = "",
    isModalOpen: () => document.getElementById( "popup" ).innerText.trim().length > 0,
    sendToast: ({ label = "", body = "", icon = null, timeout = 4, instant = false, onClick = () => {} }) => {
        const id = Date.now();
        if (instant) toastQueue = [{ id, label, body, icon, timeout, onClick }, ...toastQueue];
        else toastQueue.push({ id, label, body, icon, timeout, onClick });

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

globalThis.functions = { onClick: {}, onChange: {} };

let toastQueue = [];
const sendToast = async(options) => {
    const sound = BedrockTools.facets[ "core.sound" ];
    functions.onClick[options.id] = options?.onClick;
    const toast = document.getElementById( "toast" );
    if (!toast) return;

    const settingsF = BedrockTools.facets[ "core.settings" ];
    let animationsEnabled = settingsF.get("animations");
    if (animationsEnabled) toast.className = "toast toastLeaving";
    else toast.className = "toast toastOut";
    await new Promise((res) => setTimeout(() => res(0), 0.25 * 1000));
    if (animationsEnabled) toast.className = "toast toastEntering";
    else toast.className = "toast toastIn";
    
    sound.play( "ui.toast_in" );
    toast.innerHTML = (
        `<div class="toastElement" onClick="functions.onClick['${options.id}']();">
            <div class="toastElement_">
                ${options?.icon
                    ? (
                        `<div>
                            <img src="${options?.icon}" draggable="false" style="height: 36px; width: 36px; image-rendering: pixelated; margin-right: 1rem;">
                            <div style="left: 0; position: absolute;"><div class="elementIconHover"></div></div>
                        </div>`
                    )
                    : ""
                }
                <div>
                    <span class="toastHeader">${options.label}</span>
                    <span class="toastSubtitle">${options.body}</span>
                </div>
            </div>
        </div>`
    );
    
    await new Promise((res) => setTimeout(() => res(0), options.timeout * 1000));
    const toastOptions = toastQueue[0];
    if (toastOptions.id == options.id) {
        if (animationsEnabled) toast.className = "toast toastLeaving";
        else toast.className = "toast toastOut";
        
        sound.play( "ui.toast_out" );
        await new Promise((res) => setTimeout(() => res(0), 0.5 * 1000));
    };

    delete functions.onClick[options.id];
};

const ErrorRoute = () => {
    setTimeout(() => {
        const router = BedrockTools.requestFacet( "core.router" );
        router.history.goBack();
    }, 5000);
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

window.addEventListener(
	"DOMContentLoaded", () => {
        const settings = BedrockTools.facets[ "core.settings" ];
        let panoramaEnabled = settings.get( "panorama_enabled" );
        if (panoramaEnabled) {
            let panorama = settings.get( "panorama" );
            new Cubemap(
                document.getElementsByTagName( "body" )[0],
                [
                    "assets/cubemap/" + panorama + "/front.png",
                    "assets/cubemap/" + panorama + "/right.png",
                    "assets/cubemap/" + panorama + "/back.png",
                    "assets/cubemap/" + panorama + "/left.png",
                    "assets/cubemap/" + panorama + "/top.png",
                    "assets/cubemap/" + panorama + "/bottom.png",
                ],
                {
                    width: "100%",
                    height: "100%",
                    perspective: 350,
                    rotate_type: "auto",
                    rotate_speed: 2.5,
                },
            );
        };
    },
);
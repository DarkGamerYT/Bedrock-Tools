const electron = require( "@electron/remote" );
const fs = require( "node:fs" );
const NBT = require( "prismarine-nbt" );
window.router.history.go( "/main_screen" );

const RPC = new (require("discord-rpc")).Client({ transport: "ipc" });
RPC.on(
    "ready", async () => {
        console.log( RPC.user );
        let lastRoute;
        let lastTime;
        setInterval(
            () => {
                const routeName = window.router.history.list[window.router.history.list.length - 1];
                const route = window.router.routes.find((r) => r.route == routeName);
                
                if (window.settings.get( "discordrpc" )) {
                    if (lastRoute != routeName) {
                        lastTime = Date.now();
                        RPC.setActivity(
                            {
                                details: route?.name ?? "Unknown Route",
                                state: "Route: " + (route?.route ?? routeName),
                                startTimestamp: lastTime,
                                largeImageKey: "icon",
                                largeImageText: "Bedrock Tools (Beta)",
                                smallImageKey: route?.rpc,
                                smallImageText: route?.name,
                            },
                        );
                    };
                } else RPC.clearActivity();
                lastRoute = routeName;
            },
        );
    },
);

const startRPC = () => {
    RPC.login({ clientId : "1144685291014213802" })
    .catch(() => setTimeout(() => startRPC(), 5000));
};
startRPC();

document.addEventListener(
    "keydown", (event) => {
        if (event.code == "Escape") window.router.history.goBack();
        if (event.code == "Numpad1") {
            window.engine.sendToast(
                {
                    title: "Testing",
                    icon: "/src/assets/imgs/icons/wrench.png",
                    body: "Hello World!",
                    onClick: () => window.sound.play( "ui.release" ),
                },
            );
        } else if (event.code == "Numpad2") {
            window.engine.sendToast(
                {
                    title: "Testing - No Icon",
                    body: "Hello World!",
                    onClick: () => window.sound.play( "ui.release" ),
                },
            );
        };
    },
);
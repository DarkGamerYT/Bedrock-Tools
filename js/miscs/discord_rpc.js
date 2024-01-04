const discordRPC = require("discord-rpc");
const rpc = new discordRPC.Client({ transport: "websocket" });
rpc.on(
    "ready", async (data) => {
        let lastRoute;
        let lastTime;
        console.log(data);
        setInterval(
            () => {
                const routeName = router.history.list[router.history.list.length - 1];
                const route = router.routes.find((r) => r.route == routeName);
                    
                if (settings.get( "discordrpc" )) {
                    if (lastRoute != routeName) {
                        lastTime = Date.now();
                        const screenName = localisation.translate(
                            route?.name ?? "bedrocktools.screen.unknown"
                        );

                        rpc.setActivity({
                            details: screenName,
                            state: "Route: " + (route?.route ?? routeName),
                            startTimestamp: lastTime,
                            largeImageKey: "icon",
                            largeImageText: "Bedrock Tools v" + BedrockTools.version,
                            smallImageKey: route?.metadata?.rpc,
                            smallImageText: screenName,
                        });
                    };
                } else RPC.clearActivity();
                lastRoute = routeName;
            }, 5000,
        );
    },
);

startRPC();
function startRPC() {
    rpc.login({ clientId : "1144685291014213802" })
    .catch(() => setTimeout(() => startRPC(), 5000));
};
const RPC = new (require("discord-rpc")).Client({ transport: "ipc" });
RPC.on(
    "ready", async () => {
        console.log( RPC.user );
        let lastRoute;
        let lastTime;
        setInterval(
            () => {
                const routeName = BedrockTools.router.history.list[BedrockTools.router.history.list.length - 1];
                const route = BedrockTools.router.routes.find((r) => r.route == routeName);
                
                if (BedrockTools.settings.get( "discordrpc" )) {
                    if (lastRoute != routeName) {
                        lastTime = Date.now();
                        RPC.setActivity(
                            {
                                details: BedrockTools.localisation.translate(route?.name ?? "bedrocktools.screen.unknown"),
                                state: "Route: " + (route?.route ?? routeName),
                                startTimestamp: lastTime,
                                largeImageKey: "icon",
                                largeImageText: "Bedrock Tools v" + BedrockTools.version,
                                smallImageKey: route?.metadata?.rpc,
                                smallImageText: route?.name,
                            },
                        );
                    };
                } else RPC.clearActivity();
                lastRoute = routeName;
            }, 5000,
        );
    },
);

const startRPC = () => {
    RPC.login({ clientId : "1144685291014213802" })
    .catch(() => setTimeout(() => startRPC(), 5000));
};

startRPC();
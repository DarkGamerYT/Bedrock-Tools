const ServerPinger = {
    Component: () => {
        const isRight = settings.get( "right" );
        const serverPinger = BedrockTools.requestFacet( "bedrocktools.serverPinger" );
        return (
            Components.createHeader({ label: localisation.translate( "bedrocktools.utilities.serverpinger" ), back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    `<div
                                        class="serverImage"
                                        id="serverImage"
                                        style="background-image: url('assets/750.png');"
                                    ></div>`,
                                    Components.createElement("input", {
                                        id: "serverIp",
                                        label: "Server address:",
                                        placeholder: "play.example.com",
                                    }),
                                    Components.createElement("input", {
                                        id: "serverPort",
                                        label: "Server port:",
                                        placeholder: "19132",
                                        input: {
                                            type: "number",
                                            min: 1024,
                                            max: 65565,
                                        },
                                    }),
                                ],
                            },
                        )}
                        ${Components.createElement("button", {
                            id: "ping",
                            label: "Ping",
                            variant: "hero",
                            sound: "ui.release",
                            onClick: () => pingServer(serverPinger),
                        })}
                    </div>
                    <div style="width: 100%;" id="serverData">${serverData()}</div>
                </div>`
            )
        );
    },
};

const serverData = () => {
    return (
        Components.createElements(
            {
                elements: [
                    `<div style="background-color: #1e1e1f">
                        ${Components.createElement("element", {
                            label: "",
                            description: (
                                `<div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 2px; margin-bottom: -8px;">
                                    <div style="display: flex; flex-direction: row; gap: 8px; align-items: end; font-size: 16px; color: white; margin-bottom: 14px;">
                                        <img src="assets/player_image.png" draggable="false" style="image-rendering: pixelated;width: 24px;height: 24px;">
                                        <div id="playerCount">0</div>
                                    </div>
                                </div>`
                            ),
                            space: 0,
                        })}
                    </div>`,
                    `<div style="background-color: #313233">
                        ${Components.createElement("text", {
                            label: "play.example.com",
                            description: "Server address",
                            useLabel: true,
                            id: "hostname",
                        })}
                        ${Components.createElement("text", {
                            label: "19132",
                            description: "Server port",
                            useLabel: true,
                            id: "port",
                        })}
                        ${Components.createElement("text", {
                            label: "Motd",
                            description: `<div style="display: flex; flex-direction: row; user-select: text;"><div style="color: #ff6767">Unable to ping the server.</div></div>`,
                            id: "motd",
                        })}
                    </div>`,
                    `<div id="addToList">
                        ${Components.createElement("panelbutton", {
                            buttons: [
                                Components.createElement("button", {
                                    label: "Add to server list",
                                    id: "addToServerList",
                                    variant: "secondary",
                                    sound: "ui.click",
                                    onClick: () => {},
                                })
                            ]
                        })}
                    </div>`
                ],
            },
        )
    );
};

const pingServer = (serverPinger) => {
    const serverIp = document.getElementById( "serverIp" ).value.trim();
    const serverPort = Number(document.getElementById( "serverPort" ).value) || 19132;
    
    if(serverIp.length > 0) {
        document.getElementById( "serverData" ).innerHTML = (
            `<div style="height: 304.5px; background-color: #2d2e2e; border: 2px solid black; align-items: center; justify-content: center;">
                <img src="assets/loading.gif" style="height: 24px; width: 24px; image-rendering: pixelated;">
            </div>`
        );

        serverPinger.pingServer({ hostname: serverIp, port: serverPort }).then(
            (data) => {
                document.getElementById( "serverData" ).innerHTML = serverData();
                const addToList = document.getElementById( "addToList" );
                if (data.online) addToList.style.display = "block";
                else addToList.style.display = "none";

                document.getElementById( "hostname" ).innerText = data.hostname;
                document.getElementById( "port" ).innerText = data.port;
                document.getElementById( "motd" ).innerHTML = `<div style="display: flex; flex-direction: row; user-select: text;">${data?.motd?.html ?? `<div style="color: #ff6767">Unable to ping the server.</div>`}</div>`;
                document.getElementById( "playerCount" ).innerText = data?.players?.online ?? 0;
                document.getElementById( "addToServerList" ).addEventListener("click", () => electron.shell.openExternal( `minecraft://?addExternalServer=${data.hostname}|${data.hostname}:${data.port}` ));
            },
        );  
    } else BedrockTools.loadModal(
        ErrorModal(
            {
                header: "Something went wrong",
                body: "Address can't be empty",
                center: true,
            },
        ),
    );
};
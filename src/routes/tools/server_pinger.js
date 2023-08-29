window.router.routes.push({
    name: "Server Pinger",
    route: "/server_pinger",
    rpc: "multiplayer",
    component: () => {
        const isRight = window.settings.get( "right" );
        return (
            Components.createHeader({ text: "Server Pinger", back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    `<div
                                        class="serverImage"
                                        id="serverImage"
                                        style="background-image: url('/src/assets/imgs/thumbnail/cobblestone.png');"
                                    ></div>`,
                                    Components.createElement(
                                        {
                                            type: "input",
                                            title: "Server address:",
                                            id: "serverIp",
                                            placeholder: "play.example.com",
                                        },
                                    ),
                                    Components.createElement(
                                        {
                                            type: "input",
                                            title: "Server port:",
                                            id: "serverPort",
                                            placeholder: "19132",
                                            input: {
                                                input: "number",
                                                min: 1024,
                                                max: 65565,
                                            },
                                        },
                                    ),
                                ],
                            },
                        )}
                        ${Components.createElement(
                            {
                                type: "button",
                                text: "Ping",
                                id: "ping",
                                style: "hero",
                                onClick: () => pingServer(),
                            },
                        )}
                        <div style="height: 4px;"></div>
                        <div id="serverListButton" style="display: none;">
                            ${Components.createElement(
                                {
                                    type: "button",
                                    text: "Add to server list",
                                    id: "",
                                    style: "secondary",
                                    onClick: () => {},
                                },
                            )}
                        </div>
                    </div>
                    <div style="width: 100%;" id="serverData">
                        ${serverData()}
                    </div>
                </div>`
            )
        );
    },
});

const serverData = () => {
    return (
        Components.createElements(
            {
                elements: [
                    `<div style="background-color: #2d2e2e">
                        ${
                            Components.createElement(
                                {
                                    type: "element",
                                    title: "",
                                    subtitle: (
                                        `<div style="display: flex; flex-direction: row; justify-content: space-between; margin-top: 4px; margin-bottom: 8px;">
                                            <div style="display: flex; flex-direction: row; gap: 8px; align-items: end; font-size: 16px; color: white; margin-bottom: 14px;">
                                                <img src="/src/assets/imgs/icons/player_image.png" style="image-rendering: pixelated;width: 24px;height: 24px;">
                                                <div id="playerCount">0</div>
                                            </div>
                                            <div style="display: none;">
                                                ${Components.createElement(
                                                    {
                                                        type: "button",
                                                        text: "Add to server list",
                                                        id: "",
                                                        style: "secondary",
                                                        onClick: () => {},
                                                    },
                                                )}
                                            </div>
                                        </div>`
                                    ),
                                    space: 0,
                                },
                            )
                        }
                    </div>`,
                    `<div style="background-color: #3c3e3e">
                        ${
                            Components.createElement(
                                {
                                    type: "text",
                                    title: "play.example.com",
                                    subtitle: "Server address",
                                    useTitle: true,
                                    id: "hostname",
                                },
                            )
                        }
                        ${
                            Components.createElement(
                                {
                                    type: "text",
                                    title: "19132",
                                    subtitle: "Server port",
                                    useTitle: true,
                                    id: "port",
                                },
                            )
                        }
                        ${
                            Components.createElement(
                                {
                                    type: "text",
                                    title: "",
                                    subtitle: `<div style="margin-top: 8px; margin-bottom: 8px; display: flex; flex-direction: row; user-select: text;"><div style="color: #ff6767">Unable to ping the server.</div></div>`,
                                    id: "motd",
                                },
                            )
                        }
                    </div>`,
                    `<div style="display: none;" id="addToList">
                        <div style="flex-direction: row; background-color: #48494a; padding: 0.6rem; padding-left: 32px; padding-right: 32px;">
                            <div class="oreUISpecular" style="border-top-width: var(--base2Scale);"></div>
                            <div class="oreUISpecular" style="border-bottom-width: var(--base2Scale);"></div>
                            <div style="width: 100%;">
                                ${Components.createElement(
                                    {
                                        type: "button",
                                        text: "Add to server list",
                                        id: "addToServerList",
                                        style: "secondary",
                                        onClick: () => {},
                                    },
                                )}
                            </div>
                        </div>
                    </div>`
                ],
            },
        )
    );
};

const pingServer = () => {
    window.sound.play("ui.release");
    const serverIp = document.getElementById( "serverIp" ).value.trim();
    const serverPort = Number(document.getElementById( "serverPort" ).value) || 19132;
    
    if(serverIp.length > 0) {
        document.getElementById( "serverData" ).innerHTML = (
            `<div style="height: 304.5px; background-color: #2d2e2e; border: 2px solid black; align-items: center; justify-content: center;">
                <img src="/src/assets/imgs/icons/load.gif" style="height: 24px; width: 24px; image-rendering: pixelated;">
            </div>`
        );

        pingBedrock({ hostname: serverIp, port: serverPort }).then(
            (data) => {
                document.getElementById( "serverData" ).innerHTML = serverData();
                const addToList = document.getElementById( "addToList" );
                if (data.online) addToList.style = null;
                else addToList.style = "display: none;";

                document.getElementById( "hostname" ).innerText = data.hostname;
                document.getElementById( "port" ).innerText = data.port;
                document.getElementById( "motd" ).innerHTML = `<div style="margin-top: 8px; margin-bottom: 8px; display: flex; flex-direction: row; user-select: text;">${data?.motd?.html ?? `<div style="color: #ff6767">Unable to ping the server.</div>`}</div>`;
                document.getElementById( "playerCount" ).innerText = data?.players?.online ?? 0;
                document.getElementById( "addToServerList" ).addEventListener("click", () => electron.shell.openExternal( `minecraft://?addExternalServer=${data.hostname}|${data.hostname}:${data.port}` ));
            },
        );  
    } else window.engine.loadModal(
        ErrorModal(
            {
                title: "Something went wrong",
                body: "Address can't be empty",
                center: true,
            },
        ),
    );
};
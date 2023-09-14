const IdGenerator = {
    Component: () => {
        return (
            Components.createHeader({ label: BedrockTools.localisation.translate( "bedrocktools.utilities.idgenerator" ), back: true, settings: true })
            + (
                `<div style="margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;">
                    <div id="tabs"></div>
                </div>
                <div id="tabsContent"></div>`
            )
        );
    },
    onLoad: () => idTabs(0),
};

const idTabs = (selected = 0) => {
    const isRight = BedrockTools.settings.get( "right" );
    const tabs = [
        {
            name: "UUID",
            icon: "assets/tools/id.png",
            component: () => {
                return (
                    `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                        <div style="width: 50%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement("input", {
                                            label: "Amount:",
                                            id: "amount",
                                            placeholder: "Amount of UUIDs to generate",
                                            input: {
                                                type: "number",
                                                min: 1,
                                                max: 32,
                                            },
                                            value: "1"
                                        }),
                                    ],
                                },
                            )}
                            ${Components.createElement("button", {
                                label: "Generate",
                                id: "generate",
                                variant: "hero",
                                sound: "ui.release",
                                onClick: () => {
                                    const amount = Number(document.getElementById( "amount" ).value.trim());
                                    if (amount > 0) {
                                        const uuids = [];
                                        for (let i = 1; i <= amount && i <= 32; i++) uuids.push(crypto.randomUUID());
                                        document.getElementById( "output" ).innerText = uuids.join( "\n" );

                                        BedrockTools.sendToast(
                                            {
                                                label: "UUID's Generated!",
                                                icon: "assets/tools/id.png",
                                                body: "Click to copy the UUID's to clipboard",
                                                onClick: () => {
                                                    BedrockTools.sound.play( "ui.modal_hide" );
                                                    navigator.clipboard.writeText( uuids.join("\n") );
                                                    BedrockTools.sendToast(
                                                        {
                                                            label: "UUID's successfully copied!",
                                                            icon: "assets/checkbox.png",
                                                            body: "The UUID's has been successfully copied to the clipboard",
                                                            instant: true,
                                                        },
                                                    );
                                                },
                                            },
                                        );
                                    };
                                },
                            })}
                        </div>
                        <div style="width: 100%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement("text", {
                                            label: "Output:",
                                            id: "output",
                                            default: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                                            style: "code",
                                        }),
                                    ],
                                },
                            )}
                        </div>
                    </div>`
                );
            },
        },
        {
            name: "Custom ID",
            icon: "assets/coding.png",
            component: () => {
                return (
                    `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                        <div style="width: 50%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement("input", {
                                            label: "Amount:",
                                            id: "amount",
                                            placeholder: "Amount of IDs to generate",
                                            input: {
                                                type: "number",
                                                min: 1,
                                                max: 32,
                                            },
                                        }),
                                        Components.createElement("input", {
                                            label: "Characters:",
                                            id: "characters",
                                            placeholder: "Characters to choose from"
                                        }),
                                        Components.createElement("input", {
                                            label: "Length:",
                                            id: "idLength",
                                            placeholder: "The length of the id",
                                            input: {
                                                type: "number",
                                                min: 1,
                                                max: 100,
                                            },
                                        }),
                                    ],
                                },
                            )}
                            ${Components.createElement("button", {
                                label: "Generate",
                                id: "generate",
                                variant: "hero",
                                onClick: () => {
                                    BedrockTools.sound.play("ui.release");
                                    const amount = Number(document.getElementById( "amount" ).value.trim());
                                    const characters = String(document.getElementById( "characters" ).value.trim());
                                    const idLength = Number(document.getElementById( "idLength" ).value.trim());

                                    if(!characters || characters.trim().length == 0)
                                    {
                                        BedrockTools.loadModal(
                                            ErrorModal(
                                                {
                                                    label: "Something went wrong",
                                                    body: "Characters cannot be empty or whitespace!",
                                                    center: true
                                                }
                                            )
                                        );
                                    } 
                                    else if (amount > 0 && idLength > 0) 
                                    {
                                        const ids = [];
                                        for (let i = 0; i < amount && i < 32; i++) {
                                            var id = "";
                                            for(let i = 0; i < idLength; i++)
                                                id += characters[Math.floor(Math.random() * characters.length)];
                                            ids.push(id);
                                        }
                                            
                                        if(ids.length > 0)
                                        {
                                            document.getElementById( "output" ).innerText = ids.join( "\n" );
                                            BedrockTools.sendToast(
                                                {
                                                    label: "ID's Generated!",
                                                    icon: "assets/coding.png",
                                                    body: "Click to copy the ID's to clipboard",
                                                    onClick: () => {
                                                        BedrockTools.sound.play( "ui.modal_hide" );
                                                        navigator.clipboard.writeText( uuids.join("\n") );
                                                        BedrockTools.sendToast(
                                                            {
                                                                label: "Custom ID's successfully copied!",
                                                                icon: "assets/checkbox.png",
                                                                body: "The custom ID's has been successfully copied to the clipboard",
                                                                instant: true,
                                                            },
                                                        );
                                                    },
                                                },
                                            );
                                        }    
                                    };
                                },
                            })}
                        </div>
                        <div style="width: 100%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement("text", {
                                            label: "Output:",
                                            id: "output",
                                            default: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                                            style: "code",
                                        }),
                                    ],
                                },
                            )}
                        </div>
                    </div>`
                );
            },
        },
    ];

    const tabsElement = document.getElementById( "tabs" );
    if (
        tabsElement.getAttribute( "value" )
        && Number(tabsElement.getAttribute( "value" )) == selected
    ) return;

    document.getElementById( "tabsContent" ).innerHTML = tabs.find((t, index) => index == selected).component();
    tabsElement.setAttribute( "value", selected.toString() );
    tabsElement.innerHTML = (
        Components.createTabs(
            {
                tabs: tabs.map(
                    (t, index) => Components.createTab(
                        {
                            label: t.name,
                            id: index.toString(),
                            icon: t.icon,
                            selected: index == selected,
                            onClick: (e) => idTabs(e.id),
                        },
                    ),
                ),
            },
        )
    );
};
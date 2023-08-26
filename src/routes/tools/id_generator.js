window.router.routes.push({
    name: "ID Generator",
    route: "/id_generator",
    rpc: "id",
    component: () => {
        return (
            Components.createHeader({ text: "ID Generator", back: true, settings: true })
            + (
                `<div style="margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;">
                    <div id="tabs"></div>
                </div>
                <div id="tabsContent"></div>`
            )
        );
    },
    extra: () => uuidTabs(0),
});

const uuidTabs = (selected = 0) => {
    const isRight = window.settings.get( "right" );
    const tabs = [
        {
            name: "UUID",
            component: () => {
                return (
                    `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                        <div style="width: 50%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement(
                                            {
                                                type: "input",
                                                title: "Amount:",
                                                id: "amount",
                                                placeholder: "Amount of UUIDs to generate",
                                                input: {
                                                    type: "number",
                                                    min: 1,
                                                    max: 32,
                                                },
                                            },
                                        ),
                                    ],
                                },
                            )}
                            ${Components.createElement(
                                {
                                    type: "button",
                                    text: "Generate",
                                    id: "generate",
                                    style: "hero",
                                    onClick: () => {
                                        window.sound.play( "ui.release" );
        
                                        const amount = Number(document.getElementById( "amount" ).value.trim());
                                        if (amount > 0) {
                                            const uuids = [];
                                            for (let i = 1; i <= amount && i <= 32; i++) uuids.push(crypto.randomUUID());
                                            document.getElementById( "output" ).innerText = uuids.join( "\n" );
                                        };
                                    },
                                },
                            )}
                        </div>
                        <div style="width: 100%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement(
                                            {
                                                type: "text",
                                                title: "Output:",
                                                id: "output",
                                                default: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                                                style: "code",
                                            },
                                        ),
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
            component: () => {
                return (
                    `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                        <div style="width: 50%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement(
                                            {
                                                type: "input",
                                                title: "Amount:",
                                                id: "amount",
                                                placeholder: "Amount of IDs to generate",
                                                input: {
                                                    type: "number",
                                                    min: 1,
                                                    max: 32,
                                                },
                                            }
                                        ),
                                        Components.createElement(
                                            {
                                                type: "input",
                                                title: "Characters:",
                                                id: "characters",
                                                placeholder: "Characters to choose from"
                                            },
                                        ),
                                        Components.createElement(
                                            {
                                                type: "input",
                                                title: "Length:",
                                                id: "idLength",
                                                placeholder: "The length of the id",
                                                input: {
                                                    type: "number",
                                                    min: 1,
                                                    max: 100,
                                                },
                                            }
                                        ),
                                    ],
                                },
                            )},
                            ${Components.createElement(
                                {
                                    type: "button",
                                    text: "Generate",
                                    id: "generate",
                                    style: "hero",
                                    onClick: () => {
                                        window.sound.play( "ui.release" );
        
                                        const amount = Number(document.getElementById( "amount" ).value.trim());
                                        const characters = String(document.getElementById( "characters" ).value.trim());
                                        const idLength = Number(document.getElementById( "idLength" ).value.trim());

                                        if(!characters || characters.trim().length == 0)
                                        {
                                            window.engine.loadModal(
                                                ErrorModal(
                                                    {
                                                        title: "Something went wrong",
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
                                            
                                            document.getElementById( "output" ).innerText = ids.join( "\n" );
                                        };
                                    },
                                },
                            )}
                        </div>
                        <div style="width: 100%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement(
                                            {
                                                type: "text",
                                                title: "Output:",
                                                id: "output",
                                                default: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                                                style: "code",
                                            },
                                        ),
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
    tabsElement.setAttribute( "value", selected )
    tabsElement.innerHTML = (
        Components.createTabs(
            {
                tabs: tabs.map(
                    (t, index) => Components.createTab(
                        {
                            text: t.name,
                            id: index,
                            selected: index == selected,
                            onClick: (e) => uuidTabs(e.id),
                        },
                    ),
                ),
            },
        )
    );
};
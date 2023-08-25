const ManifestGeneratorRoute = () => {
    return (
        Components.createHeader({ text: "Manifest Generator", back: true, settings: true })
        + (
            `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 65%;">
                ${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "dropdown",
                                    title: "Pack type:",
                                    id: "packType",
                                    items: [
                                        "Resource Pack",
                                        "Behaviour Pack",
                                        "Skin Pack",
                                    ],
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "input",
                                    title: "Pack name:",
                                    id: "packName",
                                    placeholder: "Test Pack"
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "input",
                                    title: "Pack description:",
                                    id: "packDescription",
                                    placeholder: "Hello World!"
                                },
                            ),
                        ],
                    },
                )}
                ${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "toggle",
                                    title: "Script-API",
                                    subtitle: "Enables ScriptAPI",
                                    id: "scriptApiToggle",
                                },
                            ),
                        ],
                    },
                )}
                ${Components.createElement(
                    {
                        type: "button",
                        text: "Generate",
                        id: "generatePack",
                        onClick: () => {
                            const toggle = document.getElementById( "scriptApiToggle" );
                            console.log( toggle?.getAttribute( "value" ) );
                        },
                    },
                )}
            </div>`
        )
    );
};

window.router.routes.push({ route: "/manifest_generator", component: ManifestGeneratorRoute });
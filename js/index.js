const electron = require( "@electron/remote" );
const fs = require( "node:fs" );
const NBT = require( "prismarine-nbt" );
electron.ipcMain.on("update-available", (data) => console.log(data));
document.addEventListener(
    "keydown", (event) => {
        if (event.code == "Escape") {
            const popup = document.getElementById( "popup" );
            if (popup.innerText.trim().length > 0) popup.innerText = "";
            else BedrockTools.router.history.goBack();
        };
        
        //Toast Debug
        if (BedrockTools.settings.get( "debug" )) {
            if (event.code == "Numpad1") {
                BedrockTools.sendToast(
                    {
                        title: "Test Toast",
                        icon: "assets/wrench.png",
                        body: "Hello World!",
                        onClick: () => BedrockTools.sound.play( "ui.release" ),
                    },
                );
            } else if (event.code == "Numpad2") {
                BedrockTools.sendToast(
                    {
                        title: "Test Toast - No Icon",
                        body: "Hello World!",
                        onClick: () => BedrockTools.sound.play( "ui.release" ),
                    },
                );
            } else if (event.code == "Numpad7") {
                BedrockTools.loadModal(
                    Components.createModal(
                        {
                            title: "Header",
                            body: "Looong description. Lemon drops lollipop jelly beans powder brownie chocolate cake pastry chocolate cake powder. Bonbon candy canes dessert muffin gummies.",
                            close: true,
                            bodyElements: [  
                                Components.createElement(
                                    {
                                        type: "input",
                                        title: "Label",
                                        placeholder: "Placeholder",
                                        subtitle: "Description",
                                        id: "modal-input"
                                    },
                                ),
                            ],
                            elements: [
                                Components.createElement(
                                    {
                                        type: "checkbox",
                                        title: "Checkbox example for confirmation",
                                        id: "checkbox",
                                        checked: false,
                                        onClick: () => {}
                                    }
                                ),
                                `<div class="element" style="padding-left: 0.6rem;padding-right: 0.6rem;gap: 8px;">
                                    <div style="width: 100%;margin-top: 6px;margin-bottom: 6px;gap: 4px;">
                                        ${Components.createElement(
                                            {
                                                type: "button",
                                                text: "Label",
                                                id: "button-2",
                                                style: "primary",
                                                onClick: () => {}
                                            },
                                        )}
                                        ${Components.createElement(
                                            {
                                                type: "button",
                                                text: "Label",
                                                id: "button-3",
                                                style: "secondary",
                                                onClick: () => {}
                                            },
                                        )}
                                    </div>
                                </div>`
                            ]
                        }
                    ),
                );
            } else if (event.code == "Numpad8") {
                BedrockTools.loadModal(
                    Components.createModal(
                        {
                            title: "Header",
                            icon: "assets/rectangle.png",
                            body: (
                                "Looong description. Lemon drops lollipop jelly beans powder brownie chocolate cake pastry chocolate cake powder. Bonbon candy canes dessert muffin gummies."
                                + "<p></p>"
                                + "Tart wafer tart powder. Bonbon toffee macaroon gingerbread candy canes bear claw."
                            ),
                            elements: [
                                `<div class="element" style="padding-left: 0.6rem;padding-right: 0.6rem;gap: 8px;">
                                    <div style="margin-top: 6px;margin-bottom: 6px;flex-direction: row;gap: 4px;">
                                        <div style="width: 100%;">
                                            ${Components.createElement(
                                                {
                                                    type: "button",
                                                    text: "Label",
                                                    id: "modal-button-2",
                                                    style: "secondary",
                                                    onClick: () => {}
                                                },
                                            )}
                                        </div>
                                        <div style="width: 100%;">
                                            ${Components.createElement(
                                                {
                                                    type: "button",
                                                    text: "Label",
                                                    id: "modal-button-1",
                                                    style: "primary",
                                                    onClick: () => {}
                                                },
                                            )}
                                        </div>
                                    </div>
                                </div>`
                            ]
                        }
                    ),
                );
            } else if (event.code == "Numpad9") {
                BedrockTools.loadModal(
                    Components.createModal(
                        {
                            title: "Header",
                            close: true,
                            elements: [
                                Components.createElement(
                                    {
                                        type: "dropdown",
                                        title: "Label",
                                        subtitle: "Description text that explains what this dropdown is about. It can be multiple lines long.",
                                        id: "modal-dropdown",
                                        selected: 0,
                                        items: [ "One", "Two", "Three", "Four", "Five" ],
                                        onChange: () => {}
                                    },
                                )
                            ]
                        }
                    ),
                );
            };
        };
    },
);

BedrockTools.router.routes.push(
    {
        route: "/main_screen",
        name: "bedrocktools.screen.mainscreen",
        component: MainScreen.Component,
        metadata: {},
    },
    {
        route: "/settings",
        name: "bedrocktools.screen.settings",
        component: Settings.Component,
        metadata: {},
    },
    {
        route: "/manifest_generator",
        name: "bedrocktools.addons.manifestgenerator",
        component: ManifestGenerator.Component,
        metadata: { rpc: "manifest" },
    },
    {
        route: "/id_generator",
        name: "bedrocktools.utilities.idgenerator",
        component: IdGenerator.Component,
        metadata: {
            rpc: "id",
            onLoad: IdGenerator.onLoad,
        },
    },
    {
        route: "/server_pinger",
        name: "bedrocktools.utilities.serverpinger",
        component: ServerPinger.Component,
        metadata: { rpc: "multiplayer" },
    },
    {
        route: "/structure_converter",
        name: "bedrocktools.advanced.structureconverter",
        component: StructureConverter.Component,
        metadata: { rpc: "structure_converter" },
    },
    {
        route: "/structure_editor",
        name: "bedrocktools.advanced.structureeditor",
        component: StructureEditor.Component,
        metadata: {
            rpc: "structure_editor",
            onLoad: StructureEditor.onLoad,
        },
    },
    {
        route: "/loop_generator",
        name: "bedrocktools.utilities.loopgenerator",
        component: LoopGenerator.Component,
        metadata: {
            rpc: "debug",
            onLoad: LoopGenerator.onLoad,
        },
    },
    {
        route: "/commands_tester",
        name: "bedrocktools.utilities.commandstester",
        component: CommandTester.Component,
        metadata: { rpc: "commands" },
    },
    {
        route: "/world_generator",
        name: "bedrocktools.advanced.worldgenerator",
        component: WorldGenerator.Component,
        metadata: {
            rpc: "world_gen",
            onLoad: WorldGenerator.onLoad,
        },
    },
    {
        route: "/json_rawtext_generator",
        name: "bedrocktools.addons.rawtextgenerator",
        component: RawtextGenerator.Component,
        metadata: { rpc: "rawtext_generator" },
    },
    {
        route: "/render_offset_corrector",
        name: "bedrocktools.addons.renderoffsetcorrector",
        component: RenderOffset.Component,
        metadata: { rpc: "render_offset" },
    },
    
    {
        route: "/components",
        name: "bedrocktools.debug.components",
        component: ComponentsRoute.Component,
        metadata: {},
    },
);

BedrockTools.router.history.go( "/main_screen" );
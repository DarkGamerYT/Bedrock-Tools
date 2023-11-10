const electron = require( "@electron/remote" );
const fs = require( "node:fs" );
const NBT = require( "prismarine-nbt" );
electron.ipcMain.on("update-available", (data) => console.log(data));
document.addEventListener(
    "keydown", (event) => {
        if (event.code == "Escape") {
            if (BedrockTools.isModalOpen()) BedrockTools.clearModal();
            else router.history.goBack();
        };
        
        //Toast Debug
        if (settings.get( "debug" )) {
            switch(event.code) {
                case "Numpad1":
                    BedrockTools.sendToast({
                        icon: "assets/wrench.png",
                        label: "Test Toast",
                        body: "Hello World!",
                        onClick: () => sound.play( "ui.release" ),
                    });
                break;
                case "Numpad2":
                    BedrockTools.sendToast({
                        label: "Test Toast - No Icon",
                        body: "Hello World!",
                        onClick: () => sound.play( "ui.release" ),
                    });
                break;
                case "Numpad7":
                    BedrockTools.loadModal(
                        Components.createModal({
                            label: "Header",
                            body: "Looong description. Lemon drops lollipop jelly beans powder brownie chocolate cake pastry chocolate cake powder. Bonbon candy canes dessert muffin gummies.",
                            close: true,
                            bodyElements: [  
                                Components.createElement("input", {
                                    label: "Label",
                                    placeholder: "Placeholder",
                                    description: "Description",
                                    id: "modal-input"
                                }),
                            ],
                            elements: [
                                Components.createElement("checkbox", {
                                    label: "Checkbox example for confirmation",
                                    id: "checkbox",
                                    checked: false,
                                    onChange: () => {}
                                }),
                                `<div class="element" style="padding-left: 0.6rem;padding-right: 0.6rem;gap: 8px;">
                                    <div style="width: 100%;margin-top: 6px;margin-bottom: 6px;gap: 4px;">
                                        ${Components.createElement("button", {
                                            label: "Label",
                                            id: "button-2",
                                            variant: "primary",
                                            sound: "ui.click",
                                            onClick: () => {}
                                        })}
                                        ${Components.createElement("button", {
                                            label: "Label",
                                            id: "button-3",
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => {}
                                        })}
                                    </div>
                                </div>`
                            ]
                        })
                    );
                break;
                case "Numpad8":
                    BedrockTools.loadModal(
                        Components.createModal({
                            label: "Header",
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
                                            ${Components.createElement("button", {
                                                label: "Label",
                                                id: "modal-button-2",
                                                variant: "secondary",
                                                sound: "ui.click",
                                                onClick: () => {}
                                            })}
                                        </div>
                                        <div style="width: 100%;">
                                            ${Components.createElement("button", {
                                                label: "Label",
                                                id: "modal-button-1",
                                                variant: "primary",
                                                sound: "ui.click",
                                                onClick: () => {}
                                            })}
                                        </div>
                                    </div>
                                </div>`
                            ]
                        })
                    );
                break;
                case "Numpad9":
                    BedrockTools.loadModal(
                        Components.createModal({
                            label: "Header",
                            close: true,
                            elements: [
                                Components.createElement("dropdown", {
                                    label: "Label",
                                    description: "Description text that explains what this dropdown is about. It can be multiple lines long.",
                                    id: "modal-dropdown",
                                    selected: 0,
                                    items: [ "One", "Two", "Three", "Four", "Five" ],
                                    onChange: () => {}
                                })
                            ]
                        }),
                    );
                break;
            };
        };
    },
);

router.addRoute(
    {
        route: "/main_screen",
        name: "bedrocktools.screen.mainscreen",
        default: true,
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
        route: "/mer",
        name: "bedrocktools.graphics.mer",
        component: MER.Component,
        metadata: { rpc: "mer" },
    },

    {
        route: "/components",
        name: "bedrocktools.debug.components",
        component: ComponentsRoute.Component,
        metadata: {},
    },
);
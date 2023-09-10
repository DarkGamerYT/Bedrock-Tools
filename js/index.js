const electron = require( "@electron/remote" );
const fs = require( "node:fs" );
const NBT = require( "prismarine-nbt" );
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
);

BedrockTools.router.history.go( "/main_screen" );
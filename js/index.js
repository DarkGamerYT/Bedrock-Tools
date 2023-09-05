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
        name: "Main Screen",
        component: MainScreen.Component,
        metadata: {},
    },
    {
        route: "/settings",
        name: "Settings",
        component: Settings.Component,
        metadata: {},
    },
    {
        route: "/manifest_generator",
        name: "Manifest Generator",
        component: ManifestGenerator.Component,
        metadata: { rpc: "manifest" },
    },
    {
        route: "/id_generator",
        name: "ID Generator",
        component: IdGenerator.Component,
        metadata: {
            rpc: "id",
            onLoad: IdGenerator.onLoad,
        },
    },
    {
        route: "/server_pinger",
        name: "Server Pinger",
        component: ServerPinger.Component,
        metadata: { rpc: "multiplayer" },
    },
    {
        route: "/server_pinger",
        name: "Server Pinger",
        component: ServerPinger.Component,
        metadata: { rpc: "multiplayer" },
    },
    {
        route: "/structure_converter",
        name: "Structure Converter",
        component: StructureConverter.Component,
        metadata: { rpc: "structure_converter" },
    },
    {
        route: "/structure_editor",
        name: "Structure Editor",
        component: StructureEditor.Component,
        metadata: {
            rpc: "structure_editor",
            onLoad: StructureEditor.onLoad,
        },
    },
    {
        route: "/loop_generator",
        name: "Loop Generator",
        component: LoopGenerator.Component,
        metadata: {
            rpc: "debug",
            onLoad: LoopGenerator.onLoad,
        },
    },
    {
        route: "/commands_tester",
        name: "Commands Tester",
        component: CommandTester.Component,
        metadata: { rpc: "commands" },
    },
    {
        route: "/world_generator",
        name: "World Generator",
        component: WorldGenerator.Component,
        metadata: {
            rpc: "world_gen",
            onLoad: WorldGenerator.onLoad,
        },
    },
    {
        route: "/json_rawtext_generator",
        name: "JSON Rawtext Generator",
        component: RawtextGenerator.Component,
        metadata: { rpc: "rawtext_generator" },
    },
    {
        route: "/render_offset_corrector",
        name: "Render Offset Corrector",
        component: RenderOffset.Component,
        metadata: { rpc: "render_offset" },
    },
);

BedrockTools.router.history.go( "/main_screen" );
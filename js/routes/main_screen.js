const MainScreen = {
    Component: () => {
        const tools = [
            [
                {
                    label: BedrockTools.localisation.translate( "bedrocktools.addons.title" ),
                    description: BedrockTools.localisation.translate( "bedrocktools.addons.description" ),
                    items: [
                        {
                            route: "/manifest_generator",
                            label: BedrockTools.localisation.translate( "bedrocktools.addons.manifestgenerator" ),
                            icon: "assets/tools/manifest.png",
                        },
                        {
                            route: "/render_offset_corrector",
                            label: BedrockTools.localisation.translate( "bedrocktools.addons.renderoffsetcorrector" ),
                            icon: "assets/tools/render_offset.png"
                        },
                        {
                            route: "/json_rawtext_generator",
                            label: BedrockTools.localisation.translate( "bedrocktools.addons.rawtextgenerator" ),
                            icon: "assets/tools/rawtext_gen.png"
                        }
                    ],
                    display: true,
                },
                {
                    label: BedrockTools.localisation.translate( "bedrocktools.utilities.title" ),
                    description: BedrockTools.localisation.translate( "bedrocktools.utilities.description" ),
                    items: [
                        {
                            route: "/id_generator",
                            label: BedrockTools.localisation.translate( "bedrocktools.utilities.idgenerator" ),
                            icon: "assets/tools/id.png",
                        },
                        /*{
                            route: "/commands_tester",
                            label: BedrockTools.localisation.translate( "bedrocktools.utilities.commandstester" ),
                            icon: "assets/tools/commands.png",
                        },*/
                        {
                            route: "/server_pinger",
                            label: BedrockTools.localisation.translate( "bedrocktools.utilities.serverpinger" ),
                            icon: "assets/tools/server_pinger.png",
                        },
                        {
                            route: "/loop_generator",
                            label: BedrockTools.localisation.translate( "bedrocktools.utilities.loopgenerator" ),
                            icon: "assets/tools/debug.png"
                        }
                    ],
                    display: true,
                },
                {
                    label: BedrockTools.localisation.translate( "bedrocktools.advanced.title" ),
                    description: BedrockTools.localisation.translate( "bedrocktools.advanced.description" ),
                    items: [
                        {
                            route: "/world_generator",
                            label: BedrockTools.localisation.translate( "bedrocktools.advanced.worldgenerator" ),
                            icon: "assets/tools/world_gen.png",
                        },
                        {
                            route: "/structure_converter",
                            label: BedrockTools.localisation.translate( "bedrocktools.advanced.structureconverter" ),
                            icon: "assets/tools/structure_converter.png",
                        },
                        {
                            route: "/structure_editor",
                            label: BedrockTools.localisation.translate( "bedrocktools.advanced.structureeditor" ),
                            icon: "assets/tools/structure_editor.png"
                        }
                    ],
                    display: true,
                },
            ],
            [
                {
                    label: BedrockTools.localisation.translate( "bedrocktools.graphics.title" ),
                    description: BedrockTools.localisation.translate( "bedrocktools.graphics.description" ),
                    items: [
                        {
                            route: "/mer",
                            label: BedrockTools.localisation.translate( "bedrocktools.graphics.mer" ),
                            icon: "assets/tools/mer.png",
                        },
                        {
                            route: "/heightmap",
                            label: BedrockTools.localisation.translate( "bedrocktools.graphics.heightmap" ),
                            icon: "assets/tools/heightmap.png",
                        }
                    ],
                    display: true,
                },
                {
                    label: BedrockTools.localisation.translate( "bedrocktools.debug.title" ),
                    description: BedrockTools.localisation.translate( "bedrocktools.debug.description" ),
                    items: [
                        {
                            route: "/components",
                            label: BedrockTools.localisation.translate( "bedrocktools.debug.components" ),
                            icon: "assets/tools/debug.png",
                        },
                    ],
                    display: true,
                },
            ],
        ];
    
        return (
            Components.createHeader({ label: BedrockTools.localisation.translate( "bedrocktools.name" ), back: false, settings: true })
            + (
                `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 95%;">
                    ${
                        BedrockTools.settings.get( "alpha_notice" )
                        ? `<div class="infoElement" id="alphaNotice">
                            <div class="informativeText">${BedrockTools.localisation.translate( "bedrocktools.alpha_notice" )}</div>
                            <div class="infoElementClose" onclick="BedrockTools.settings.set( 'alpha_notice', false ); document.getElementById( 'alphaNotice' ).remove();"><img src="assets/close_white.png" draggable="false" style="image-rendering: pixelated;"></div>
                        </div>`
                        : ""
                    }
                    <div class="elements">
                        <div class="element_" style="padding-left: 16px;padding-right: 16px;border-top: 2px solid rgba(255, 255, 255, 0.1);border-bottom: 2px solid rgba(0, 0, 0, 0.3);">
                            <span class="elementHeader" style="font-size: 14px;margin-top: 6px;">${BedrockTools.localisation.translate( "bedrocktools.name" )}</span>
                            <span class="elementSubtitle" style="font-size: 12px;margin-bottom: 10px;margin-top: 0;">${BedrockTools.localisation.translate( "bedrocktools.description" )}</span>
                        </div>
                        ${
                            tools.map(
                                (t) => (
                                    `<div style="display: flex;flex-direction: unset;padding-left: 4px;padding-right: 2px;padding-bottom: 4px;border-top: 2px solid rgba(255, 255, 255, 0.1);border-bottom: 2px solid rgba(0, 0, 0, 0.3);">
                                        ${
                                            t.map(
                                                (m) => (
                                                    m.display
                                                    ? (
                                                        `<div class="elementsMenu">
                                                        <div class="elements" style="margin-top: -8px;margin-bottom: 16px;border: unset;border-bottom: 2px solid black;">
                                                            <div class="element_" style="padding: 4px 16px;border-top: 2px solid rgba(255, 255, 255, 0.1);">
                                                                <span class="elementHeader" style="font-size: 14px;margin-top: 6px;">` + m.label + `</span>
                                                                <span class="elementSubtitle" style="font-size: 12px;margin-bottom: 10px;margin-top: 0;">` + m.description + `</span>
                                                            </div>
                                                        </div>
                                                        ${
                                                            m.items.map(
                                                                (i) => (
                                                                    `<div class="elementMenu" onClick="BedrockTools.sound.play( 'ui.click' ); BedrockTools.router.history.go('${i.route}');">
                                                                        <div class="elementIcon">
                                                                            <img src="${i.icon}" draggable="false" class="elementIconImage">
                                                                            <div style="left: 0; position: absolute;"><div class="elementIconHover"></div></div>
                                                                        </div>
                                                                        <span class="elementTitle">${i.label}</span>
                                                                    </div>`
                                                                )
                                                            ).join( "" )
                                                        }
                                                        </div>`
                                                    ) : ""
                                                )
                                            ).join( "" )
                                        }
                                    </div>`
                                )
                            ).join( "" )
                        }
                    </div>
                </div>`
            )
        );
    },
};
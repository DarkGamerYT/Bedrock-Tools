const MainScreen = {
    Component: () => {
        const tools = [
            [
                {
                    label: localisation.translate( "bedrocktools.addons.title" ),
                    description: localisation.translate( "bedrocktools.addons.description" ),
                    items: [
                        {
                            route: "/manifest_generator",
                            label: localisation.translate( "bedrocktools.addons.manifestgenerator" ),
                            icon: "assets/tools/manifest.png",
                        },
                        {
                            route: "/render_offset_corrector",
                            label: localisation.translate( "bedrocktools.addons.renderoffsetcorrector" ),
                            icon: "assets/tools/render_offset.png"
                        },
                        {
                            route: "/json_rawtext_generator",
                            label: localisation.translate( "bedrocktools.addons.rawtextgenerator" ),
                            icon: "assets/tools/rawtext_gen.png"
                        }
                    ],
                    display: true,
                },
                {
                    label: localisation.translate( "bedrocktools.utilities.title" ),
                    description: localisation.translate( "bedrocktools.utilities.description" ),
                    items: [
                        {
                            route: "/id_generator",
                            label: localisation.translate( "bedrocktools.utilities.idgenerator" ),
                            icon: "assets/tools/id.png",
                        },
                        /*{
                            route: "/commands_tester",
                            label: localisation.translate( "bedrocktools.utilities.commandstester" ),
                            icon: "assets/tools/commands.png",
                        },*/
                        {
                            route: "/server_pinger",
                            label: localisation.translate( "bedrocktools.utilities.serverpinger" ),
                            icon: "assets/tools/server_pinger.png",
                        },
                        {
                            route: "/loop_generator",
                            label: localisation.translate( "bedrocktools.utilities.loopgenerator" ),
                            icon: "assets/tools/debug.png"
                        }
                    ],
                    display: true,
                },
                {
                    label: localisation.translate( "bedrocktools.advanced.title" ),
                    description: localisation.translate( "bedrocktools.advanced.description" ),
                    items: [
                        {
                            route: "/world_generator",
                            label: localisation.translate( "bedrocktools.advanced.worldgenerator" ),
                            icon: "assets/tools/world_gen.png",
                        },
                        {
                            route: "/structure_converter",
                            label: localisation.translate( "bedrocktools.advanced.structureconverter" ),
                            icon: "assets/tools/structure_converter.png",
                        },
                        {
                            route: "/structure_editor",
                            label: localisation.translate( "bedrocktools.advanced.structureeditor" ),
                            icon: "assets/tools/structure_editor.png"
                        }
                    ],
                    display: true,
                },
            ],
            [
                {
                    label: localisation.translate( "bedrocktools.graphics.title" ),
                    description: localisation.translate( "bedrocktools.graphics.description" ),
                    items: [
                        {
                            route: "/mer",
                            label: localisation.translate( "bedrocktools.graphics.mer" ),
                            icon: "assets/tools/mer.png",
                        },
                        {
                            route: "/heightmap",
                            label: localisation.translate( "bedrocktools.graphics.heightmap" ),
                            icon: "assets/tools/heightmap.png",
                        }
                    ],
                    display: true,
                },
                {
                    label: localisation.translate( "bedrocktools.debug.title" ),
                    description: localisation.translate( "bedrocktools.debug.description" ),
                    items: [
                        {
                            route: "/components",
                            label: localisation.translate( "bedrocktools.debug.components" ),
                            icon: "assets/tools/debug.png",
                        },
                    ],
                    display: true,
                },
            ],
        ];
    
        return (
            Components.createHeader({ label: localisation.translate( "bedrocktools.name" ), back: false, settings: true })
            + (
                `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 95%;">
                    ${
                        settings.get( "alpha_notice" )
                        ? `<div class="infoElement" id="alphaNotice">
                            <div class="informativeText">${localisation.translate( "bedrocktools.alpha_notice" )}</div>
                            <div class="infoElementClose" onclick="settings.set( 'alpha_notice', false ); document.getElementById( 'alphaNotice' ).remove();"><img src="assets/close_white.png" draggable="false" style="image-rendering: pixelated;"></div>
                        </div>`
                        : ""
                    }
                    <div class="elements">
                        <div class="element_" style="padding-left: 16px;padding-right: 16px;border-top: 2px solid rgba(255, 255, 255, 0.1);border-bottom: 2px solid rgba(0, 0, 0, 0.3);">
                            <span class="elementHeader" style="font-size: 16px;margin-top: 6px;">${localisation.translate( "bedrocktools.name" )}</span>
                            <span class="elementSubtitle" style="font-size: 13px;margin-bottom: 10px;margin-top: 0;">${localisation.translate( "bedrocktools.description" )}</span>
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
                                                                <span class="elementHeader" style="font-size: 15px;margin-top: 6px;">` + m.label + `</span>
                                                                <span class="elementSubtitle" style="font-size: 12px;margin-bottom: 10px;margin-top: 0;">` + m.description + `</span>
                                                            </div>
                                                        </div>
                                                        ${
                                                            m.items.map(
                                                                (i) => (
                                                                    `<div class="elementMenu" onClick="sound.play( 'ui.click' ); router.history.go('${i.route}');">
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
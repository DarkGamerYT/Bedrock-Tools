window.router.routes.push({
    name: "Main Screen",
    route: "/main_screen",
    component: () => {
        const tools = [
            [
                {
                    title: "Add-ons",
                    description: "For creators of game packs and other add-ons",
                    items: [
                        {
                            route: "/manifest_generator",
                            title: "Manifest Generator",
                            icon: "assets/imgs/icons/manifest.png",
                        },
                        {
                            route: "/render_offset_corrector",
                            title: "Render Offset Corrector",
                            icon: "assets/imgs/icons/render_offset.png"
                        },
                        {
                            route: "/json_rawtext_generator",
                            title: "JSON Rawtext Generator",
                            icon: "assets/imgs/icons/rawtext_gen.png"
                        }
                    ],
                    display: true,
                },
                {
                    title: "Utilities",
                    description: "Useful tools",
                    items: [
                        {
                            route: "/id_generator",
                            title: "ID Generator",
                            icon: "assets/imgs/icons/id.png",
                        },
                        /*{
                            route: "/commands_tester",
                            title: "Commands Tester",
                            icon: "assets/imgs/icons/commands.png",
                        },*/
                        {
                            route: "/server_pinger",
                            title: "Server Pinger",
                            icon: "assets/imgs/icons/server_pinger.png",
                        },
                        {
                            route: "/loop_generator",
                            title: "Loop Generator",
                            icon: "assets/imgs/icons/debug.png"
                        }
                    ],
                    display: true,
                },
            ],
            [
                {
                    title: "Advanced",
                    description: "Advanced stuff",
                    items: [
                        {
                            route: "/world_generator",
                            title: "World Generator",
                            icon: "assets/imgs/icons/world_gen.png",
                        },
                        {
                            route: "/structure_converter",
                            title: "Structure Converter",
                            icon: "assets/imgs/icons/structure_converter.png",
                        },
                        {
                            route: "/structure_editor",
                            title: "Structure Editor",
                            icon: "assets/imgs/icons/structure_editor.png"
                        }
                    ],
                    display: true,
                },
                {
                    title: "Advanced",
                    description: "Advanced stuff",
                    items: [
                        {
                            route: "/nbt_editor",
                            title: "NBT Editor",
                            icon: "assets/imgs/icons/nbt.png",
                        }
                    ],
                    display: false,
                },
            ],
            /*[
                {
                    title: "Internal Tools",
                    description: "For developers only, will not show up in retail",
                    items: [
                        {
                            route: "/debug",
                            title: "Debug",
                            icon: "assets/imgs/icons/debug.png",
                        },
                    ],
                    display: true,
                },
            ],*/
        ];
    
        return (
            Components.createHeader({ text: "Bedrock Tools", back: false, settings: true })
            + (
                `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 75%;">
                    ${
                        window.settings.get( "alpha_notice" )
                        ? `<div class="infoElement" id="alphaNotice">
                            <div class="informativeText">Bedrock Tools is in early stages. Things are subject to change.</div>
                            <div class="infoElementClose" onclick="window.settings.set( 'alpha_notice', false ); document.getElementById( 'alphaNotice' ).remove();"><img src="assets/imgs/icons/close_white.png" draggable="false" style="image-rendering: pixelated;"></div>
                        </div>`
                        : ""
                    }
                    <div class="elements">
                        <div class="element_" style="padding-left: 16px;padding-right: 16px;border-top: 2px solid rgba(255, 255, 255, 0.1);border-bottom: 2px solid rgba(0, 0, 0, 0.3);">
                            <span class="elementTitleBold">Bedrock Tools</span>
                            <span class="elementSubtitle" style="font-size: 12px;margin-bottom: 10px;margin-top: 0;">A place where you might find the tools you need!</span>
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
                                                            <div class="element_" style="padding-left: 16px;padding-right: 16px;border-top: 2px solid rgba(255, 255, 255, 0.1);">
                                                                <span class="elementTitleBold">` + m.title + `</span>
                                                                <span class="elementSubtitle" style="font-size: 12px;margin-bottom: 10px;margin-top: 0;">` + m.description + `</span>
                                                            </div>
                                                        </div>
                                                        ${
                                                            m.items.map(
                                                                (i) => (
                                                                    `<div class="elementMenu" onClick="window.sound.play( 'ui.click' ); window.router.history.go('${i.route}');">
                                                                        <div class="elementIcon">
                                                                            <img src="${i.icon}" draggable="false" class="elementIconImage">
                                                                            <div style="left: 0; position: absolute;"><div class="elementIconHover"></div></div>
                                                                        </div>
                                                                        <span class="elementTitle">${i.title}</span>
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
});
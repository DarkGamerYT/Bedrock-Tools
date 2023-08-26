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
                            icon: "/src/assets/imgs/icons/manifest.png",
                        },
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
                            icon: "/src/assets/imgs/icons/uuid.png",
                        },
                        {
                            route: "/server_pinger",
                            title: "Server Pinger",
                            icon: "/src/assets/imgs/icons/multiplayer.png",
                        },
                        /*{
                            route: "/loop_generator",
                            title: "Loop Generator",
                            icon: "/src/assets/imgs/icons/debug.png"
                        }*/
                        /*{
                            route: "/commands_tester",
                            title: "Command Tester",
                            icon: "/src/assets/imgs/icons/commands.png",
                        },*/
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
                            route: "/mcstructure_converter",
                            title: "MCStructure Converter",
                            icon: "/src/assets/imgs/icons/mcstructure_c.png",
                        },
                    ],
                    display: true,
                },
            ],
            [
                {
                    title: "Internal Tools",
                    description: "For developers only, will not show up in retail",
                    items: [
                        {
                            route: "/debug",
                            title: "Debug",
                            icon: "/src/assets/imgs/icons/debug.png",
                        },
                    ],
                    display: false,
                },
            ],
        ];
    
        return (
            Components.createHeader({ text: "Bedrock Tools", back: false, settings: true })
            + (
                `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 75%;">
                    ${
                        window.settings.get( "alpha_notice" )
                        ? `<div class="infoElement" id="alphaNotice">
                            <div class="informativeText">Bedrock Tools is in early stages. Things are subject to change.</div>
                            <div class="infoElementClose" onclick="window.settings.set( 'alpha_notice', false ); document.getElementById( 'alphaNotice' ).remove();"><img src="/src/assets/imgs/icons/close_white.png" style="image-rendering: pixelated;"></div>
                        </div>`
                        : ""
                    }
                    <div class="elements" style="padding-bottom: 4px;">
                        <div class="element_" style="padding-left: 16px;padding-right: 16px;margin-bottom: 8px;border-bottom: 2px solid rgba(0, 0, 0, 0.4);">
                            <span class="elementTitleBold">Bedrock Tools</span>
                            <span class="elementSubtitle" style="font-size: 12px;margin-bottom: 10px;margin-top: 0;">A place where you will find the tools you need!</span>
                        </div>
                        ${
                            tools.map(
                                (t) => (
                                    `<div style="display: flex;flex-direction: unset;padding-left: 4px;padding-right: 4px;">
                                        ${
                                            t.map(
                                                (m) => (
                                                    m.display
                                                    ? (
                                                        `<div class="elementsMenu">
                                                        <div class="elements" style="margin-top: -8px;margin-bottom: 16px;border: unset;border-bottom: 2px solid black;">
                                                            <div class="element_" style="padding-left: 16px;padding-right: 16px;">
                                                                <span class="elementTitleBold">` + m.title + `</span>
                                                                <span class="elementSubtitle" style="font-size: 12px;margin-bottom: 10px;margin-top: 0;">` + m.description + `</span>
                                                            </div>
                                                        </div>
                                                        ${
                                                            m.items.map(
                                                                (i) => (
                                                                    `<div class="elementMenu" onClick="window.sound.play( 'ui.click' ); window.router.history.go('${i.route}');">
                                                                        <img src="${i.icon}" style="height: calc(var(--base2Scale)*16); width: calc(var(--base2Scale)*16); image-rendering: pixelated; margin-right: 0.5rem;">
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
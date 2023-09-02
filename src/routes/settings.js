/**
 * @type {{ name: string; value: any; }[]}
 */
let modifiedSettings = [];
window.router.routes.push({
    name: "Settings",
    route: "/settings",
    component: () => {
        let isRight = window.settings.get( "right" );
        let discordRpc = window.settings.get( "discordrpc" );
        return (
            Components.createHeader({ text: "Settings", back: true, settings: false })
            + (
                `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 65%;">
                    ${Components.createElements(
                        {
                            elements: [
                                Components.createElement(
                                    {
                                        type: "toggle",
                                        title: "Sidebar on the right",
                                        subtitle: "Places the sidebar to right side of the screen",
                                        id: "right",
                                        toggled: isRight,
                                        onClick: (e) => SettingsRouteUtils.toggleRight(e),
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "toggle",
                                        title: "Discord Rich Presence",
                                        subtitle: "Shows that you're using Bedrock Tools on your Discord profile",
                                        id: "discordrpc",
                                        toggled: discordRpc,
                                        onClick: (e) => SettingsRouteUtils.toggleDiscordRpc(e),
                                    },
                                ),
                            ],
                        },
                    )}
                    ${Components.createElement(
                        {
                            type: "button",
                            text: "Save Settings",
                            id: "saveSettings",
                            onClick: () => {
                                window.sound.play( "ui.release" );
                                for (const setting of modifiedSettings) {
                                    window.settings.set( setting.name, setting.value );  
                                };
    
                                window.router.history.goBack();
                                window.engine.sendToast(
                                    {
                                        title: "Settings saved!",
                                        icon: "assets/imgs/icons/checkmark_checked.png",
                                        body: "All the settings have been saved successfully",
                                    },
                                );
                            },
                        },
                    )}
                </div>`
            )
        );
    },
});

const SettingsRouteUtils = {
    toggleRight: (e) => {
        let isRight = window.settings.get( "right" );
        let enabled = e.getAttribute( "value" ) == "true";
        if (isRight == enabled) modifiedSettings = modifiedSettings.filter((s) => s.name != "right");
        else modifiedSettings.push({ name: "right", value: enabled });
    },
    toggleDiscordRpc: (e) => {
        let discordRpc = window.settings.get( "discordRpc" );
        let enabled = e.getAttribute( "value" ) == "true";
        if (discordRpc == enabled) modifiedSettings = modifiedSettings.filter((s) => s.name != "discordrpc");
        else modifiedSettings.push({ name: "discordrpc", value: enabled });
    },
};
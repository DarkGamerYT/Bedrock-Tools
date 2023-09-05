/**
 * @type {{ name: string; value: any; }[]}
 */
let modifiedSettings = [];
const Settings = {
    Component: () => {
        let isRight = BedrockTools.settings.get( "right" );
        let discordRpc = BedrockTools.settings.get( "discordrpc" );
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
                                BedrockTools.sound.play( "ui.release" );
                                for (const setting of modifiedSettings) {
                                    BedrockTools.settings.set( setting.name, setting.value );  
                                };
    
                                BedrockTools.router.history.goBack();
                                BedrockTools.sendToast(
                                    {
                                        title: "Settings saved!",
                                        icon: "assets/checkmark_checked.png",
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
};

const SettingsRouteUtils = {
    toggleRight: (e) => {
        let isRight = BedrockTools.settings.get( "right" );
        let enabled = e.getAttribute( "value" ) == "true";
        if (isRight == enabled) modifiedSettings = modifiedSettings.filter((s) => s.name != "right");
        else modifiedSettings.push({ name: "right", value: enabled });
    },
    toggleDiscordRpc: (e) => {
        let discordRpc = BedrockTools.settings.get( "discordRpc" );
        let enabled = e.getAttribute( "value" ) == "true";
        if (discordRpc == enabled) modifiedSettings = modifiedSettings.filter((s) => s.name != "discordrpc");
        else modifiedSettings.push({ name: "discordrpc", value: enabled });
    },
};
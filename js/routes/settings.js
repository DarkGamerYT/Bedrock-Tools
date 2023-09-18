/**
 * @type {{ name: string; value: any; }[]}
 */
let modifiedSettings = [];
const Settings = {
    Component: () => {
        let isRight = BedrockTools.settings.get( "right" );
        let discordRpc = BedrockTools.settings.get( "discordrpc" );
        let locale = BedrockTools.settings.get( "locale" );
        const langs = BedrockTools.localisation.getLangs();
        return (
            Components.createHeader({ label: BedrockTools.localisation.translate( "bedrocktools.screen.settings" ), back: true, settings: false })
            + (
                `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 65%;">
                    ${Components.createElements(
                        {
                            elements: [
                                Components.createElement("switch", {
                                    label: "Sidebar on the right",
                                    description: "Places the sidebar to right side of the screen",
                                    id: "right",
                                    toggled: isRight,
                                    onChange: SettingsRouteUtils.toggleRight,
                                }),
                                Components.createElement("switch", {
                                    label: "Discord Rich Presence",
                                    description: "Shows that you're using Bedrock Tools on your Discord profile",
                                    id: "discordrpc",
                                    toggled: discordRpc,
                                    onChange: SettingsRouteUtils.toggleDiscordRpc,
                                }),
                                Components.createElement("dropdown", {
                                    label: "Language",
                                    description: "Changes the app's display language",
                                    id: "language",
                                    inline: true,
                                    selected: langs.indexOf(locale),
                                    items: langs,
                                    onChange: SettingsRouteUtils.changeLanguage,
                                }),
                            ],
                        },
                    )}
                    ${Components.createElement("button", {
                        label: "Save Settings",
                        id: "saveSettings",
                        sound: "ui.release",
                        onClick: () => {
                            for (const setting of modifiedSettings) {
                                BedrockTools.settings.set( setting.name, setting.value );  
                            };
    
                            BedrockTools.router.history.goBack();
                            BedrockTools.sendToast(
                                {
                                    icon: "assets/checkbox.png",
                                    label: BedrockTools.localisation.translate( "bedrocktools.toast.settings.title" ),
                                    body: BedrockTools.localisation.translate( "bedrocktools.toast.settings.body" ),
                                },
                            );
                        },
                    })}
                </div>`
            )
        );
    },
};

const SettingsRouteUtils = {
    toggleRight: (e) => {
        let isRight = BedrockTools.settings.get( "right" );
        if (isRight == e.value) modifiedSettings = modifiedSettings.filter((s) => s.name != "right");
        else modifiedSettings.push({ name: "right", value: e.value });
    },
    toggleDiscordRpc: (e) => {
        let discordRpc = BedrockTools.settings.get( "discordRpc" );
        if (discordRpc == e.value) modifiedSettings = modifiedSettings.filter((s) => s.name != "discordrpc");
        else modifiedSettings.push({ name: "discordrpc", value: e.value });
    },
    changeLanguage: (e) => {
        let locale = BedrockTools.settings.get( "locale" );
        let lang = BedrockTools.localisation.getLangs()[e.value];
        if (locale == lang) modifiedSettings = modifiedSettings.filter((s) => s.name != "locale");
        else modifiedSettings.push({ name: "locale", value: lang });
    },
};
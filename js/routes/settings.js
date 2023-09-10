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
            Components.createHeader({ text: BedrockTools.localisation.translate( "bedrocktools.screen.settings" ), back: true, settings: false })
            + (
                `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 65%;">
                    ${Components.createElements(
                        {
                            elements: [
                                Components.createElement(
                                    {
                                        type: "switch",
                                        title: "Sidebar on the right",
                                        subtitle: "Places the sidebar to right side of the screen",
                                        id: "right",
                                        toggled: isRight,
                                        onClick: SettingsRouteUtils.toggleRight,
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "switch",
                                        title: "Discord Rich Presence",
                                        subtitle: "Shows that you're using Bedrock Tools on your Discord profile",
                                        id: "discordrpc",
                                        toggled: discordRpc,
                                        onClick: SettingsRouteUtils.toggleDiscordRpc,
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "dropdown",
                                        title: "Language",
                                        subtitle: "Changes the app's display language",
                                        id: "language",
                                        selected: langs.indexOf(locale),
                                        items: langs,
                                        onChange: SettingsRouteUtils.changeLanguage,
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
                                        icon: "assets/checkmark_checked.png",
                                        title: BedrockTools.localisation.translate( "bedrocktools.toast.settings.title" ),
                                        body: BedrockTools.localisation.translate( "bedrocktools.toast.settings.body" ),
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
    changeLanguage: (e) => {
        let locale = BedrockTools.settings.get( "locale" );
        let lang = BedrockTools.localisation.getLangs()[e.value];
        if (locale == lang) modifiedSettings = modifiedSettings.filter((s) => s.name != "locale");
        else modifiedSettings.push({ name: "locale", value: lang });
    },
};
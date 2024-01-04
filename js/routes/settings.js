/**
 * @type {{ name: string; value: any; }[]}
 */
let modifiedSettings = [];
const panoramas = [
    "trails-and-tales",
    "beta",
];

const Settings = {
    Component: () => {
        let isRight = settings.get( "right" );
        let discordRpc = settings.get( "discordrpc" );
        let animations = settings.get( "animations" );
        let locale = settings.get( "locale" );
        let panoramaEnabled = settings.get( "panorama_enabled" );
        let panorama = settings.get( "panorama" );
        const langs = localisation.getLangs();
        let elements = [];

        elements.push(Components.createElement("switch", {
            label: "Sidebar on the right",
            description: "Places the sidebar to right side of the screen",
            id: "right",
            toggled: isRight,
            onChange: SettingsRouteUtils.toggleRight,
        }));

        if (process.platform.toLowerCase() != "linux") {
            elements.push(Components.createElement("switch", {
                label: "Discord Rich Presence",
                description: "Shows that you're using Bedrock Tools on your Discord profile",
                id: "discordrpc",
                toggled: discordRpc,
                onChange: SettingsRouteUtils.toggleDiscordRpc,
            }));
        };
        
        elements.push(Components.createElement("switch", {
            label: "Animations",
            description: "Enables/Disables the animations",
            id: "animations",
            toggled: animations,
            onChange: SettingsRouteUtils.toggleAnimations,
        }));
        
        elements.push(Components.createElement("dropdown", {
            label: "Language",
            description: "Changes the app's display language",
            id: "language",
            inline: true,
            selected: langs.indexOf(locale),
            items: langs,
            onChange: SettingsRouteUtils.changeLanguage,
        }));
        
        elements.push(Components.createElement("switch", {
            label: "Panorama Enabled (Restart required)",
            description: "Enables/Disables the panorama",
            id: "panoramaEnabled",
            toggled: panoramaEnabled,
            onChange: SettingsRouteUtils.togglePanorama,
        }));

        elements.push(Components.createElement("dropdown", {
            label: "Panoramas (Restart required)",
            description: "Changes the app's panorama",
            id: "panorama",
            inline: true,
            selected: panoramas.indexOf(panorama),
            items: panoramas,
            onChange: SettingsRouteUtils.changePanorama,
        }));

        return (
            Components.createHeader({ label: localisation.translate( "bedrocktools.screen.settings" ), back: true, settings: false })
            + (
                `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 65%;">
                    ${Components.createElements({ elements })}
                    ${Components.createElement("button", {
                        label: "Save Settings",
                        id: "saveSettings",
                        sound: "ui.release",
                        onClick: () => {
                            for (const setting of modifiedSettings)
                            settings.set( setting.name, setting.value );  
    
                            router.history.goBack();
                            BedrockTools.sendToast({
                                icon: "assets/checkbox.png",
                                label: localisation.translate( "bedrocktools.toast.settings.label" ),
                                body: localisation.translate( "bedrocktools.toast.settings.body" ),
                            });
                        },
                    })}
                </div>`
            )
        );
    },
};

const SettingsRouteUtils = {
    toggleRight: (e) => {
        let isRight = settings.get( "right" );
        if (isRight == e.value) modifiedSettings = modifiedSettings.filter((s) => s.name != "right");
        else modifiedSettings.push({ name: "right", value: e.value });
    },
    toggleDiscordRpc: (e) => {
        let discordRpc = settings.get( "discordRpc" );
        if (discordRpc == e.value) modifiedSettings = modifiedSettings.filter((s) => s.name != "discordrpc");
        else modifiedSettings.push({ name: "discordrpc", value: e.value });
    },
    toggleAnimations: (e) => {
        let discordRpc = settings.get( "animations" );
        if (discordRpc == e.value) modifiedSettings = modifiedSettings.filter((s) => s.name != "animations");
        else modifiedSettings.push({ name: "animations", value: e.value });
    },
    changeLanguage: (e) => {
        let locale = settings.get( "locale" );
        let lang = localisation.getLangs()[e.value];
        if (locale == lang) modifiedSettings = modifiedSettings.filter((s) => s.name != "locale");
        else modifiedSettings.push({ name: "locale", value: lang });
    },
    togglePanorama: (e) => {
        let discordRpc = settings.get( "panorama_enabled" );
        if (discordRpc == e.value) modifiedSettings = modifiedSettings.filter((s) => s.name != "panoramaEnabled");
        else modifiedSettings.push({ name: "panorama_enabled", value: e.value });
    },
    changePanorama: (e) => {
        let panorama = settings.get( "panorama" );
        let pano = panoramas[e.value];
        if (panorama == pano) modifiedSettings = modifiedSettings.filter((s) => s.name != "panorama");
        else modifiedSettings.push({ name: "panorama", value: pano });
    },
};
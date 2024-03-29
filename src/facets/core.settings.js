const path = require("node:path");
const fs = require("node:fs");
const appPath = path.join(process.env.APPDATA, "com.xkingdark.bedrocktools");
const settingsPath = path.join(appPath, "settings.json");
const defaultSettings = {
    debug: false,
    locale: "en-US",
    animations: true,
    panorama_enabled: true,
    panorama: "trails-and-tales",
    alpha_notice: true,
    right: false,
    discordrpc: true,
};

module.exports = {
    get: (key) => {
        const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
        return settings[key] ?? defaultSettings[key];
    },
    set: (key, value) => {
        const settings = JSON.parse(fs.readFileSync(settingsPath, "utf-8"));
        if (defaultSettings.hasOwnProperty( key )) {
            settings[key] = value ?? defaultSettings[key];
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4));
        };
    },
};
const electron = require( "@electron/remote" );
const path = require( "node:path" );
const fs = require( "node:fs" );
const settingsPath = path.join(electron.app.getPath("userData"), "settings.json");
const defaultSettings = {
    debug: false,
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
            fs.writeFileSync(settingsPath, JSON.stringify(settings, null, "\t"));
        };
    },
};
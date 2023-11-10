const fs = require( "node:fs" );
const path = require( "node:path" );
const Locale = {
    getLocale: () => settings.get( "locale" ),
    getLangs: () => {
        const langDir = path.join(__dirname, "../../langs");
        const langFiles = fs.readdirSync(langDir);
        return (
            langFiles
            .filter((f) => fs.statSync(path.join(langDir, f)).isFile())
            .map((a) => path.parse(path.join(langDir, a)).name).sort()
        );
    },
    translate: (id) => {
        try {
            const langPath = path.join(__dirname, "../../langs/" + Locale.getLocale() + ".json");
            const lang = JSON.parse(fs.readFileSync(langPath, "utf-8" ));
            return lang[id]?.split( "#" )[0]?.trim() ?? id;
        } catch { return id; };
	},
	translateWithParameters: (id, params) => {
        try {
            const langPath = path.join(__dirname, "../../langs/" + Locale.getLocale() + ".json");
            const lang = JSON.parse(fs.readFileSync(langPath, "utf-8" ));
            let translation = lang[id];
            if (/%\d+|$s/g.test( translation )) {
                for (i = 1; i <= params.length; i++) {
                    translation = translation?.replaceAll( "%" + i + "$s", params[i - 1] );
                };
            } else translation = translation?.replaceAll( "%s", params[0] );
            return translation?.split( "#" )[0]?.trim() ?? id;
        } catch { return id; };
	},
};

module.exports = Locale;
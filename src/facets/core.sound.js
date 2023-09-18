const path = require( "node:path" );
const fs = require( "node:fs" );
const sounds = JSON.parse(fs.readFileSync(path.join(__dirname, "../sound_definitions.json"), "utf-8" ));
for (let sound in sounds) for (const s of sounds[sound].sounds) new Audio( "sounds/" + s.name );
module.exports = {
    play: (id) => {
        BedrockTools.logger.debug( "[SOUND] Sound with id '" + id + "' has been requested." );
        if (
            sounds.hasOwnProperty(id)
            && sounds[id].sounds.length > 0
        ) {
            const sound = sounds[id];
            const randomSound = sound.sounds[Math.floor( Math.random() * sound.sounds.length )].name;
            const audio = new Audio( "sounds/" + randomSound );
            audio.play();
        };
    },
};
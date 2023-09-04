const electron = require( "@electron/remote" );
const fs = require( "node:fs" );
const NBT = require( "prismarine-nbt" );
BedrockTools.router.history.go( "/main_screen" );

document.addEventListener(
    "keydown", (event) => {
        if (event.code == "Escape") {
            const popup = document.getElementById( "popup" );
            if (popup.innerText.trim().length > 0) popup.innerText = "";
            else BedrockTools.router.history.goBack();
        };
        
        //Toast Debug
        if (BedrockTools.settings.get( "debug" )) {
            if (event.code == "Numpad1") {
                BedrockTools.sendToast(
                    {
                        title: "Test Toast",
                        icon: "assets/wrench.png",
                        body: "Hello World!",
                        onClick: () => BedrockTools.sound.play( "ui.release" ),
                    },
                );
            } else if (event.code == "Numpad2") {
                BedrockTools.sendToast(
                    {
                        title: "Test Toast - No Icon",
                        body: "Hello World!",
                        onClick: () => BedrockTools.sound.play( "ui.release" ),
                    },
                );
            };
        };
    },
);
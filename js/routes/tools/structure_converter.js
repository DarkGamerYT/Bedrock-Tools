const StructureConverter = {
    Component: () => {
        const isRight = settings.get( "right" );
        return (
            Components.createHeader({ label: localisation.translate( "bedrocktools.advanced.structureconverter" ), back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("dropdown", {
                                        label: "Type:",
                                        id: "convertionType",
                                        items: [
                                            "Json",
                                            "Structure",
                                        ],
                                        onChange: (e) => {
                                            switch(e.value) {
                                                case 0:
                                                    document.getElementById( "uploadElement" ).style = null;
                                                break;
                                                case 1: 
                                                    document.getElementById( "uploadElement" ).style = "display: none;";
                                                break;
                                            };
                                        },
                                    }),
                                    `<div id="uploadElement">
                                        ${Components.createElement("upload", {
                                            label: "Upload:",
                                            id: "structureFile",
                                            text: {
                                                body: "Upload Structure file",
                                                id: "structureFileText",
                                            },
                                            accepts: ".mcstructure",
                                            onChange: (e) => {
                                                const [ file ] = e.files;
                                                if (file) document.getElementById( "structureFileText" ).innerText = file.name;
                                            },
                                        })}
                                    </div>`,
                                ],
                            },
                        )}
                        ${Components.createElement("button", {
                            label: "Convert",
                            id: "convert",
                            variant: "hero",
                            sound: "ui.release",
                            onClick: () => convert(),
                        })}
                    </div>
                    <div style="width: 100%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("textbox", {
                                        label: "JSON:",
                                        id: "jsonInput",
                                        startHeight: 602,
                                    }),
                                ],
                            },
                        )}
                    </div>
                </div>`
            )
        );
    },
};

const convert = async () => {
    const convertionType = Number(document.getElementById( "convertionType" ).getAttribute( "value" ));
    const jsonInput = document.getElementById( "jsonInput" );
    switch(convertionType) {
        case 0:
            const structureFile = document.getElementById( "structureFile" );
            const [ file ] = structureFile.files;
            if (file) {
                const reader = new FileReader();
                reader.addEventListener(
                    "load", async () => {
                        const { parsed } = await NBT.parse(Buffer.from( reader.result ));
                        jsonInput.value = JSON.stringify(parsed, null, 4);
                        BedrockTools.sendToast(
                            {
                                label: "Converted Structure to JSON!",
                                icon: "assets/tools/structure_converter.png",
                                body: "Click to copy the JSON data to clipboard",
                                onClick: () => {
                                    sound.play( "ui.modal_hide" );
                                    navigator.clipboard.writeText( parsed );
                                    BedrockTools.sendToast(
                                        {
                                            label: "Structure's JSON data successfully copied!",
                                            icon: "assets/checkbox.png",
                                            body: "The JSON data has been successfully copied to the clipboard",
                                            instant: true,
                                        },
                                    );
                                },
                            },
                        );
                    },
                );

                reader.readAsArrayBuffer( file );
            } else BedrockTools.loadModal(
                ErrorModal(
                    {
                        header: "Something went wrong",
                        body: "Failed to convert the structure file into json",
                        center: true,
                    },
                ),
            );
        break;
        case 1:
            try {
                const structureJson = NBT.writeUncompressed(JSON.parse( jsonInput.value ), "little");
                const handle = await electron.dialog.showSaveDialog(
                    electron.getCurrentWindow(), {
                        defaultPath: "generated.mcstructure",
                        filters: [
                            { name: "Minecraft Structure File", extensions: [ "mcstructure" ] }
                        ]
                    },
                );
                
                if(handle.filePath.length == 0) return;
                const file = fs.createWriteStream(handle.filePath);
                file.write( structureJson );
                file.on("finish", () => file.close( cb ));
            } catch {
                BedrockTools.loadModal(
                    ErrorModal(
                        {
                            header: "Something went wrong",
                            body: "Failed to parse json into nbt",
                            center: true,
                        },
                    ),
                );
            };
        break;
    };
};
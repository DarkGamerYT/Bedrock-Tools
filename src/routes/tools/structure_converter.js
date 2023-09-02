window.router.routes.push({
    name: "Structure Converter",
    route: "/structure_converter",
    rpc: "structure_converter",
    component: () => {
        const isRight = window.settings.get( "right" );
        return (
            Components.createHeader({ text: "Structure Converter", back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement(
                                        {
                                            type: "dropdown",
                                            title: "Type:",
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
                                        },
                                    ),
                                    `<div id="uploadElement">
                                        ${
                                            Components.createElement(
                                                {
                                                    type: "upload",
                                                    title: "Upload:",
                                                    id: "structureFile",
                                                    text: {
                                                        body: "Upload Structure file",
                                                        id: "structureFileText",
                                                    },
                                                    accept: "mcstructure",
                                                    onChange: (e) => {
                                                        const [ file ] = e.files;
                                                        if(file) document.getElementById( "structureFileText" ).innerText = file.name;
                                                    },
                                                },
                                            )
                                        }
                                    </div>`,
                                ],
                            },
                        )}
                        ${Components.createElement(
                            {
                                type: "button",
                                text: "Convert",
                                id: "convert",
                                style: "hero",
                                onClick: () => convert(),
                            },
                        )}
                    </div>
                    <div style="width: 100%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement(
                                        {
                                            type: "textbox",
                                            title: "JSON:",
                                            id: "jsonInput",
                                            startHeight: 602,
                                        },
                                    ),
                                ],
                            },
                        )}
                    </div>
                </div>`
            )
        );
    },
});

const convert = async () => {
    window.sound.play("ui.release");
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
                    },
                );

                reader.readAsArrayBuffer( file );
            };
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
                window.engine.loadModal(
                    ErrorModal(
                        {
                            title: "Something went wrong",
                            body: "Failed to parse json into nbt",
                            center: true,
                        },
                    ),
                );
            };
        break;
    };
};
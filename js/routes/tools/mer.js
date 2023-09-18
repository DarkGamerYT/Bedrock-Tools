let color = [ 0, 0, 0 ];
const MER = {
    Component: () => {
        const isRight = settings.get( "right" );
        return (
            Components.createHeader({ label: localisation.translate( "bedrocktools.graphics.mer" ), back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("upload", {
                                        label: "Upload:",
                                        id: "textureFile",
                                        text: {
                                            body: "Upload texture",
                                            id: "textureFileText",
                                        },
                                        accepts: ".png,.jpeg,.jpg",
                                        onChange: (e) => {
                                            const [ file ] = e.files;
                                            if(file) document.getElementById( "textureFileText" ).innerText = file.name;
                                        },
                                    })
                                ]
                            }
                        )}
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("element", { label: "MER Texture" }),
                                    `<div id="colorTest" style="width: auto;height: 16px;background-color: rgb(${color.join(" ")});border-top: 2px solid black;border-bottom: 2px solid black;"></div>`,
                                    Components.createElement("slider", {
                                        label: "Metalness",
                                        min: 0,
                                        max: 100,
                                        value: 0,
                                        percentage: true,
                                        id: "metalness",
                                        onChange: (e) => {
                                            const red = 255 * (e.value / 100);
                                            color[0] = parseInt(red);
                                            document.getElementById("colorTest").style.backgroundColor = `rgb(${color.join(" ")})`;
                                        }
                                    }),
                                    Components.createElement("slider", {
                                        label: "Emissive",
                                        min: 0,
                                        max: 100,
                                        value: 0,
                                        percentage: true,
                                        id: "emissive",
                                        onChange: (e) => {
                                            const green = 255 * (e.value / 100);
                                            color[1] = parseInt(green);
                                            document.getElementById("colorTest").style.backgroundColor = `rgb(${color.join(" ")})`;
                                        }
                                    }),
                                    Components.createElement("slider", {
                                        label: "Roughness",
                                        min: 0,
                                        max: 100,
                                        value: 0,
                                        percentage: true,
                                        id: "roughness",
                                        onChange: (e) => {
                                            const blue = 255 * (e.value / 100);
                                            color[2] = parseInt(blue);
                                            document.getElementById("colorTest").style.backgroundColor = `rgb(${color.join(" ")})`;
                                        }
                                    }),
                                ],
                            },
                        )}
                        ${Components.createElement("button", {
                            label: "Export",
                            id: "export",
                            variant: "hero",
                            sound: "ui.release",
                            onClick: () => {},
                        })}
                        <div style="height: 16px;"></div>
                    </div>
                    <div style="width: 100%;">
                        <div style="width: fit-content;align-self: center;">
                            <img style="image-rendering: pixelated;border: 3px solid black;min-width: 112px;" draggable="false" src="assets/soul_campfire_log_lit.png">
                        </div>
                    </div>
                </div>`
            )
        );
    },
};
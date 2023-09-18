const RenderOffset = {
    Component: () => {
        const isRight = BedrockTools.settings.get( "right" );
        return (
            Components.createHeader({ label: BedrockTools.localisation.translate( "bedrocktools.addons.renderoffsetcorrector" ), back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("upload", {
                                        label: "Image:",
                                        id: "itemImageFile",
                                        accepts: ".png, .jpeg, .jpg",
                                        text: {
                                            body: "Upload Image file",
                                            id: "itemFileText",
                                        },
                                        onChange: (e) => {
                                            const [file] = e.files;
                                            if (file) {
                                                document.getElementById("itemFileText").innerText = file.name;
                                                const reader = new FileReader();
                                                reader.addEventListener(
                                                    "load",
                                                    () => {
                                                        const image = new Image();
                                                        image.src = reader.result;
                                                        image.onload = () => {
                                                            document.getElementById("imgRes").value = image.height;
                                                        };
                                                    }
                                                );
                                                reader.readAsDataURL(file);
                                            }
                                        }
                                    }),
                                    Components.createElement("input", {
                                        id: "imgRes",
                                        label: "Image Resolution",
                                        value: "16",
                                        placeholder: "Resolution of the image for one axis",
                                        input: { type: "number" }
                                    })
                                ]
                            }
                        )}
                        ${Components.createElement("button", {
                            label: "Generate",
                            id: "generate",
                            variant: "hero",
                            sound: "ui.release",
                            onClick: () => {
                                const imgRes = Number(document.getElementById("imgRes").value.trim());
                                const Scales = [
                                    0.075 / (imgRes / 16),
                                    0.125 / (imgRes / 16),
                                    0.075 / (imgRes / 16)
                                ];
                                const dataOut = {
                                    'minecraft:render_offsets': {
                                        'main_hand': {
                                            'first_person': { 'scale': Scales },
                                            'third_person': { 'scale': Scales }
                                        },
                                        'off_hand': {
                                            'first_person': { 'scale': Scales },
                                            'third_person': { 'scale': Scales }
                                        }
                                    }
                                }
                                const stringOffset = JSON.stringify(dataOut, null, "\t");
                                const highlightedText = hljs.highlight(stringOffset, { language: "json" }).value;
                                document.getElementById("output").innerHTML = highlightedText;
                                BedrockTools.sendToast(
                                    {
                                        label: "Render Offset Generated!",
                                        icon: "assets/tools/render_offset.png",
                                        body: "Click to copy the render offset to clipboard",
                                        onClick: () => {
                                            BedrockTools.sound.play( "ui.modal_hide" );
                                            navigator.clipboard.writeText( stringOffset );
                                            BedrockTools.sendToast(
                                                {
                                                    label: "Rawtext successfully copied!",
                                                    icon: "assets/checkbox.png",
                                                    body: "The render offset has been successfully copied to the clipboard",
                                                    instant: true,
                                                },
                                            );
                                        },
                                    },
                                );
                            }
                        })}
                    </div>
                    <div style="width: 100%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("text", {
                                        label: "Output:",
                                        id: "output",
                                        default: "Render Offset Output",
                                        style: "code"
                                    })
                                ]
                            }
                        )}
                    </div>
                </div>
                `
            )
        );
    },
};
const LoopGenerator = {
    Component: () => {
        return (
            Components.createHeader({ label: localisation.translate( "bedrocktools.utilities.loopgenerator" ), back: true, settings: true })
            + (
                `<div style="margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;">
                    <div id="tabs"></div>
                </div>
                <div id="tabsContent"></div>`
            )
        );
    },
    onLoad: () => loopTabs(0),
};

const loopTabs = (selected = 0) => {
    const isRight = settings.get("right");
    const tabs = [
        {
            name: "List",
            component: () => {
                return (
                    `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                        <div style="width: 50%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement("input", {
                                            label: "Splitter:",
                                            id: "splitter",
                                            placeholder: "The character/string to split the input list"
                                        }),
                                        Components.createElement("input", {
                                            label: "Output Variable:",
                                            id: "outVar",
                                            placeholder: "The string to replace in the template with the loop value",
                                            value: "{{out}}"
                                        }),
                                        Components.createElement("input", {
                                            label: "Output Template:",
                                            id: "outTemplate",
                                            placeholder: "The template to use per line when executing",
                                            value: "/say {{out}}"
                                        })
                                    ],
                                },
                            )}
                            ${Components.createElement("button", {
                                label: "Generate",
                                id: "generate",
                                variant: "hero",
                                sound: "ui.release",
                                onClick: () => {
                                    const splitter = String(document.getElementById("splitter").value.trim());
                                    const outVar = String(document.getElementById("outVar").value.trim());
                                    const outTemplate = String(document.getElementById("outTemplate").value.trim());
                                    const list = String(document.getElementById("list").value.trim()).split(splitter);

                                    if(!outVar || outVar.trim().length == 0)
                                    {
                                        BedrockTools.loadModal(
                                            ErrorModal(
                                                {
                                                    header: "Something went wrong",
                                                    body: "Output Variable cannot be empty or whitespace!",
                                                    center: true
                                                }
                                            )
                                        );
                                        return;
                                    } 

                                    if(!outTemplate || outTemplate.trim().length == 0)
                                    {
                                        BedrockTools.loadModal(
                                            ErrorModal(
                                                {
                                                    header: "Something went wrong",
                                                    body: "Output Template cannot be empty or whitespace!",
                                                    center: true
                                                }
                                            )
                                        );
                                        return;
                                    }

                                    if(list.length == 0)
                                    {
                                        BedrockTools.loadModal(
                                            ErrorModal(
                                                {
                                                    header: "Something went wrong",
                                                    body: "List is empty!",
                                                    center: true
                                                }
                                            )
                                        );
                                        return;
                                    }

                                    const values = [];
                                    for(let i = 0; i < list.length; i++) values.push(outTemplate.replaceAll(outVar, list[i]));
                                    document.getElementById( "output" ).innerText = values.join( "\n" );
                                    BedrockTools.sendToast(
                                        {
                                            icon: "assets/debug.png",
                                            label: "Loop Generated!",
                                            body: "Click to copy the loop to clipboard",
                                            onClick: () => {
                                                sound.play( "ui.modal_hide" );
                                                navigator.clipboard.writeText( values.join("\n") );
                                                BedrockTools.sendToast(
                                                    {
                                                        icon: "assets/checkbox.png",
                                                        label: "Loop successfully copied!",
                                                        body: "The loop has been successfully copied to the clipboard",
                                                        instant: true,
                                                    },
                                                );
                                            },
                                        },
                                    );
                                },
                            })}
                        </div>
                        <div style="width: 100%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement("textbox", { 
                                            label: "List:",
                                            id: "list",
                                            startHeight: 193
                                        })
                                    ]
                                },
                            )}
                        </div>
                    </div>
                    <div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                        <div style="width: 100%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement("text", {
                                            label: "Output:",
                                            id: "output",
                                            default: "Loop Output",
                                            style: "code",
                                        }),
                                    ],
                                },
                            )}
                        </div>
                    </div>`
                )
            }
        },
        {
            name: "Number",
            component: () => {
                return (
                    `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                        <div style="width: 50%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement("input", {
                                            label: "Start:",
                                            id: "start",
                                            placeholder: "The number for the loop to start at",
                                            type: "number",
                                            min: 0,
                                            max: 9999,
                                        }),
                                        Components.createElement("input", {
                                            label: "End:",
                                            id: "end",
                                            placeholder: "The number for the loop to end at",
                                            type: "number",
                                            min: 0,
                                            max: 9999,
                                        }),
                                        Components.createElement("input", {
                                            label: "Output Variable:",
                                            id: "outVar",
                                            placeholder: "The string to replace in the template with the loop value",
                                            value: "{{out}}"
                                        }),
                                        Components.createElement("input", {
                                            label: "Output Template:",
                                            id: "outTemplate",
                                            placeholder: "The template to use per line when executing",
                                            value: "/say {{out}}"
                                        })
                                    ],
                                },
                            )}
                            ${Components.createElement("button", {
                                label: "Generate",
                                id: "generate",
                                variant: "hero",
                                sound: "ui.release",
                                onClick: () => {
                                    const start = Number(document.getElementById("start").value.trim());
                                    const end = Number(document.getElementById("end").value.trim());
                                    const outVar = String(document.getElementById("outVar").value.trim());
                                    const outTemplate = String(document.getElementById("outTemplate").value.trim());

                                    if(!outVar || outVar.trim().length == 0)
                                    {
                                        BedrockTools.loadModal(
                                            ErrorModal(
                                                {
                                                    header: "Something went wrong",
                                                    body: "Output Variable cannot be empty or whitespace!",
                                                    center: true
                                                }
                                            )
                                        );
                                        return;
                                    } 

                                    if(!outTemplate || outTemplate.trim().length == 0)
                                    {
                                        BedrockTools.loadModal(
                                            ErrorModal(
                                                {
                                                    header: "Something went wrong",
                                                    body: "Output Template cannot be empty or whitespace!",
                                                    center: true
                                                }
                                            )
                                        );
                                        return;
                                    }

                                    if(start > end)
                                    {
                                        BedrockTools.loadModal(
                                            ErrorModal(
                                                {
                                                    header: "Something went wrong",
                                                    body: "Start value cannot be higher than end value!",
                                                    center: true
                                                }
                                            )
                                        );
                                        return;
                                    }

                                    var outputString = "";
                                    for(let i = start; i <= end; i++)
                                        outputString += outTemplate.replaceAll(outVar, `${i}`) + "\n";
                    
                                    document.getElementById("output").innerText = outputString;
                                    BedrockTools.sendToast(
                                        {
                                            icon: "assets/debug.png",
                                            label: "Loop Generated!",
                                            body: "Click to copy the loop to clipboard",
                                            onClick: () => {
                                                sound.play( "ui.modal_hide" );
                                                navigator.clipboard.writeText( outputString );
                                                BedrockTools.sendToast(
                                                    {
                                                        icon: "assets/checkbox.png",
                                                        label: "Loop successfully copied!",
                                                        body: "The loop has been successfully copied to the clipboard",
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
                                            default: "Loop Output",
                                            style: "code",
                                        })
                                    ]
                                }
                            )}
                        </div>
                    </div>`
                )
            }
        }
    ]

    const tabsElement = document.getElementById("tabs");
    if (
        tabsElement.getAttribute("value")
        && Number(tabsElement.getAttribute("value")) == selected
    ) return;

    document.getElementById("tabsContent").innerHTML = tabs.find((t, index) => index == selected).component();
    tabsElement.setAttribute("value", selected.toString())
    tabsElement.innerHTML = (
        Components.createTabs(
            {
                tabs: tabs.map(
                    (t, index) => Components.createTab(
                        {
                            label: t.name,
                            id: index.toString(),
                            selected: index == selected,
                            onClick: (e) => loopTabs(e.id),
                        },
                    ),
                ),
            },
        )
    );
};
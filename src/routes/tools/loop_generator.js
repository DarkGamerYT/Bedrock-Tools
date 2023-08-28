window.router.routes.push({
    name: "Loop Generator",
    route: "/loop_generator",
    rpc: "debug",
    component: () => {
        return (
            Components.createHeader({ text: "Loop Generator", back: true, settings: true })
            + (
                `<div style="margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;">
                    <div id="tabs"></div>
                </div>
                <div id="tabsContent"></div>`
            )
        );
    },
    extra: () => loopTabs(0),
});

const loopTabs = (selected = 0) => {
    const isRight = window.settings.get("right");
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
                                        Components.createElement(
                                            {
                                                type: "input",
                                                title: "Splitter:",
                                                id: "splitter",
                                                placeholder: "The character/string to split the input list"
                                            }
                                        ),
                                        Components.createElement(
                                            {
                                                type: "input",
                                                title: "Output Variable:",
                                                id: "outVar",
                                                placeholder: "The string to replace in the template with the loop value",
                                                value: "{{out}}"
                                            }
                                        ),
                                        Components.createElement(
                                            {
                                                type: "input",
                                                title: "Output Template:",
                                                id: "outTemplate",
                                                placeholder: "The template to use per line when executing",
                                                value: "/say {{out}}"
                                            }
                                        )
                                    ],
                                },
                            )}
                        ${Components.createElement(
                                {
                                    type: "button",
                                    text: "Generate",
                                    id: "generate",
                                    style: "hero",
                                    onClick: () => {
                                        const splitter = String(document.getElementById("splitter").value.trim());
                                        const outVar = String(document.getElementById("outVar").value.trim());
                                        const outTemplate = String(document.getElementById("outTemplate").value.trim());
                                        const list = String(document.getElementById("list").value.trim()).split(splitter);

                                        if(!outVar || outVar.trim().length == 0)
                                        {
                                            window.engine.loadModal(
                                                ErrorModal(
                                                    {
                                                        title: "Something went wrong",
                                                        body: "Output Variable cannot be empty or whitespace!",
                                                        center: true
                                                    }
                                                )
                                            );
                                            return;
                                        } 

                                        if(!outTemplate || outTemplate.trim().length == 0)
                                        {
                                            window.engine.loadModal(
                                                ErrorModal(
                                                    {
                                                        title: "Something went wrong",
                                                        body: "Output Template cannot be empty or whitespace!",
                                                        center: true
                                                    }
                                                )
                                            );
                                            return;
                                        }

                                        if(list.length == 0)
                                        {
                                            window.engine.loadModal(
                                                ErrorModal(
                                                    {
                                                        title: "Something went wrong",
                                                        body: "List is empty!",
                                                        center: true
                                                    }
                                                )
                                            );
                                            return;
                                        }

                                        const values = [];
                                        for(let i = 0; i < list.length; i++) values.push(outTemplate.replace(outVar, list[i]));
                                        document.getElementById( "output" ).innerText = values.join( "\n" );
                                    },
                                }
                            )}
                        </div>
                        <div style="width: 100%;">
                            ${Components.createElements(
                                {
                                    elements: [Components.createElement(
                                        {
                                            type: "textbox",
                                            title: "List:",
                                            id: "list",
                                            startHeight: 193
                                        }
                                    )]
                                },
                            )}
                        </div>
                    </div>
                    <div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                        <div style="width: 100%;">
                            ${Components.createElements(
                                {
                                    elements: [
                                        Components.createElement(
                                            {
                                                type: "text",
                                                title: "Output:",
                                                id: "output",
                                                default: "Loop Output",
                                                style: "code",
                                            },
                                        ),
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
                                        Components.createElement(
                                            {
                                                type: "input",
                                                title: "Start:",
                                                id: "start",
                                                placeholder: "The number for the loop to start at",
                                                input: {
                                                    type: "number",
                                                    min: 0,
                                                    max: 9999,
                                                },
                                            },
                                        ),
                                        Components.createElement(
                                            {
                                                type: "input",
                                                title: "End:",
                                                id: "end",
                                                placeholder: "The number for the loop to end at",
                                                input: {
                                                    type: "number",
                                                    min: 0,
                                                    max: 9999,
                                                },
                                            },
                                        ),
                                        Components.createElement(
                                            {
                                                type: "input",
                                                title: "Output Variable:",
                                                id: "outVar",
                                                placeholder: "The string to replace in the template with the loop value",
                                                value: "{{out}}"
                                            }
                                        ),
                                        Components.createElement(
                                            {
                                                type: "input",
                                                title: "Output Template:",
                                                id: "outTemplate",
                                                placeholder: "The template to use per line when executing",
                                                value: "/say {{out}}"
                                            }
                                        )
                                    ],
                                },
                            )}

                            ${Components.createElement(
                                {
                                    type: "button",
                                    text: "Generate",
                                    id: "generate",
                                    style: "hero",
                                    onClick: () => {
                                        const start = Number(document.getElementById("start").value.trim());
                                        const end = Number(document.getElementById("end").value.trim());
                                        const outVar = String(document.getElementById("outVar").value.trim());
                                        const outTemplate = String(document.getElementById("outTemplate").value.trim());

                                        if(!outVar || outVar.trim().length == 0)
                                        {
                                            window.engine.loadModal(
                                                ErrorModal(
                                                    {
                                                        title: "Something went wrong",
                                                        body: "Output Variable cannot be empty or whitespace!",
                                                        center: true
                                                    }
                                                )
                                            );
                                            return;
                                        } 

                                        if(!outTemplate || outTemplate.trim().length == 0)
                                        {
                                            window.engine.loadModal(
                                                ErrorModal(
                                                    {
                                                        title: "Something went wrong",
                                                        body: "Output Template cannot be empty or whitespace!",
                                                        center: true
                                                    }
                                                )
                                            );
                                            return;
                                        }

                                        if(start > end)
                                        {
                                            window.engine.loadModal(
                                                ErrorModal(
                                                    {
                                                        title: "Something went wrong",
                                                        body: "Start value cannot be higher than end value!",
                                                        center: true
                                                    }
                                                )
                                            );
                                            return;
                                        }

                                        var outputString = "";
                                        for(let i = start; i <= end; i++)
                                            outputString += outTemplate.replace(outVar, i) + "\n";
                                        document.getElementById("output").innerText = outputString;
                                    }
                                }
                            )}
                        </div>
                        <div style="width: 100%;">
                                ${Components.createElements(
                                    {
                                        elements: [Components.createElement(
                                            {
                                                type: "text",
                                                title: "Output:",
                                                id: "output",
                                                default: "Loop Output",
                                                style: "code",
                                            },
                                        )]
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
    tabsElement.setAttribute("value", selected)
    tabsElement.innerHTML = (
        Components.createTabs(
            {
                tabs: tabs.map(
                    (t, index) => Components.createTab(
                        {
                            text: t.name,
                            id: index,
                            selected: index == selected,
                            onClick: (e) => loopTabs(e.id),
                        },
                    ),
                ),
            },
        )
    );
};
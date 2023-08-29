let modules = [];
window.router.routes.push({
    name: "JSON Rawtext Generator",
    route: "/json_rawtext_generator",
    rpc: "rawtextGenerator",
    component: () => {
        const isRight = window.settings.get("right");
        return (
            Components.createHeader({ text: "JSON Rawtext Generator", back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "button",
                                    text: "+ Add Message",
                                    id: "addMessage",
                                    style: "secondary",
                                    onClick: () => {
                                        window.sound.play("ui.click");
                                        createModule(
                                            {
                                                type: "message",
                                                message: "Test"
                                            }
                                        )
                                    }
                                }
                            ),
                            Components.createElement(
                                {
                                    type: "button",
                                    text: "+ Add Score",
                                    id: "addScore",
                                    style: "secondary",
                                    onClick: () => {
                                        window.sound.play("ui.click");
                                    }
                                }
                            ),
                            Components.createElement(
                                {
                                    type: "button",
                                    text: "+ Add Translation",
                                    id: "addTranslation",
                                    style: "secondary",
                                    onClick: () => {
                                        window.sound.play("ui.click");
                                    }
                                }
                            ),
                            Components.createElement(
                                {
                                    type: "button",
                                    text: "+ Add Selector",
                                    id: "addSelector",
                                    style: "secondary",
                                    onClick: () => {
                                        window.sound.play("ui.click");
                                    }
                                }
                            )
                        ]
                    }
                )}
                        ${Components.createElement(
                    {
                        type: "button",
                        text: "Generate",
                        id: "generate",
                        style: "hero",
                        onClick: () => {
                            window.sound.play("ui.click");
                        }
                    }
                )}
                    </div>
                    <div style="width: 100%;">
                        <div id="modules"></div>
                    </div>
                </div>
                `
            )
        )

        function createModule(options) {
            switch (options.type) {
                case "message":
                    modules.push({
                        type: "message",
                        message: options?.message ?? "",
                        id: crypto.randomUUID(),
                        generate: () => { }
                    })
                    rawtextModules(modules);
                    break;
            }
        }
    },
    extra: () => rawtextModules()
})

const rawtextModules = (modules = []) => {
    var output = "";
    for (let i = 0; i < modules.length; i++) {
        const module = modules[i];
        switch (module.type) {
            case "message":
                output += createMessage(module);
                break;
        }
    }
    document.getElementById("modules").innerHTML = output;
}

function createMessage(options) {
    return Components.createElements(
        {
            elements: [
                Components.createElement(
                    {
                        type: "element",
                        title: "Message"
                    }
                ),
                Components.createElement(
                    {
                        type: "input",
                        value: options.message,
                        placeholder: "Message",
                        //NEED AN ON CHANGE HERE BRUH!!!
                    }
                ),
                Components.createElement(
                    {
                        type: "button",
                        text: "Delete",
                        id: "delete",
                        onClick: () => {
                            window.sound.play("ui.click");
                            modules = modules.filter(x => x.id != options.id);
                            rawtextModules(modules);
                        }
                    }
                )
            ]
        }
    )
}
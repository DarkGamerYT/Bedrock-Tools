window.router.routes.push({
    name: "JSON Rawtext Generator",
    route: "/json_rawtext_generator",
    rpc: "rawtextGenerator",
    component: () => {
        const modules = new RawtextModules();
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
                                        modules.createMessage();
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
                                        modules.createScore();
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
                                        modules.createTranslation();
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
                                        modules.createSelector();
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
                            window.sound.play("ui.release");
                            document.getElementById( "output" ).innerText = modules.constructModules();
                        }
                    }
                )}
                    </div>
                    <div style="width: 100%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement(
                                        {
                                            type: "text",
                                            title: "Output:",
                                            id: "output",
                                            default: "Rawtext Output",
                                            style: "code",
                                        },
                                    ),
                                ],
                            },
                        )}
                        <div id="modules"></div>
                    </div>
                </div>
                `
            )
        )
    }
})

class RawtextModules {
    constructor(modulesId = "modules")
    {
        this.modules = [];
        this.modulesId = modulesId;
    }

    constructModules()
    {
        var output = "";
        for (let i = 0; i < this.modules.length; i++)
            output += i == 0? this.modules[i].construct() : `,${this.modules[i].construct()}`;
        
        return `{"rawtext":[${output}]}`;
    }

    buildModules() {
        var output = "";
        for (let i = 0; i < this.modules.length; i++) {
            const module = this.modules[i];
            switch (module.type) {
                case "message":
                    output += Components.createElements(
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
                                        id: `updateMessage:${module.id}`,
                                        value: module.message,
                                        placeholder: "Message",
                                        onChange: (e) => module.message = e.value
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Move Up",
                                        id: `moveUp:${module.id}`,
                                        style: "secondary",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            this.moveModuleUp(module.id);
                                        }
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Move Down",
                                        id: `moveDown:${module.id}`,
                                        style: "secondary",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            this.moveModuleDown(module.id);
                                        }
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Delete",
                                        id: `delete:${module.id}`,
                                        style: "destructive",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            this.deleteModule(module.id);
                                        }
                                    }
                                )
                            ]
                        }
                    )
                    break;
                case "score":
                    output += Components.createElements(
                        {
                            elements: [
                                Components.createElement(
                                    {
                                        type: "element",
                                        title: "Score"
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "input",
                                        id: `updateObjective:${module.id}`,
                                        value: module.objective,
                                        placeholder: "Objective",
                                        onChange: (e) => module.objective = e.value
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "input",
                                        id: `updateTarget:${module.id}`,
                                        value: module.target,
                                        placeholder: "Target",
                                        onChange: (e) => module.target = e.value
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Move Up",
                                        id: `moveUp:${module.id}`,
                                        style: "secondary",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            this.moveModuleUp(module.id);
                                        }
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Move Down",
                                        id: `moveDown:${module.id}`,
                                        style: "secondary",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            this.moveModuleDown(module.id);
                                        }
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Delete",
                                        id: `delete:${module.id}`,
                                        style: "destructive",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            this.deleteModule(module.id);
                                        }
                                    }
                                )
                            ]
                        }
                    );
                    break;
                case "translation":
                    output += Components.createElements(
                        {
                            elements: [
                                Components.createElement(
                                    {
                                        type: "element",
                                        title: "Translation"
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "input",
                                        id: `updateTranslation:${module.id}`,
                                        value: module.translation,
                                        placeholder: "Translation",
                                        onChange: (e) => module.translation = e.value
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "toggle",
                                        title: "With Array",
                                        id: `toggleArray:${module.id}`,
                                        disabled: module.withRawtextToggle,
                                        toggled: module.withArrayToggle,
                                        onClick: (e) => {
                                            const value = e.getAttribute( "value" ) == "true";
                                            module.withArrayToggle = value;
                                            document.getElementById( `arrayModules:${module.id}` ).style = value? "" : "display:none;";
                                            if(value)
                                            {
                                                module.withArray.arrayId = `ARRModules:${module.id}`;
                                                document.getElementById(`toggleRawtext:${module.id}`).className = "toggle toggleDisabled";
                                            }
                                            else
                                                document.getElementById(`toggleRawtext:${module.id}`).className = "toggle toggleOff";
                                        }
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "toggle",
                                        title: "With Rawtext Object",
                                        id: `toggleRawtext:${module.id}`,
                                        disabled: module.withArrayToggle,
                                        toggled: module.withRawtextToggle,
                                        onClick: (e) => {
                                            const value = e.getAttribute( "value" ) == "true";
                                            module.withRawtextToggle = value;
                                            document.getElementById( `rawtextModules:${module.id}` ).style = value? "" : "display:none;";
                                            if(value)
                                            {
                                                module.withRawtext.modulesId = `RTModules:${module.id}`;
                                                document.getElementById(`toggleArray:${module.id}`).className = "toggle toggleDisabled";
                                            }
                                            else
                                                document.getElementById(`toggleArray:${module.id}`).className = "toggle toggleOff";
                                        }
                                    }
                                ),
                                `<div id="rawtextModules:${module.id}" style="${module.withRawtextToggle? "" : "display: none;"}">
                                    ${Components.createElements({
                                        elements: [
                                            Components.createElement(
                                                {
                                                    type: "button",
                                                    text: "+ Add Message",
                                                    id: `addMessage:${module.id}`,
                                                    style: "secondary",
                                                    onClick: () => {
                                                        window.sound.play("ui.click");
                                                        module.withRawtext.createMessage();
                                                    }
                                                }
                                            ),
                                            Components.createElement(
                                                {
                                                    type: "button",
                                                    text: "+ Add Score",
                                                    id: `addScore:${module.id}`,
                                                    style: "secondary",
                                                    onClick: () => {
                                                        window.sound.play("ui.click");
                                                        module.withRawtext.createScore();
                                                    }
                                                }
                                            ),
                                            Components.createElement(
                                                {
                                                    type: "button",
                                                    text: "+ Add Selector",
                                                    id: `addSelector:${module.id}`,
                                                    style: "secondary",
                                                    onClick: () => {
                                                        window.sound.play("ui.click");
                                                        module.withRawtext.createSelector();
                                                    }
                                                }
                                            ),
                                            `<div id="RTModules:${module.id}">
                                                ${module.withRawtext.buildModules()}
                                            </div>`
                                        ]
                                    })
                                }
                                </div>`,
                                `<div id="arrayModules:${module.id}" style="${module.withArrayToggle? "" : "display: none;"}">
                                    ${Components.createElements({
                                        elements: [
                                            Components.createElement(
                                                {
                                                    type: "button",
                                                    text: "+ Add",
                                                    id: `add:${module.id}`,
                                                    style: "secondary",
                                                    onClick: () => {
                                                        window.sound.play("ui.click");
                                                        module.withArray.create();
                                                    }
                                                }
                                            ),
                                            `<div id="ARRModules:${module.id}" >
                                                ${module.withArray.build(false)}
                                            </div>`,
                                        ]
                                    })}
                                </div>`,
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Move Up",
                                        id: `moveUp:${module.id}`,
                                        style: "secondary",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            this.moveModuleUp(module.id);
                                        }
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Move Down",
                                        id: `moveDown:${module.id}`,
                                        style: "secondary",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            this.moveModuleDown(module.id);
                                        }
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Delete",
                                        id: `delete:${module.id}`,
                                        style: "destructive",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            this.deleteModule(module.id);
                                        }
                                    }
                                )
                            ]
                        }
                    );
                    break;
                case "selector":
                    output += Components.createElements(
                        {
                            elements: [
                                Components.createElement(
                                    {
                                        type: "element",
                                        title: "Selector"
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "input",
                                        id: `updateSelector:${module.id}`,
                                        value: module.selector,
                                        placeholder: "Selector",
                                        onChange: (e) => module.selector = e.value
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Move Up",
                                        id: `moveUp:${module.id}`,
                                        style: "secondary",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            this.moveModuleUp(module.id);
                                        }
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Move Down",
                                        id: `moveDown:${module.id}`,
                                        style: "secondary",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            this.moveModuleDown(module.id);
                                        }
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Delete",
                                        id: `delete:${module.id}`,
                                        style: "destructive",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            this.deleteModule(module.id);
                                        }
                                    }
                                )
                            ]
                        }
                    )
                    break;
            }
        }
        document.getElementById(this.modulesId ?? "modules").innerHTML = output;
        return output;
    }

    createMessage()
    {
        const module = {
            type: "message",
            message: "",
            id: crypto.randomUUID(),
            construct: () => {
                return `{"text":"${module.message}"}`;
            }
        }
        this.modules.push(module);
        this.buildModules();
    }

    createScore()
    {
        const module = {
            type: "score",
            objective: "",
            target: "*",
            id: crypto.randomUUID(),
            construct: () => {
                return `{"score":{"name":"${module.target}","objective":"${module.objective}"}}`;
            }
        }

        this.modules.push(module);
        this.buildModules();
    }

    createTranslation()
    {
        const module = {
            type: "translation",
            translation: "commands.op.success",
            withArray: new ArrayValues(),
            withRawtext: new RawtextModules(),
            withArrayToggle: false,
            withRawtextToggle: false,
            id: crypto.randomUUID(),
            construct: () => {
                if(module.withArrayToggle)
                {
                    return `{"translate":"${module.translation}", "with":${module.withArray.construct()}}`;
                }
                else if(module.withRawtextToggle)
                {
                    return `{"translate":"${module.translation}", "with":${module.withRawtext.constructModules()}}`;
                }
                return `{"translate":"${module.translation}"}`;
            }
        }

        this.modules.push(module);
        this.buildModules();
    }

    createSelector()
    {
        const module = {
            type: "selector",
            selector: "@e[type=player]",
            id: crypto.randomUUID(),
            construct: () => {
                return `{"selector":"${module.selector}"}`;
            }
        }

        this.modules.push(module);
        this.buildModules();
    }

    deleteModule(id)
    {
        this.modules = this.modules.filter(x => x.id != id);
        this.buildModules();
    }

    moveModuleUp(id)
    {
        const index = this.modules.findIndex(x => x.id == id)
        if(index != -1)
            this.MoveArray(this.modules, index, index - 1)
        this.buildModules();
    }

    moveModuleDown(id)
    {
        const index = this.modules.findIndex(x => x.id == id)
        if(index != -1)
            this.MoveArray(this.modules, index, index + 1)

        this.buildModules();
    }

    MoveArray(arr, fromIndex, toIndex) {
        var element = arr[fromIndex];
        arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, element);
    }
}

class ArrayValues
{
    constructor(arrayId = "array")
    {
        this.array = [];
        this.arrayId = arrayId;
    }

    construct()
    {
        return this.array.map(x => `"${x.value}"`);
    }

    build(setHtml = true)
    {
        var output = "";
        for(let i = 0; i < this.array.length; i++)
        {
            const value = this.array[i];
            output += Components.createElements(
                {
                    elements: [
                        Components.createElement(
                            {
                                type: "input",
                                id: `updateValue:${value.id}`,
                                value: value.value,
                                placeholder: "Value",
                                onChange: (e) => value.value = e.value
                            }
                        ),
                        Components.createElement(
                            {
                                type: "button",
                                text: "Delete",
                                id: `delete:${value.id}`,
                                style: "destructive",
                                onClick: () => {
                                    window.sound.play("ui.click");
                                    this.delete(value.id);
                                }
                            }
                        )
                    ]
                }
            )
        }
        this.construct();
        if(setHtml)
            document.getElementById(this.arrayId ?? "array").innerHTML = output;
        return output;
    }

    create()
    {
        const value = {
            value: "",
            id: crypto.randomUUID()
        }
        this.array.push(value);
        this.build();
    }

    delete(id)
    {
        this.array = this.array.filter(x => x.id != id);
        this.build();
    }
}
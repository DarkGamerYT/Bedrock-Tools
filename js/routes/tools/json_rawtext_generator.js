const RawtextGenerator = {
    Component: () => {
        const modules = new RawtextModules();
        const isRight = BedrockTools.settings.get("right");
        return (
            Components.createHeader({ label: BedrockTools.localisation.translate( "bedrocktools.addons.rawtextgenerator" ), back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements({
                            elements: [
                                `<div style="border-top: 2px solid rgba(255, 255, 255, 0.1);"></div>`,
                                `<div style="background-color: #48494a; padding: 0.2rem; padding-left: 8px; padding-right: 8px;">
                                    <div style="width: 100%; margin-top: 6px;">
                                        ${Components.createElement("button", {
                                            label: "+ Add Message",
                                            id: "addMessage",
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => modules.createMessage()
                                        })}
                                    </div>
                                </div>`,
                                `<div style="background-color: #48494a; padding: 0.2rem; padding-left: 8px; padding-right: 8px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "+ Add Score",
                                            id: "addScore",
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => modules.createScore()
                                        })}
                                    </div>
                                </div>`,
                                `<div style="background-color: #48494a; padding: 0.2rem; padding-left: 8px; padding-right: 8px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "+ Add Translation",
                                            id: "addTranslation",
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => modules.createTranslation()
                                        })}
                                    </div>
                                </div>`,
                                `<div style="background-color: #48494a; padding: 0.2rem; padding-left: 8px; padding-right: 8px;">
                                    <div style="width: 100%; margin-bottom: 6px;">
                                        ${Components.createElement("button", {
                                            label: "+ Add Selector",
                                            id: "addSelector",
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => modules.createSelector()
                                        })}
                                    </div>
                                </div>`,
                                `<div style="border-top: 2px solid rgba(0, 0, 0, 0.3);"></div>`
                            ]
                        })}
                        ${Components.createElement("button", {
                            label: "Generate",
                            id: "generate",
                            variant: "hero",
                            sound: "ui.release",
                            onClick: () => {
                                const stringRawtext = modules.constructModules();
                                const highlightedText = hljs.highlight(stringRawtext, { language: "json" }).value;
                                document.getElementById( "output" ).innerHTML = highlightedText;
                                BedrockTools.sendToast(
                                    {
                                        label: "Rawtext Generated!",
                                        icon: "assets/tools/rawtext_gen.png",
                                        body: "Click to copy the rawtext to clipboard",
                                        onClick: () => {
                                            BedrockTools.sound.play( "ui.modal_hide" );
                                            navigator.clipboard.writeText( stringRawtext );
                                            BedrockTools.sendToast(
                                                {
                                                    label: "Rawtext successfully copied!",
                                                    icon: "assets/checkbox.png",
                                                    body: "The rawtext has been successfully copied to the clipboard",
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
                                        default: `<span class="hljs-punctuation">{</span><span class="hljs-attr">"rawtext"</span><span class="hljs-punctuation">:</span><span class="hljs-punctuation">[</span><span class="hljs-punctuation">]</span><span class="hljs-punctuation">}</span>`,
                                        style: "code",
                                    }),
                                ],
                            },
                        )}
                        <div id="modules"></div>
                    </div>
                </div>
                `
            )
        )
    },
};

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
                                Components.createElement("element", { label: "Message" }),
                                Components.createElement("input", {
                                    id: `updateMessage:${module.id}`,
                                    value: module.message,
                                    placeholder: "Message",
                                    onChange: (e) => module.message = e.value
                                }),
                                `<div style="height: 8px;"></div>`,
                                `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "Move Up",
                                            id: `moveUp:${module.id}`,
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => this.moveModuleUp(module.id)
                                        })}
                                    </div>
                                </div>`,
                                `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "Move Down",
                                            id: `moveDown:${module.id}`,
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => this.moveModuleDown(module.id)
                                        })}
                                    </div>
                                </div>`,
                                `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "Delete",
                                            id: `delete:${module.id}`,
                                            variant: "destructive",
                                            sound: "ui.click",
                                            onClick: () => this.deleteModule(module.id)
                                        })}
                                    </div>
                                </div>`,
                                `<div style="height: 8px;"></div>`
                            ]
                        }
                    )
                    break;
                case "score":
                    output += Components.createElements(
                        {
                            elements: [
                                Components.createElement("element", { label: "Score" }),
                                Components.createElement("input", {
                                    id: `updateObjective:${module.id}`,
                                    value: module.objective,
                                    placeholder: "Objective",
                                    onChange: (e) => module.objective = e.value
                                }),
                                Components.createElement("input", {
                                    id: `updateTarget:${module.id}`,
                                    value: module.target,
                                    placeholder: "Target",
                                    onChange: (e) => module.target = e.value
                                }),
                                `<div style="height: 8px;"></div>`,
                                `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "Move Up",
                                            id: `moveUp:${module.id}`,
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => this.moveModuleUp(module.id)
                                        })}
                                    </div>
                                </div>`,
                                `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "Move Down",
                                            id: `moveDown:${module.id}`,
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => this.moveModuleDown(module.id)
                                        })}
                                    </div>
                                </div>`,
                                `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "Delete",
                                            id: `delete:${module.id}`,
                                            variant: "destructive",
                                            sound: "ui.click",
                                            onClick: () => this.deleteModule(module.id)
                                        })}
                                    </div>
                                </div>`,
                                `<div style="height: 8px;"></div>`
                            ]
                        }
                    );
                    break;
                case "translation":
                    output += Components.createElements(
                        {
                            elements: [
                                Components.createElement("element", { label: "Translation" }),
                                Components.createElement("input", {
                                    id: `updateTranslation:${module.id}`,
                                    value: module.translation,
                                    placeholder: "Translation",
                                    onChange: (e) => module.translation = e.value
                                }),
                                Components.createElement("switch", {
                                    label: "With Array",
                                    id: `toggleArray:${module.id}`,
                                    disabled: module.withRawtextToggle,
                                    toggled: module.withArrayToggle,
                                    onChange: (e) => {
                                        const value = e.value;
                                        module.withArrayToggle = value;
                                        document.getElementById( `arrayModules:${module.id}` ).style = value ? "" : "display:none;";
                                        if(value)
                                        {
                                            module.withArray.arrayId = `ARRModules:${module.id}`;
                                            document.getElementById(`toggleRawtext:${module.id}`).className = "switch switchDisabled";
                                        }
                                        else
                                            document.getElementById(`toggleRawtext:${module.id}`).className = "switch";
                                    }
                                }),
                                Components.createElement("switch", {
                                    label: "With Rawtext Object",
                                    id: `toggleRawtext:${module.id}`,
                                    disabled: module.withArrayToggle,
                                    toggled: module.withRawtextToggle,
                                    onChange: (e) => {
                                        const value = e.value;
                                        module.withRawtextToggle = value;
                                        document.getElementById( `rawtextModules:${module.id}` ).style = value? "" : "display:none;";
                                        if(value)
                                        {
                                            module.withRawtext.modulesId = `RTModules:${module.id}`;
                                            document.getElementById(`toggleArray:${module.id}`).className = "switch switchDisabled";
                                        }
                                        else
                                            document.getElementById(`toggleArray:${module.id}`).className = "switch";
                                    }
                                }),
                                `<div id="rawtextModules:${module.id}" style="${module.withRawtextToggle? "" : "display: none;"}">
                                    <div style="height: 8px;"></div>
                                    <div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                        <div style="width: 100%;">
                                            ${Components.createElement("button", {
                                                label: "+ Add Message",
                                                id: `addMessage:${module.id}`,
                                                variant: "secondary",
                                                sound: "ui.click",
                                                onClick: () => module.withRawtext.createMessage()
                                            })}
                                        </div>
                                    </div>
                                    <div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                        <div style="width: 100%;">
                                            ${Components.createElement("button", {
                                                label: "+ Add Score",
                                                id: `addScore:${module.id}`,
                                                variant: "secondary",
                                                sound: "ui.click",
                                                onClick: () => module.withRawtext.createScore()
                                            })}
                                        </div>
                                    </div>
                                    <div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                        <div style="width: 100%;">
                                            ${Components.createElement("button", {
                                                label: "+ Add Selector",
                                                id: `addSelector:${module.id}`,
                                                variant: "secondary",
                                                sound: "ui.click",
                                                onClick: () => module.withRawtext.createSelector()
                                            })}
                                        </div>
                                    </div>
                                    <div style="height: 8px;"></div>
                                    <div style="background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                        <div id="RTModules:${module.id}">
                                            ${module.withRawtext.buildModules()}
                                        </div>
                                    </div>
                                </div>`,
                                `<div id="arrayModules:${module.id}" style="${module.withArrayToggle? "" : "display: none;"}">
                                    <div style="height: 8px;"></div>
                                    <div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                        <div style="width: 100%;">
                                            ${Components.createElement("button", {
                                                label: "+ Add",
                                                id: `add:${module.id}`,
                                                variant: "secondary",
                                                sound: "ui.click",
                                                onClick: () => module.withArray.create()
                                            })}
                                        </div>
                                    </div>
                                    <div style="height: 8px;"></div>
                                    <div style="background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                        <div id="ARRModules:${module.id}" >
                                            ${module.withArray.build(false)}
                                        </div>
                                    </div>
                                </div>`,
                                `<div style="border-top: 2px solid rgba(255, 255, 255, 0.1);"></div><div style="height: 8px;"></div>`,
                                `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "Move Up",
                                            id: `moveUp:${module.id}`,
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => this.moveModuleUp(module.id)
                                        })}
                                    </div>
                                </div>`,
                                `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "Move Down",
                                            id: `moveDown:${module.id}`,
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => this.moveModuleDown(module.id)
                                        })}
                                    </div>
                                </div>`,
                                `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "Delete",
                                            id: `delete:${module.id}`,
                                            variant: "destructive",
                                            sound: "ui.click",
                                            onClick: () => this.deleteModule(module.id)
                                        })}
                                    </div>
                                </div>`,
                                `<div style="height: 8px;"></div><div style="border-top: 2px solid rgba(0, 0, 0, 0.3);"></div>`
                            ]
                        }
                    );
                    break;
                case "selector":
                    output += Components.createElements(
                        {
                            elements: [
                                Components.createElement("element", { label: "Selector" }),
                                Components.createElement("input", {
                                    id: `updateSelector:${module.id}`,
                                    value: module.selector,
                                    placeholder: "Selector",
                                    onChange: (e) => module.selector = e.value
                                }),
                                `<div style="height: 8px;"></div>`,
                                `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "Move Up",
                                            id: `moveUp:${module.id}`,
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => this.moveModuleUp(module.id)
                                        })}
                                    </div>
                                </div>`,
                                `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "Move Down",
                                            id: `moveDown:${module.id}`,
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => this.moveModuleDown(module.id)
                                        })}
                                    </div>
                                </div>`,
                                `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                                    <div style="width: 100%;">
                                        ${Components.createElement("button", {
                                            label: "Delete",
                                            id: `delete:${module.id}`,
                                            variant: "destructive",
                                            sound: "ui.click",
                                            onClick: () => this.deleteModule(module.id)
                                        })}
                                    </div>
                                </div>`,
                                `<div style="height: 8px;"></div>`
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
            withRawlabel: new RawtextModules(),
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
        const array = this.array.map(x => `"${x.value}"`);
        return `[${array}]`
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
                        Components.createElement("input", {
                            id: `updateValue:${value.id}`,
                            value: value.value,
                            placeholder: "Value",
                            onChange: (e) => value.value = e.value
                        }),
                        `<div style="height: 8px;"></div>`,
                        `<div style="flex-direction: row; background-color: #48494a; padding: 0.1rem; padding-left: 24px; padding-right: 24px;">
                            <div style="width: 100%;">
                                ${Components.createElement("button", {
                                    label: "Delete",
                                    id: `delete:${value.id}`,
                                    variant: "destructive",
                                    sound: "ui.click",
                                    onClick: () => this.delete(value.id)
                                })}
                            </div>
                        </div>`,
                        `<div style="height: 8px;"></div>`
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
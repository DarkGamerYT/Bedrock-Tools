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
                            console.log(modules.constructModules());
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
    },
    extra: () => modules.buildModules()
})

class RawtextModules {
    constructor()
    {
        this.modules = [];
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
                                        onChange: (e) => { 
                                            module.message = e.value;
                                            this.changeNoUpdate(module)
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
                                            modules.deleteModule(module.id);
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
                                        onChange: (e) => { 
                                            module.objective = e.value;
                                            this.changeNoUpdate(module)
                                        }
                                    }
                                ),
                                Components.createElement(
                                    {
                                        type: "input",
                                        id: `updateTarget:${module.id}`,
                                        value: module.target,
                                        placeholder: "Target",
                                        onChange: (e) => { 
                                            module.target = e.value;
                                            this.changeNoUpdate(module)
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
                                            modules.deleteModule(module.id);
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
                                        onChange: (e) => { 
                                            module.translation = e.value;
                                            this.changeNoUpdate(module)
                                        }
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
                                                document.getElementById(`toggleRawtext:${module.id}`).className = "toggle toggleDisabled";
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
                                            modules.changeNoUpdate(module);
                                            document.getElementById( `rawtextModules:${module.id}` ).style = value? "" : "display:none;";
                                            if(value)
                                                document.getElementById(`toggleArray:${module.id}`).className = "toggle toggleDisabled";
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
                                                        modules.createMessage();
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
                                                        modules.createScore();
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
                                                        modules.createSelector();
                                                    }
                                                }
                                            )
                                        ]
                                    })
                                }
                                </div>`,
                                `<div id="arrayModules:${module.id}" style="display: none;">
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
                                                    }
                                                }
                                            )
                                        ]
                                    })}
                                </div>`,
                                Components.createElement(
                                    {
                                        type: "button",
                                        text: "Delete",
                                        id: `delete:${module.id}`,
                                        style: "destructive",
                                        onClick: () => {
                                            window.sound.play("ui.click");
                                            modules.deleteModule(module.id);
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
                                        onChange: (e) => { 
                                            module.selector = e.value;
                                            this.changeNoUpdate(module)
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
                                            modules.deleteModule(module.id);
                                        }
                                    }
                                )
                            ]
                        }
                    )
                    break;
            }
        }
        document.getElementById("modules").innerHTML = output;
    }

    changeNoUpdate(module)
    {
        const foundModule = this.modules.findIndex(x => x.id == module.id);
        if(foundModule != -1) this.modules[foundModule] = module;
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
            with: [],
            withArrayToggle: false,
            withRawtextToggle: false,
            id: crypto.randomUUID(),
            construct: () => {
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
}

const modules = new RawtextModules();
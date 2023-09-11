const ComponentsRoute = {
    Component: () => {
        return (
            Components.createHeader({ text: BedrockTools.localisation.translate( "bedrocktools.debug.components" ), back: true, settings: false })
            + (
                `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 65%;">
                    ${Components.createElements(
                        {
                            elements: [
                                Components.createElement(
                                    {
                                        type: "element",
                                        title: "Form",
                                        tag: Components.createTag({ text: "Beta", style: "informative" }),
										subtitle: "Hello World!"
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "toggle",
                                        title: "Title",
                                        subtitle: "An optional description of the choice",
                                        id: "toggle",
                                        selected: 1,
                                        items: [
                                            { label: "One", description: "Toggle specific description" },
                                            { label: "Two", description: "Hello!" },
                                            { label: "Three", icon: "assets/structure_editor.png" }
                                        ],
                                        onChange: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "input",
                                        title: "Title",
                                        subtitle: "A description describing the purpose of the input field",
                                        id: "input"
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "dropdown",
                                        title: "Title",
                                        subtitle: "Hello World!",
                                        id: "dropdown-2",
                                        selected: 0,
                                        items: [ "One", "Two", "Three", "Four", "Five" ],
                                        onChange: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "switch",
                                        title: "Interactive",
                                        subtitle: "Try using me!",
                                        id: "switch",
                                        toggled: false,
                                        onClick: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "switch",
                                        title: "Interactive",
                                        id: "switch",
                                        toggled: true,
                                        onClick: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "checkbox",
                                        title: "Title",
                                        subtitle: "Agree to the agreement",
                                        id: "checkbox-1",
                                        checked: false,
                                        onClick: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "checkbox",
                                        title: "Title",
                                        id: "checkbox-2",
                                        checked: true,
                                        onClick: () => {}
                                    },
                                ),
                                Components.createElement({ type: "element", title: "Tags" }),
                                `<div class="element">
                                    <div style="height: 0.5rem;"></div>
                                    ${Components.createTag({ text: "Neutral", style: "neutral" })}
                                    <div style="height: 0.3rem;"></div>
                                    ${Components.createTag({ text: "Primary", style: "primary" })}
                                    <div style="height: 0.3rem;"></div>
                                    ${Components.createTag({ text: "Informative", style: "informative" })}
                                    <div style="height: 0.3rem;"></div>
                                    ${Components.createTag({ text: "Notice", style: "notice" })}
                                    <div style="height: 0.3rem;"></div>
                                    ${Components.createTag({ text: "Destructive", style: "destructive" })}
                                    <div style="height: 0.3rem;"></div>
                                    ${Components.createTag({ text: "Purple", style: "purple" })}
                                    <div style="height: 0.5rem;"></div>
                                </div>`,
                                Components.createElement({ type: "element", title: "Buttons" }),
                                `<div class="element">
                                    <div style="width: 100%;margin-top: 6px;margin-bottom: 6px;">
                                        ${Components.createElement(
                                            {
                                                type: "button",
                                                text: "Hero",
                                                id: "button-1",
                                                style: "hero",
                                                onClick: () => {}
                                            },
                                        )}
                                    </div>
                                </div>`,
                                `<div class="element">
                                    <div style="width: 100%;margin-top: 6px;margin-bottom: 6px;">
                                        ${Components.createElement(
                                            {
                                                type: "button",
                                                text: "Primary",
                                                id: "button-2",
                                                style: "primary",
                                                onClick: () => {}
                                            },
                                        )}
                                    </div>
                                </div>`,
                                `<div class="element">
                                    <div style="width: 100%;margin-top: 6px;margin-bottom: 6px;">
                                        ${Components.createElement(
                                            {
                                                type: "button",
                                                text: "Secondary",
                                                id: "button-3",
                                                style: "secondary",
                                                onClick: () => {}
                                            },
                                        )}
                                    </div>
                                </div>`,
                                `<div class="element">
                                    <div style="width: 100%;margin-top: 6px;margin-bottom: 6px;">
                                        ${Components.createElement(
                                            {
                                                type: "button",
                                                text: "Destructive",
                                                id: "button-4",
                                                style: "destructive",
                                                onClick: () => {}
                                            },
                                        )}
                                    </div>
                                </div>`,
                                `<div class="element">
                                    <div style="width: 100%;margin-top: 6px;margin-bottom: 6px;">
                                        ${Components.createElement(
                                            {
                                                type: "button",
                                                text: "Purple",
                                                id: "button-4",
                                                style: "purple",
                                                onClick: () => {}
                                            },
                                        )}
                                    </div>
                                </div>`
                            ],
                        },
                    )}
                </div>`
            )
        );
    },
};
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
                                        type: "toggle",
                                        title: "Title",
                                        subtitle: "An optional description of the choice",
                                        id: "toggle",
                                        selected: 0,
                                        items: [
                                            { label: "One", description: "Hello World!" },
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
                                        id: "dropdown-1",
                                        selected: 0,
                                        items: [ "One", "Two", "Three", "Four", "Five" ],
                                        onChange: () => {}
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
                                        id: "checkbox",
                                        checked: false,
                                        onClick: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "checkbox",
                                        title: "Title",
                                        id: "checkbox",
                                        checked: true,
                                        onClick: () => {}
                                    },
                                ),
                                `<div style="background-color: #48494a; padding: 0.2rem; padding-left: 8px; padding-right: 8px;">
                                    <div class="oreUISpecular" style="border-top-width: var(--base2Scale);"></div>
                                    <div class="oreUISpecular" style="border-bottom-width: var(--base2Scale);border-color: rgba(0, 0, 0, 0.3);"></div>
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
                                `<div style="background-color: #48494a; padding: 0.2rem; padding-left: 8px; padding-right: 8px;">
                                    <div class="oreUISpecular" style="border-top-width: var(--base2Scale);"></div>
                                    <div class="oreUISpecular" style="border-bottom-width: var(--base2Scale);border-color: rgba(0, 0, 0, 0.3);"></div>
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
                                `<div style="background-color: #48494a; padding: 0.2rem; padding-left: 8px; padding-right: 8px;">
                                    <div class="oreUISpecular" style="border-top-width: var(--base2Scale);"></div>
                                    <div class="oreUISpecular" style="border-bottom-width: var(--base2Scale);border-color: rgba(0, 0, 0, 0.3);"></div>
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
                                `<div style="background-color: #48494a; padding: 0.2rem; padding-left: 8px; padding-right: 8px;">
                                    <div class="oreUISpecular" style="border-top-width: var(--base2Scale);"></div>
                                    <div class="oreUISpecular" style="border-bottom-width: var(--base2Scale);border-color: rgba(0, 0, 0, 0.3);"></div>
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
                                `<div style="background-color: #48494a; padding: 0.2rem; padding-left: 8px; padding-right: 8px;">
                                    <div class="oreUISpecular" style="border-top-width: var(--base2Scale);"></div>
                                    <div class="oreUISpecular" style="border-bottom-width: var(--base2Scale);border-color: rgba(0, 0, 0, 0.3);"></div>
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
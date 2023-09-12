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
                                        id: "toggle-1",
                                        selected: 1,
                                        items: [
                                            { label: "One", description: "Toggle specific description" },
                                            { label: "Two", description: "Hello!" },
                                            { label: "Three", icon: { selected: "assets/rectangle_selected.png", unselected: "assets/rectangle_unselected.png" } }
                                        ],
                                        onChange: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "toggle",
                                        title: "Title",
                                        id: "toggle-2",
                                        selected: 0,
                                        disabled: true,
                                        items: [
                                            { label: "One" },
                                            { label: "Two" },
                                            { label: "Three", icon: "assets/rectangle_disabled.png" }
                                        ],
                                        onChange: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "slider",
                                        title: "Title",
                                        subtitle: "Hello World!",
                                        min: 0,
                                        max: 5,
                                        value: 2,
                                        percentage: false,
                                        id: "slider-1"
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "slider",
                                        title: "Disabled",
                                        min: 0,
                                        max: 100,
                                        value: 50,
                                        percentage: true,
                                        disabled: true,
                                        id: "slider-2"
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "input",
                                        title: "Title",
                                        subtitle: "A description describing the purpose of the input field",
                                        placeholder: "Placeholder",
                                        id: "input"
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "input",
                                        title: "Title",
                                        placeholder: "Disabled Input",
                                        disabled: true,
                                        id: "input"
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "dropdown",
                                        title: "Title",
                                        subtitle: "Hello World!",
                                        id: "dropdown-1",
                                        selected: 0,
                                        items: [ "One", "Two", "Three", "Four", "Five" ],
                                        onChange: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "dropdown",
                                        title: "Disabled",
                                        id: "dropdown-2",
                                        selected: 0,
                                        items: [ "One", "Two", "Three", "Four", "Five" ],
                                        disabled: true,
                                        onChange: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "switch",
                                        title: "Interactive",
                                        subtitle: "Try using me!",
                                        id: "switch-1",
                                        toggled: false,
                                        onClick: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "switch",
                                        title: "Disabled",
                                        id: "switch-2",
                                        toggled: true,
                                        disabled: true,
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
                                        title: "Disabled",
                                        id: "checkbox-2",
                                        checked: true,
                                        disabled: true,
                                        onClick: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "radiogroup",
                                        title: "Header",
                                        id: "radiogroup-1",
                                        selected: 1,
                                        items: [
                                            { label: "One", description: "Toggle specific description" },
                                            { label: "Two", description: "Hello!" },
                                            { label: "Three" }
                                        ],
                                        onChange: () => {}
                                    },
                                ),
                                Components.createElement(
                                    {
                                        type: "radiogroup",
                                        title: "Disabled",
                                        id: "radiogroup-2",
                                        selected: 0,
                                        disabled: true,
                                        items: [
                                            { label: "One", description: "Toggle specific description" },
                                            { label: "Two", description: "Hello!" },
                                            { label: "Three" }
                                        ],
                                        onChange: () => {}
                                    },
                                ),
                                Components.createElement({ type: "element", title: "Tags" }),
                                `<div class="element">
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
                                </div>`,
                                Components.createElement({ type: "element", title: "Buttons" }),
								/*`<div class="element">
                                    <div style="margin-top: 6px;margin-bottom: 6px;flex-direction: row;gap: 4px;">
                                        <div style="width: 100%;">
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
										<div style="width: 100%;">
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
                                    </div>
                                </div>`,
								`<div class="element">
                                    <div style="margin-top: 6px;margin-bottom: 6px;flex-direction: row;gap: 4px;">
										<div style="width: 100%;">
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
										<div style="width: 100%;">
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
										<div style="width: 100%;">
										${Components.createElement(
                                            {
                                                type: "button",
                                                text: "Purple",
                                                id: "button-5",
                                                style: "purple",
                                                onClick: () => {}
                                            },
                                        )}
										</div>
                                    </div>
                                </div>`,*/
                                `<div class="element">
                                <div style="width: 100%;margin-top: 6px;margin-bottom: 6px;">
                                    ${Components.createElement(
                                        {
                                            type: "button",
                                            text: "Icon",
                                            icon: "assets/play.png",
                                            id: "button-0",
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
                                                text: "Disabled",
                                                id: "button-disabled",
                                                style: "primary",
                                                disabled: true,
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
const ComponentsRoute = {
    Component: () => {
        return (
            Components.createHeader({ label: BedrockTools.localisation.translate( "bedrocktools.debug.components" ), back: true, settings: false })
            + (
                `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 65%;">
                    ${Components.createElements(
                        {
                            elements: [
                                Components.createElement("element", {
                                    label: "Form",
                                    tag: Components.createTag({ label: "Beta", style: "informative" }),
									description: "Hello World!"
                                }),
                                Components.createElement("toggle", {
                                    label: "Title",
                                    description: "An optional description of the choice",
                                    id: "toggle-1",
                                    selected: 1,
                                    items: [
                                        { label: "One", description: "Toggle specific description" },
                                        { label: "Two", description: "Hello!" },
                                        { label: "Three", icon: { selected: "assets/rectangle_selected.png", unselected: "assets/rectangle_unselected.png" } }
                                    ],
                                    onChange: () => {}
                                }),
                                Components.createElement("toggle", {
                                    label: "Title",
                                    id: "toggle-2",
                                    selected: 0,
                                    disabled: true,
                                    items: [
                                        { label: "One" },
                                        { label: "Two" },
                                        { label: "Three", icon: "assets/rectangle_disabled.png" }
                                    ],
                                    onChange: () => {}
                                }),
                                Components.createElement("slider", {
                                    label: "Title",
                                    description: "Hello World!",
                                    min: 0,
                                    max: 5,
                                    value: 2,
                                    percentage: false,
                                    id: "slider-1"
                                }),
                                Components.createElement("slider", {
                                    label: "Disabled",
                                    min: 0,
                                    max: 100,
                                    value: 50,
                                    percentage: true,
                                    disabled: true,
                                    id: "slider-2"
                                }),
                                Components.createElement("input", {
                                    label: "Title",
                                    description: "A description describing the purpose of the input field",
                                    placeholder: "Placeholder",
                                    id: "input"
                                }),
                                Components.createElement("input", {
                                    label: "Title",
                                    placeholder: "Disabled Input",
                                    disabled: true,
                                    id: "input"
                                }),
                                Components.createElement("dropdown", {
                                    label: "Title",
                                    description: "Hello World!",
                                    id: "dropdown-1",
                                    selected: 0,
                                    items: [ "One", "Two", "Three", "Four", "Five" ],
                                    onChange: () => {}
                                }),
                                Components.createElement("dropdown", {
                                    label: "Disabled",
                                    id: "dropdown-2",
                                    selected: -1,
                                    items: [ "One", "Two", "Three", "Four", "Five" ],
                                    disabled: true,
                                    onChange: () => {}
                                }),
                                Components.createElement("switch", {
                                    label: "Interactive",
                                    description: "Try using me!",
                                    id: "switch-1",
                                    toggled: false,
                                    onChange: () => {}
                                }),
                                Components.createElement("switch", {
                                    label: "Disabled",
                                    id: "switch-2",
                                    toggled: true,
                                    disabled: true,
                                    onChange: () => {}
                                }),
                                Components.createElement("checkbox", {
                                    label: "Title",
                                    description: "Agree to the agreement",
                                    id: "checkbox-1",
                                    checked: false,
                                    onChange: () => {}
                                }),
                                Components.createElement("checkbox", {
                                    label: "Disabled",
                                    id: "checkbox-2",
                                    checked: true,
                                    disabled: true,
                                    onChange: () => {}
                                }),
                                Components.createElement("radiogroup", {
                                    label: "Header",
                                    id: "radiogroup-1",
                                    selected: 1,
                                    items: [
                                        { label: "One", description: "Toggle specific description" },
                                        { label: "Two", description: "Hello!" },
                                        { label: "Three" }
                                    ],
                                    onChange: () => {}
                                }),
                                Components.createElement("radiogroup", {
                                    label: "Disabled",
                                    id: "radiogroup-2",
                                    selected: 0,
                                    disabled: true,
                                    items: [
                                        { label: "One", description: "Toggle specific description" },
                                        { label: "Two", description: "Hello!" },
                                        { label: "Three" }
                                    ],
                                    onChange: () => {}
                                }),
                                Components.createElement("panelbutton", {
                                    label: "Header",
                                    description: "Hello World!",
                                    buttons: [
                                        Components.createElement("button", {
                                            label: "One",
                                            id: "panelbutton-button-1",
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => {}
                                        }),
                                        Components.createElement("button", {
                                            label: "Two",
                                            id: "panelbutton-button-2",
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => {}
                                        })
                                    ],
                                }),
                                Components.createElement("element", { label: "Tags" }),
                                `<div class="element">
                                    ${Components.createTag({ label: "Neutral", style: "neutral" })}
                                    <div style="height: 0.3rem;"></div>
                                    ${Components.createTag({ label: "Primary", style: "primary" })}
                                    <div style="height: 0.3rem;"></div>
                                    ${Components.createTag({ label: "Informative", style: "informative" })}
                                    <div style="height: 0.3rem;"></div>
                                    ${Components.createTag({ label: "Notice", style: "notice" })}
                                    <div style="height: 0.3rem;"></div>
                                    ${Components.createTag({ label: "Destructive", style: "destructive" })}
                                    <div style="height: 0.3rem;"></div>
                                    ${Components.createTag({ label: "Purple", style: "purple" })}
                                </div>`,
                                Components.createElement("element", { label: "Buttons" }),
                                Components.createElement("panelbutton", {
                                    buttons: [
                                        Components.createElement("button", {
                                            label: "Icon",
                                            icon: "assets/play.png",
                                            id: "button-0",
                                            variant: "primary",
                                            sound: "ui.click",
                                            onClick: () => {}
                                        })
                                    ],
                                }),
                                Components.createElement("panelbutton", {
                                    buttons: [
                                        Components.createElement("button", {
                                            label: "Disabled",
                                            id: "button-disabled",
                                            variant: "primary",
                                            disabled: true,
                                            onClick: () => {}
                                        })
                                    ],
                                }),
                                Components.createElement("panelbutton", {
                                    buttons: [
                                        Components.createElement("button", {
                                            label: "Hero",
                                            id: "button-1",
                                            variant: "hero",
                                            sound: "ui.release",
                                            onClick: () => {}
                                        })
                                    ],
                                }),
                                Components.createElement("panelbutton", {
                                    buttons: [
                                        Components.createElement("button", {
                                            label: "Primary",
                                            id: "button-2",
                                            variant: "primary",
                                            sound: "ui.click",
                                            onClick: () => {}
                                        })
                                    ],
                                }),
                                Components.createElement("panelbutton", {
                                    buttons: [
                                        Components.createElement("button", {
                                            label: "Secondary",
                                            id: "button-3",
                                            variant: "secondary",
                                            sound: "ui.click",
                                            onClick: () => {}
                                        })
                                    ],
                                }),
                                Components.createElement("panelbutton", {
                                    buttons: [
                                        Components.createElement("button", {
                                            label: "Destructive",
                                            id: "button-4",
                                            variant: "destructive",
                                            sound: "ui.click",
                                            onClick: () => {}
                                        })
                                    ],
                                }),
                                Components.createElement("panelbutton", {
                                    buttons: [
                                        Components.createElement("button", {
                                            label: "Purple",
                                            id: "button-5",
                                            variant: "purple",
                                            sound: "ui.click",
                                            onClick: () => {}
                                        })
                                    ],
                                }),
                                Components.createElement("panelbutton", {
                                    buttons: [
                                        Components.createElement("button", {
                                            label: "Purple Hero",
                                            id: "button-6",
                                            variant: "purple_hero",
                                            sound: "ui.click",
                                            onClick: () => {}
                                        })
                                    ],
                                })
                            ],
                        },
                    )}
                </div>`
            )
        );
    },
};
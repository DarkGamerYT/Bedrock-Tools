const ErrorModal = (options = {}) => {
    return Components.createModal(
        {
            label: options.title,
            body: `<div style="${options?.center ? "text-align: center;" : ""}">${options.body}</div>`,
            elements: [
                Components.createElement("panelbutton", {
                    buttons: [
                        Components.createElement("button", {
                            label: options?.button ?? "Close",
                            variant: "secondary",
                            sound: "ui.release",
                            onClick: () => BedrockTools.clearModal()
                        })
                    ]
                })
            ]
        },
    );
};
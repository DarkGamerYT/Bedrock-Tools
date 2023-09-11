const ErrorModal = (options = {}) => {
    return Components.createModal(
        {
            title: options.title,
            body: `<div style="${options?.center ? "text-align: center;" : ""}">${options.body}</div>`,
            elements: [
                `<div class="element" style="padding-left: 0.6rem;padding-right: 0.6rem;gap: 8px;">
                    <div style="width: 100%;margin-top: 6px;margin-bottom: 6px;gap: 4px;">
                        ${Components.createElement(
                            {
                                type: "button",
                                text: options?.button ?? "Close",
                                style: "secondary",
                                onClick: () => {
                                    BedrockTools.sound.play("ui.click");
                                    BedrockTools.clearModal()
                                }
                            },
                        )}
                    </div>
                </div>`
            ]
        },
    );
};
const ErrorRoute = (options = {}) => {
    return (
        `<div class="mainBackground"></div>
        <div class="uiEntering" style="min-width: 435px;">
            ${
                Components.createModal(
                    {
                        title: options.title,
                        body: `<div style="padding: 12px; font-size: 15px; ${options?.center ? "text-align: center;" : ""}">${options.body}</div>`,
                        footer: (
                            `<div style="width: 100%;">
                                ${Components.createElement(
                                    {
                                        type: "button",
                                        text: options?.button ?? "Close",
                                        style: "secondary",
                                        onClick: () => {
                                            window.sound.play( "ui.release" );
                                            window.engine.loadModal(null)
                                        },
                                    },
                                )}
                            </div>`
                        ),
                    },
                )
            }
        </div>`
    );
};
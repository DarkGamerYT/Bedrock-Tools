window.router.routes.push({
    route: "/empty_route",
    component: () => {
        return (
            `<div class="popup">
                ${
                    Components.createModal(
                        {
                            title: "Missing Route",
                            body: `<div style="padding: 12px; font-size: 15px; text-align: center;">The route you're trying to access isn't included in this build. Did you remember to enable the environment variable?</div>`,
                            footer: (
                                `<div style="width: 100%;">
                                    ${Components.createElement(
                                        {
                                            type: "button",
                                            text: "Go back",
                                            onClick: () => {
                                                window.sound.play( "ui.release" );
                                                window.router.history.goBack();
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
    },
});
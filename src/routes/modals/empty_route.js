window.router.routes.push({
    route: "/empty_route",
    component: () => {
        return (
            `<div class="popup">
                ${
                    Components.createModal(
                        {
                            title: "Missing Route",
                            body: `<div style="padding: 12px; font-size: 15px; text-align: center;">The route you're trying to access isn't included in this build.</div>`,
                            footer: (
                                `<div style="width: 100%;">
                                    ${Components.createElement(
                                        {
                                            type: "button",
                                            text: "Go back",
                                            id: "goBack",
                                            style: "secondary",
                                            onClick: () => {
                                                window.router.history.goBack();
                                                window.sound.play("ui.click");
                                            }
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
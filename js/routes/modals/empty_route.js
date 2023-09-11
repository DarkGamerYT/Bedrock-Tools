BedrockTools.router.routes.push({
    name: "Empty Route",
    route: "/empty_route",
    component: () => {
        return Components.createModal(
            {
                title: "Missing Route",
                body: "The route you're trying to access isn't included in this build.",
                elements: [
                    `<div class="element" style="padding-left: 0.6rem;padding-right: 0.6rem;gap: 8px;">
                        <div style="width: 100%;margin-top: 6px;margin-bottom: 6px;gap: 4px;">
                            ${Components.createElement(
                                {
                                    type: "button",
                                    text: "Go back",
                                    id: "goBack",
                                    style: "secondary",
                                    onClick: () => {
                                        BedrockTools.router.history.goBack();
                                        BedrockTools.sound.play("ui.click");
                                    }
                                },
                            )}
                        </div>
                    </div>`
                ]
            },
        );
    },
    metadata: {},
});
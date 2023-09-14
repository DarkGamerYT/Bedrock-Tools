BedrockTools.router.routes.push({
    name: "Empty Route",
    route: "/empty_route",
    component: () => {
        BedrockTools.loadModal(
            Components.createModal(
                {
                    label: "Missing Route",
                    body: "The route you're trying to access isn't included in this build.",
                    elements: [
                        Components.createElement("panelbutton", {
                            buttons: [
                                Components.createElement("button", {
                                    label: "Go back",
                                    id: "goBack",
                                    variant: "secondary",
                                    sound: "ui.click",
                                    onClick: () => {
                                        BedrockTools.router.history.goBack();
                                        BedrockTools.clearModal();
                                    }
                                })
                            ]
                        })
                    ]
                },
            )
        );
    },
    metadata: {},
});
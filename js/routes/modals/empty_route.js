BedrockTools.router.routes.push({
    name: "Empty Route",
    route: "/empty_route",
    component: () => {
        return (
            `<div class="popup" id="popup">
                <div class="mainBackground"></div>
                <div class="uiEntering" style="min-width: 435px;">${Components.createModal(
                    {
                        header: "Missing Route",
                        body: "The route you're trying to access isn't included in this build.",
                        elements: [
                            Components.createElement("panelbutton", {
                                buttons: [
                                    Components.createElement("button", {
                                        label: "Go back",
                                        id: "goBack",
                                        variant: "primary",
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
                )}</div>
            </div>`
        );
    },
    metadata: {},
});
const EmptyRoute = () => {
    return (
        `<div id="popup">
            ${
                Components.createModal(
                    {
                        title: "Missing Route",
                        body: `<div style="padding: 12px; font-size: 15px; text-align: center;">The route you're trying to access isn't included in this build. Did you remember to enable the environment variable?</div>`,
                        footer: Components.createElement(
                            {
                                type: "button",
                                text: "Go back",
                                onClick: () => window.router.history.goBack(),
                            },
                        ),
                    },
                )
            }
        </div>`
    );
};

window.router.routes.push({ route: "/empty_route", component: EmptyRoute });
const SettingsRoute = () => {
    return (
        Components.createHeader({ text: "Settings", back: true, settings: false })
        + (
            `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 65%;">
                ${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "toggle",
                                    title: "Test",
                                    subtitle: "Hello World!",
                                    id: "test",
                                    onClick: () => {
                                        console.log( "Save Settings." );
                                    },
                                },
                            ),
                        ],
                    },
                )}
                ${Components.createElement(
                    {
                        type: "button",
                        text: "Save Settings",
                        id: "saveSettings",
                        onClick: () => {
                            console.log( "Save Settings." );
                        },
                    },
                )}
            </div>`
        )
    );
};

window.router.routes.push({ route: "/settings", component: SettingsRoute });
let modifiedSettings = [];
const SettingsRoute = () => {
    let isRight = window.settings.get( "right" );
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
                                    title: "Sidebar on the right",
                                    subtitle: "Places the sidebar to right side of the screen",
                                    id: "right",
                                    toggled: isRight,
                                    onClick: (e) => SettingsRouteUtils.toggleRight(e),
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
                            window.sound.play( "ui.release" );
                            for (const setting of modifiedSettings) {
                                console.log(setting);
                                window.settings.set( setting.name, setting.value );  
                            };

                            window.router.history.goBack();
                        },
                    },
                )}
            </div>`
        )
    );
};

window.router.routes.push({ route: "/settings", component: SettingsRoute });
const SettingsRouteUtils = {
    toggleRight: (e) => {
        let isRight = window.settings.get( "right" );
        window.sound.play( "ui.modal_hide" );

        let enabled = e.getAttribute( "value" ) == "true";
        e.setAttribute( "value", !enabled );

        if (!enabled) e.className = "toggle toggleOn";
        else e.className = "toggle toggleOff";

        if (isRight == !enabled) modifiedSettings = modifiedSettings.filter((s) => s.name != "right");
        else modifiedSettings.push({ name: "right", value: !enabled });
    },
};
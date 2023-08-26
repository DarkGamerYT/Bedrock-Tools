window.router.routes.push({
    name: "Loop Generator",
    route: "/loop_generator",
    rpc: "loop",
    component: () => {
        return (
            Components.createHeader({ text: "Loop Generator", back: true, settings: true })
            + (
                `<div style="margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;">
                    <div id="tabs"></div>
                </div>
                <div id="tabsContent"></div>`
            )
        );
    },
    extra: () => loopTabs(0),
});

const loopTabs = (selected = 0) => {
    const isRight = window.settings.get( "right" );
    const tabs = [
        {
            name: "List",
            component: () => {
                return (
                    `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                        <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement(
                                        {
                                            type: "input",
                                            title: "List:",
                                            id: "list",
                                            placeholder: "The list to input"
                                        },
                                    ),
                                ],
                            },
                        )}
                        </div>
                    </div>`
                )
            }
        },
        {
            name: "Number",
            component: () => {
                return (
                    `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                        <div style="width: 50%;">
                        </div>
                    </div>`
                )
            }
        }
    ]

    const tabsElement = document.getElementById( "tabs" );
    if (
        tabsElement.getAttribute( "value" )
        && Number(tabsElement.getAttribute( "value" )) == selected
    ) return;

    document.getElementById( "tabsContent" ).innerHTML = tabs.find((t, index) => index == selected).component();
    tabsElement.setAttribute( "value", selected )
    tabsElement.innerHTML = (
        Components.createTabs(
            {
                tabs: tabs.map(
                    (t, index) => Components.createTab(
                        {
                            text: t.name,
                            id: index,
                            selected: index == selected,
                            onClick: (e) => loopTabs(e.id),
                        },
                    ),
                ),
            },
        )
    );
};
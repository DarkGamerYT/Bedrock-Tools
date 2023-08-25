window.router.routes.push({
    name: "UUID Generator",
    route: "/uuid_generator",
    rpc: "uuid",
    component: () => {
        const isRight = window.settings.get( "right" );
        return (
            Components.createHeader({ text: "UUID Generator", back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement(
                                        {
                                            type: "input",
                                            title: "Amount:",
                                            id: "amount",
                                            placeholder: "Amount of UUIDs to generate",
                                            input: {
                                                type: "number",
                                                min: 1,
                                                max: 32,
                                            },
                                        },
                                    ),
                                ],
                            },
                        )}
                        ${Components.createElement(
                            {
                                type: "button",
                                text: "Generate",
                                id: "generate",
                                style: "hero",
                                onClick: () => {
                                    window.sound.play( "ui.release" );
    
                                    const amount = Number(document.getElementById( "amount" ).value.trim());
                                    if (amount > 0) {
                                        const uuids = [];
                                        for (let i = 1; i <= amount && i <= 32; i++) uuids.push(crypto.randomUUID());
                                        document.getElementById( "output" ).innerText = uuids.join( "\n" );
                                    };
                                },
                            },
                        )}
                    </div>
                    <div style="width: 100%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement(
                                        {
                                            type: "text",
                                            title: "Output:",
                                            id: "output",
                                            default: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
                                            style: "code",
                                        },
                                    ),
                                ],
                            },
                        )}
                    </div>
                </div>`
            )
        );
    },
});
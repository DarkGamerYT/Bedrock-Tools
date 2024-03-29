const CommandTester = {
    Component:  () => {
        const isRight = settings.get( "right" );
        return (
            Components.createHeader({ label: localisation.translate( "bedrocktools.utilities.commandstester" ), back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        <div class="elements">
                            <div class="element">
                                <input disabled="" placeholder="gamemode <gameMode?: GameMode>" style="margin: 6px 0;">
                            </div>
                        </div>
                    </div>
                    <div style="width: 100%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("input", {
                                            label: "Command:",
                                            id: "commandInput",
                                            placeholder: "gamemode creative @s",
                                            onChange: () => {},
                                        },
                                    ),
                                    `<div id="commandElement" style="display: none;">
                                        ${Components.createElement("text",{
                                            default: "Hello World",
                                            style: "code",
                                            id: "commandOutput",
                                        })}
                                    </div>`,
                                ],
                            },
                        )}
                        ${Components.createElement("button", {
                            label: "Test Command",
                            variant: "hero",
                            sound: "ui.release",
                            onClick: () => {
                                const commandInput = document.getElementById( "commandInput" );
                                const commandOutput = document.getElementById( "commandOutput" );
                                if (!commandInput || !commandOutput) return;

                                // @ts-ignore
                                const data = validateCommand( commandInput.value );
                                // @ts-ignore
                                document.getElementById( "commandElement" ).style.display = "block";

                                commandOutput.style.color = data?.error ? "#ff6767" : "#79e752";
                                commandOutput.innerText = data?.error ? data.data.message : "No errors.";
                            }
                        })}
                    </div>
                </div>`
            )
        );
    },
};

/**
 * 
 * @param { string } command 
 * @returns 
 */
const validateCommand = (command) => {
    return {
        error: true,
        data: {
            message: `Unknown command: ${command.split( " " )[0]}.\nPlease check that the command exists.`,
        },
    }
};
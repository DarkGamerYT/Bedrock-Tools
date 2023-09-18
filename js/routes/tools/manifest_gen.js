const hljs = require( "highlight.js" );
let scriptAPI = false;
let beta = false;
let scriptModules = [];
const ManifestGenerator = {
    Component: () => {
        const isRight = BedrockTools.settings.get( "right" );
        return (
            Components.createHeader({ label: BedrockTools.localisation.translate( "bedrocktools.addons.manifestgenerator" ), back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("dropdown", {
                                        label: "Manifest type:",
                                        id: "packType",
                                        selected: 1,
                                        items: [
                                            "Resource Pack",
                                            "Behaviour Pack",
                                            "Skin Pack",
                                            "World Template"
                                        ],
                                        onChange: (e) => {
                                            scriptModules = [];
                                            const modulesElement = document.getElementById( "modulesElement" );
                                            const scriptApiToggle = document.getElementById( "scriptApiToggle" );
                                            switch(e.value) {
                                                //Disabled for now
                                                //case 0:
                                                case 1:
                                                    scriptApiToggle.className = "switch";
                                                    if (!scriptAPI) modulesElement.style.display = "none";
                                                    else modulesElement.style.display = "block";
                                                    document.getElementById( "modules" ).innerHTML = moduleToggle(e.value);
                                                break;
                                                default:
                                                    scriptApiToggle.className = "switch switchDisabled";
                                                    modulesElement.style.display = "none";
                                                break;
                                            };
                                        },
                                    }),
                                    Components.createElement("input", {
                                        label: "Name:",
                                        id: "packName",
                                        placeholder: "Test Pack"
                                    }),
                                    Components.createElement("input", {
                                        label: "Description:",
                                        id: "packDescription",
                                        placeholder: "Hello World!"
                                    }),
                                ],
                            },
                        )}
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("switch", {
                                        label: "Script-API",
                                        description: "Enables ScriptAPI",
                                        id: "scriptApiToggle",
                                        toggled: false,
                                        onChange: (e) => {
                                            const packType = Number(document.getElementById( "packType" ).getAttribute( "value" ));
                                            if (packType == 2) return;
                                                
                                            scriptAPI = e.value;
                                            const modulesElement = document.getElementById( "modulesElement" );
                                            if (!e.value) {
                                                scriptModules = [];
                                                modulesElement.style.display = "none";
                                            } else {
                                                document.getElementById( "modules" ).innerHTML = moduleToggle(packType);
                                                modulesElement.style.display = "block";
                                            };
                                        },
                                    }),
                                    `<div id="modulesElement" style="display: none;">
                                        ${
                                            Components.createElement("switch", {
                                                label: "Beta",
                                                description: "Enable Beta modules in ScriptAPI",
                                                toggled: beta,
                                                onChange: (e) => beta = e.value,
                                            })
                                            + Components.createElement("element", { label: "Modules" })
                                            + `<div id="modules"></div>`
                                        }
                                    </div>`,
                                ],
                            },
                        )}
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("dropdown", {
                                        label: "Layout:",
                                        id: "layout",
                                        items: [
                                            "Beautified",
                                            "Minified",
                                        ],
                                        onChange: () => {},
                                    }),
                                ],
                            },
                        )}
                        ${Components.createElement("button", {
                            label: "Generate",
                            id: "generatePack",
                            variant: "hero",
                            sound: "ui.release",
                            onClick: () => {
                                // @ts-ignore
                                const packName = document.getElementById( "packName" ).value;
                                // @ts-ignore
                                const packDescription = document.getElementById( "packDescription" ).value;
                                const packType = Number(document.getElementById( "packType" ).getAttribute( "value" ));
                                const isMinified = Number(document.getElementById( "layout" ).getAttribute( "value" )) == 1;

                                // @ts-ignore
                                const manifest = new Manifest(
                                    packName,
                                    packDescription,
                                    packType,
                                    scriptAPI,
                                    beta,
                                    scriptModules,
                                    [],
                                );
                                
                                const stringManifest = isMinified ? JSON.stringify( manifest ) : JSON.stringify(manifest, null, "\t");
                                const highlightedText = hljs.default.highlight(stringManifest, { language: "json" }).value;
                                document.getElementById("output").innerHTML = highlightedText;
                                BedrockTools.sendToast(
                                    {
                                        label: "Manifest Generated!",
                                        icon: "assets/tools/manifest.png",
                                        body: "Click to copy the manifest to clipboard",
                                        onClick: () => {
                                            BedrockTools.sound.play( "ui.modal_hide" );
                                            navigator.clipboard.writeText( stringManifest );
                                            BedrockTools.sendToast(
                                                {
                                                    label: "Manifest successfully copied!",
                                                    icon: "assets/checkbox.png",
                                                    body: "The manifest has been successfully copied to the clipboard",
                                                    instant: true,
                                                },
                                            );
                                        },
                                    },
                                );
                            },
                        })}
                        <div style="height: 16px;"></div>
                    </div>
                    <div style="width: 100%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("text", {
                                        label: "Output:",
                                        id: "output",
                                        default: `<span class="hljs-punctuation">{</span>\n\t<span class="hljs-attr">"format_version"</span><span class="hljs-punctuation">:</span> <span class="hljs-number">2</span><span class="hljs-punctuation">,</span>\n\t<span class="hljs-attr">"header"</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span><span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>\n\t<span class="hljs-attr">"modules"</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span><span class="hljs-punctuation">]</span><span class="hljs-punctuation">,</span>\n\t<span class="hljs-attr">"capabilities"</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span><span class="hljs-punctuation">]</span><span class="hljs-punctuation">,</span>\n\t<span class="hljs-attr">"dependencies"</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span><span class="hljs-punctuation">]</span>\n<span class="hljs-punctuation">}</span>`,
                                        style: "code",
                                    }),
                                ],
                            },
                        )}
                    </div>
                </div>`
            )
        );
    },
};

const moduleToggle = (type) => {
    return (
        (
            type == 0
            // @ts-ignore
            ? scriptingModules.client
            // @ts-ignore
            : scriptingModules.server
        )/*.filter((m) => beta ? m.versions.find((m) => m.beta) : m.versions.find((m) => !m.beta))*/.map(
            (m) => {
                return (
                    Components.createElement("checkbox", {
                        label: m.module_name,
                        id: m.module_name,
                        onChange: (e) => {
                            if (e.value) scriptModules.push( e.id );
                            else scriptModules = scriptModules.filter((m) => m != e.id);
                        },
                    })
                );
            },
        ).join( "" )
    )
};
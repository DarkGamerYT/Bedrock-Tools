const hljs = require( "highlight.js" );
let scriptAPI = false;
let beta = false;
let scriptModules = [];
const ManifestGenerator = {
    Component: () => {
        const isRight = BedrockTools.settings.get( "right" );
        return (
            Components.createHeader({ text: BedrockTools.localisation.translate( "bedrocktools.addons.manifestgenerator" ), back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement(
                                        {
                                            type: "dropdown",
                                            title: "Manifest type:",
                                            id: "packType",
                                            selected: 0,
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
                                                    case 0:
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
                                        },
                                    ),
                                    Components.createElement(
                                        {
                                            type: "input",
                                            title: "Name:",
                                            id: "packName",
                                            placeholder: "Test Pack"
                                        },
                                    ),
                                    Components.createElement(
                                        {
                                            type: "input",
                                            title: "Description:",
                                            id: "packDescription",
                                            placeholder: "Hello World!"
                                        },
                                    ),
                                ],
                            },
                        )}
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement(
                                        {
                                            type: "switch",
                                            title: "Script-API",
                                            subtitle: "Enables ScriptAPI",
                                            id: "scriptApiToggle",
                                            toggled: false,
                                            onClick: (e) => {
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
                                        },
                                    ),
                                    `<div id="modulesElement" style="display: none;">
                                        ${
                                            Components.createElement(
                                                {
                                                    type: "switch",
                                                    title: "Beta",
                                                    subtitle: "Enable Beta modules in ScriptAPI",
                                                    toggled: beta,
                                                    onClick: (e) => beta = e.value,
                                                },
                                            )
                                            + Components.createElement(
                                                {
                                                    type: "element",
                                                    title: "Modules",
                                                },
                                            )
                                            + `<div id="modules"></div>`
                                        }
                                    </div>`,
                                ],
                            },
                        )}
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement(
                                        {
                                            type: "dropdown",
                                            title: "Layout:",
                                            id: "layout",
                                            items: [
                                                "Beautified",
                                                "Minified",
                                            ],
                                            onChange: () => {},
                                        },
                                    ),
                                ],
                            },
                        )}
                        ${Components.createElement(
                            {
                                type: "button",
                                text: "Generate",
                                id: "generatePack",
                                style: "hero",
                                onClick: () => {
                                    BedrockTools.sound.play( "ui.release" );
    
                                    const packName = document.getElementById( "packName" ).value;
                                    const packDescription = document.getElementById( "packDescription" ).value;
                                    const packType = Number(document.getElementById( "packType" ).getAttribute( "value" ));
                                    const isMinified = Number(document.getElementById( "layout" ).getAttribute( "value" )) == 1;
    
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
                                            title: "Manifest Generated!",
                                            icon: "assets/tools/manifest.png",
                                            body: "Click to copy the manifest to clipboard",
                                            onClick: () => {
                                                BedrockTools.sound.play( "ui.modal_hide" );
                                                navigator.clipboard.writeText( stringManifest );
                                                BedrockTools.sendToast(
                                                    {
                                                        title: "Manifest successfully copied!",
                                                        icon: "assets/checkbox.png",
                                                        body: "The manifest has been successfully copied to the clipboard",
                                                        instant: true,
                                                    },
                                                );
                                            },
                                        },
                                    );
                                },
                            },
                        )}
                        <div style="height: 16px;"></div>
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
                                            default: `<span class="hljs-punctuation">{</span>\n\t<span class="hljs-attr">"format_version"</span><span class="hljs-punctuation">:</span> <span class="hljs-number">2</span><span class="hljs-punctuation">,</span>\n\t<span class="hljs-attr">"header"</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">{</span><span class="hljs-punctuation">}</span><span class="hljs-punctuation">,</span>\n\t<span class="hljs-attr">"modules"</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span><span class="hljs-punctuation">]</span><span class="hljs-punctuation">,</span>\n\t<span class="hljs-attr">"capabilities"</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span><span class="hljs-punctuation">]</span><span class="hljs-punctuation">,</span>\n\t<span class="hljs-attr">"dependencies"</span><span class="hljs-punctuation">:</span> <span class="hljs-punctuation">[</span><span class="hljs-punctuation">]</span>\n<span class="hljs-punctuation">}</span>`,
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
                    Components.createElement(
                        {
                            type: "switch",
                            title: m.module_name,
                            id: m.module_name,
                            onClick: (e) => {
                                if (e.value) scriptModules.push( e.id );
                                else scriptModules = scriptModules.filter((m) => m != e.id);
                            },
                        },
                    )
                );
            },
        ).join( "" )
    )
};
const hljs = require( "highlight.js" );
let scriptAPI = false;
let beta = false;
let scriptModules = [];
const ManifestGenerator = {
    Component: () => {
        const isRight = BedrockTools.settings.get( "right" );
        return (
            Components.createHeader({ text: "Manifest Generator", back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement(
                                        {
                                            type: "dropdown",
                                            title: "Pack type:",
                                            id: "packType",
                                            selected: 0,
                                            items: [
                                                "Resource Pack",
                                                "Behaviour Pack",
                                                "Skin Pack",
                                            ],
                                            onChange: (e) => {
                                                scriptModules = [];
                                                const modulesElement = document.getElementById( "modulesElement" );
                                                const scriptApiToggle = document.getElementById( "scriptApiToggle" );
                                                switch(e.value) {
                                                    case 0:
                                                    case 1:
                                                        let value = scriptApiToggle.getAttribute( "value" ) == "true";
                                                        if (value) scriptApiToggle.className = "toggle toggleOn";
                                                        else scriptApiToggle.className = "toggle toggleOff";

                                                        if (!scriptAPI) modulesElement.style.display = "none";
                                                        else modulesElement.style.display = "block";
                                                        document.getElementById( "modules" ).innerHTML = moduleToggle(e.value);
                                                    break;
                                                    default:
                                                        scriptApiToggle.className = "toggle toggleDisabled";
                                                        modulesElement.style.display = "none";
                                                    break;
                                                };
                                            },
                                        },
                                    ),
                                    Components.createElement(
                                        {
                                            type: "input",
                                            title: "Pack name:",
                                            id: "packName",
                                            placeholder: "Test Pack"
                                        },
                                    ),
                                    Components.createElement(
                                        {
                                            type: "input",
                                            title: "Pack description:",
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
                                            type: "toggle",
                                            title: "Script-API",
                                            subtitle: "Enables ScriptAPI",
                                            id: "scriptApiToggle",
                                            toggled: false,
                                            onClick: (e) => {
                                                const packType = Number(document.getElementById( "packType" ).getAttribute( "value" ));
                                                if (packType == 2) return;
                                                
                                                let value = e.getAttribute( "value" ) == "true";
                                                scriptAPI = value;
    
                                                const modulesElement = document.getElementById( "modulesElement" );
                                                if (!value) {
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
                                                    type: "toggle",
                                                    title: "Beta",
                                                    subtitle: "Enable Beta modules in ScriptAPI",
                                                    toggled: beta,
                                                    onClick: (e) => beta = (e.getAttribute( "value" ) == "true"),
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
                                            icon: "assets/manifest.png",
                                            body: "Click to copy the manifest to clipboard",
                                            onClick: () => {
                                                BedrockTools.sound.play( "ui.modal_hide" );
                                                navigator.clipboard.writeText( stringManifest );
                                                BedrockTools.sendToast(
                                                    {
                                                        title: "Manifest successfully copied!",
                                                        icon: "assets/checkmark_checked.png",
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
/*BedrockTools.router.routes.push({
    name: "Manifest Generator",
    route: "/manifest_generator",
    rpc: "manifest",
    component: ,
});*/

const moduleToggle = (type) => {
    return (
        (
            type == 0
            ? scriptingModules.client
            : scriptingModules.server
        )/*.filter((m) => beta ? m.versions.find((m) => m.beta) : m.versions.find((m) => !m.beta))*/.map(
            (m) => {
                return (
                    Components.createElement(
                        {
                            type: "toggle",
                            title: m.module_name,
                            id: m.module_name,
                            onClick: (e) => {
                                let value = e.getAttribute( "value" ) == "true";
                                if (value) scriptModules.push( e.id );
                                else scriptModules = scriptModules.filter((m) => m != e.id);
                            },
                        },
                    )
                );
            },
        ).join( "" )
    )
};
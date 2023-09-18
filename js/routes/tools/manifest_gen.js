const hljs = require( "highlight.js" );
let scriptAPI = false;
let beta = false;
let scriptModules = [];
const ManifestGenerator = {
    Component: () => {
        const isRight = settings.get( "right" );
        const manifestGenerator = BedrockTools.requestFacet( "bedrocktools.manifestGenerator" );
        return (
            Components.createHeader({ label: localisation.translate( "bedrocktools.addons.manifestgenerator" ), back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("dropdown", {
                                        label: localisation.translate( "bedrocktools.manifestgenerator.manifesttype" ),
                                        id: "packType",
                                        selected: 1,
                                        items: [
                                            localisation.translate( "bedrocktools.manifestgenerator.manifest.resourcepack" ),
                                            localisation.translate( "bedrocktools.manifestgenerator.manifest.behaviorpack" ),
                                            localisation.translate( "bedrocktools.manifestgenerator.manifest.skinpack" ),
                                            localisation.translate( "bedrocktools.manifestgenerator.manifest.worldtemplate" )
                                        ],
                                        onChange: (e) => {
                                            //scriptModules = [];
                                            const modulesElement = document.getElementById( "modulesElement" );
                                            const scriptApiToggle = document.getElementById( "scriptApiToggle" );
                                            switch(e.value) {
                                                //case 0: //Disabled for now
                                                case 1:
                                                    scriptApiToggle.className = "switch";
                                                    if (!scriptAPI) modulesElement.style.display = "none";
                                                    else modulesElement.style.display = "block";
                                                    document.getElementById( "modules" ).innerHTML = moduleToggle(manifestGenerator, e.value);
                                                break;
                                                default:
                                                    scriptApiToggle.className = "switch switchDisabled";
                                                    modulesElement.style.display = "none";
                                                break;
                                            };
                                        },
                                    }),
                                    Components.createElement("input", {
                                        label: localisation.translate( "bedrocktools.manifestgenerator.name" ),
                                        id: "packName",
                                        placeholder: "Test Pack"
                                    }),
                                    Components.createElement("input", {
                                        label: localisation.translate( "bedrocktools.manifestgenerator.description" ),
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
                                        label: localisation.translate( "bedrocktools.manifestgenerator.scriptapi" ),
                                        description: localisation.translate( "bedrocktools.manifestgenerator.scriptapi.description" ),
                                        id: "scriptApiToggle",
                                        toggled: false,
                                        onChange: (e) => {
                                            const packType = Number(document.getElementById( "packType" ).getAttribute( "value" ));
                                            if (packType == 2) return;
                                                
                                            scriptAPI = e.value;
                                            const modulesElement = document.getElementById( "modulesElement" );
                                            if (!e.value) {
                                                //scriptModules = [];
                                                modulesElement.style.display = "none";
                                            } else {
                                                document.getElementById( "modules" ).innerHTML = moduleToggle(manifestGenerator, packType);
                                                modulesElement.style.display = "block";
                                            };
                                        },
                                    }),
                                    `<div id="modulesElement" style="display: none;">
                                        ${
                                            Components.createElement("switch", {
                                                label: localisation.translate( "bedrocktools.manifestgenerator.beta" ),
                                                description: localisation.translate( "bedrocktools.manifestgenerator.beta.description" ),
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
                                        label: localisation.translate( "bedrocktools.manifestgenerator.layout" ),
                                        id: "layout",
                                        items: [
                                            localisation.translate( "bedrocktools.manifestgenerator.layout.beautified" ),
                                            localisation.translate( "bedrocktools.manifestgenerator.layout.minified" ),
                                        ],
                                        onChange: () => {},
                                    }),
                                ],
                            },
                        )}
                        ${Components.createElement("button", {
                            label: localisation.translate( "bedrocktools.manifestgenerator.generate" ),
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

                                const manifest = new manifestGenerator.Manifest(
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
                                        icon: "assets/tools/manifest.png",
                                        label: localisation.translate( "bedrocktools.toast.manifestgenerator.label" ),
                                        body: localisation.translate( "bedrocktools.toast.manifestgenerator.body" ),
                                        onClick: () => {
                                            sound.play( "ui.modal_hide" );
                                            navigator.clipboard.writeText( stringManifest );
                                            BedrockTools.sendToast(
                                                {
                                                    icon: "assets/checkbox.png",
                                                    label: localisation.translate( "bedrocktools.toast.success.manifestgenerator.label" ),
                                                    body: localisation.translate( "bedrocktools.toast.success.manifestgenerator.body" ),
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
                                        label: localisation.translate( "bedrocktools.manifestgenerator.output" ),
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

const moduleToggle = (manifestGenerator, type) => {
    return (
        (type == 0 ? manifestGenerator.scriptingModules.client : manifestGenerator.scriptingModules.server)
        /*.filter((m) => beta ? m.versions.find((m) => m.beta) : m.versions.find((m) => !m.beta))*/
        .map(
            (m) => {
                return (
                    Components.createElement("checkbox", {
                        label: m.module_name,
                        id: m.module_name,
                        checked: scriptModules.includes(m.module_name),
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
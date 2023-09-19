const BABYLON = require("babylonjs");
const BlockRegistry = BedrockTools.requestFacet("bedrocktools.blockregistry");
const StructureEditor = {
    Component: () => {
        const isRight = settings.get("right");
        return (
            Components.createHeader({ label: localisation.translate( "bedrocktools.advanced.structureeditor" ), back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 8%;margin-right: 8%;width: auto;gap: 15px;">
                    <div style="width: 100%;">
                        ${Components.createElements({ elements: [`<canvas id="viewer"></canvas>`] })}
                        <div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;width: auto;gap: 15px;">
                            <div style="width: 40%;">
                                ${Components.createElements({
                                    elements: [
                                        Components.createElement("upload", {
                                            label: "Upload:",
                                            id: "structureFile",
                                            text: {
                                                body: "Upload Structure file",
                                                id: "structureFileText",
                                            },
                                            accepts: ".mcstructure",
                                            onChange: (e) => {
                                                const [file] = e.files;
                                                if (file) document.getElementById("structureFileText").innerText = file.name;
                                            },
                                        })
                                    ],
                                })}
                                ${Components.createElement("button", {
                                    label: "Render",
                                    id: "render",
                                    variant: "hero",
                                    sound: "ui.release",
                                    onClick: async () => {
                                        const structureFile = document.getElementById("structureFile");
                                        // @ts-ignore
                                        const [file] = structureFile.files;
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.addEventListener(
                                                "load", async () => {
                                                    await structureManager.parseDataAsync(Buffer.from(reader.result));
                                                },
                                            );

                                            reader.readAsArrayBuffer(file);
                                        };
                                    },
                                })}
                            </div>
                            <div style="width: 100%;">
                                ${Components.createElements({
                                    elements: [
                                        Components.createElement("element", { label: "Block Editing Stuff Here..." })
                                    ]
                                })}
                            </div>
                        </div>
                    </div>
                </div>`
            )
        )
    },
    onLoad: () => {
        const engine = new Engine().createEngine("viewer");
        const scene = new SceneManager().createScene(engine);
        engine.startAnimationLoop(scene);
    }
};

class Engine {
    constructor()
    {
        /** @type {BABYLON.Engine} */
        this.engine = null;
        /** @type {document.element} */
        this.canvas = null;
    }

    /**
     * @argument {String} canvasId
     * @retuns Engine
     */
    createEngine(canvasId)
    {
        this.canvas = document.querySelector(`#${canvasId}`);
        this.engine = new BABYLON.Engine(this.canvas, true);
        return this;
    }

    /**
     * 
     * @param {BABYLON.Scene} scene 
     */
    startAnimationLoop(scene)
    {
        const engine = this;
        const route = () => router.routes.find((r) => r.route == router.history.list[router.history.list.length - 1]).route != "/structure_editor";
        engine.engine.runRenderLoop(function() {
            if(route())
            {
                scene.dispose();
                engine.dispose();
                return;
            }
            scene.render();
        });
    }

    dispose()
    {
        this.engine.stopRenderLoop();
        this.engine.dispose();
        this.canvas = null;
        this.engine = null;
    }
}

class SceneManager {
    /**
     * 
     * @param {Engine} engine
     */
    createScene(engine)
    {
        const scene = new BABYLON.Scene(engine.engine);
        const camera = new BABYLON.ArcRotateCamera("mainCamera", 0, 0, 10, new BABYLON.Vector3(), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(engine.canvas, true);
        camera.inputs.addMouseWheel();
        camera.wheelPrecision = 15;
        new BABYLON.AxesViewer(scene, 0.6, 0, null,null,null, 4);
        return scene;
    }

    createHemisphereLight(name = "mainAmbient", color = "#ffffff", intensity = 1.0, position = new BABYLON.Vector3()) {
        const light = new BABYLON.HemisphericLight(name, position);
        light.diffuse = BABYLON.Color3.FromHexString(color);
        light.intensity = intensity;
        return light;
    }

    createDirectionalLight(name = "mainDirectional", color = "#ffffff", intensity = 1.0, direction = new BABYLON.Vector3()) {
        const light = new BABYLON.DirectionalLight(name, direction, this.scene);
        light.intensity = intensity;
        light.diffuse = BABYLON.Color3.FromHexString(color);
        return light;
    }
}

class StructureManager {
    constructor() {
        /** @type {Object} the structure data.*/
        this.structureData = null;
        /** @type {BABYLON.Vector3} the structure size.*/
        this.structureSize = new BABYLON.Vector3();
        /** @type {BlockRegistry} the palette data*/
        this.blockRegistry = new BlockRegistry.BlockRegistry("assets/blocks");
        this.worldSpaceData = [];
        this.blocks = BedrockTools.requestFacet( "bedrocktools.blocks" );
    }

    /**
     * 
     * @param {BABYLON.Vector3} position 
     * @returns undefined | BlockData
     */
    getBlock(position = new BABYLON.Vector3()) {
        const block = this.virtualStructure.find(x => x.position.x == position.x && x.position.y == position.y && x.position.z == position.z);
        return block;
    }

    /**
     * @param {Buffer} structureBufferData 
     */
    async parseDataAsync(structureBufferData) {
        this.blockRegistry.dispose();
        const options = new BlockRegistry.BlockOptions();
        options.isVisible = false;
        this.blockRegistry.registerBlock("minecraft:air", options);

        const { parsed } = await NBT.parse(structureBufferData);
        this.structureData = parsed.value.structure.value;
        this.structureSize = new BABYLON.Vector3(parsed.value.size.value.value[0], parsed.value.size.value.value[1], parsed.value.size.value.value[2]);

        const palettes = this.structureData.palette.value.default.value.block_palette.value.value;
        for(let i = 0; i < palettes.length; i++)
        {
            const textures = this.blocks[palettes[i].name.value.replace("minecraft:", "")].textures;
            const blockOptions = new BlockRegistry.BlockOptions();
            if(textures != undefined) blockOptions.textures = this.getBlockTextureArray(textures);

            this.blockRegistry.registerBlock(palettes[i].name.value, blockOptions);
        }

        var selection = 0;
        for (let x = 0; x < this.structureSize.x; x++) {
            for (let y = 0; y < this.structureSize.y; y++) {
                for (let z = 0; z < this.structureSize.z; z++) {
                    const paletteSelection = this.structureData.block_indices.value.value[0].value[selection];

                    selection++;
                }
            }
        }
    }

    /**
     * 
     * @param {String | Object} texture
     */
    getBlockTextureArray(texture) {
        let list = [];
        if (typeof texture == "string") {
            const textureList = [
                texture + ".png",
                texture + ".png",
                texture + ".png",
                texture + ".png",
                texture + ".png",
                texture + ".png"
            ];
            list = textureList;
        }
        else {
            const keys = Object.keys(texture);
            if (keys.length == 3) {
                const textureList = [
                    texture["up"] + ".png",
                    texture["down"] + ".png",
                    texture["side"] + ".png",
                    texture["side"] + ".png",
                    texture["side"] + ".png",
                    texture["side"] + ".png"
                ];
                list = textureList;
            }
            else {
                const textureList = [
                    texture["up"] + ".png", //up
                    texture["down"] + ".png", //down
                    texture["west"] + ".png", //left
                    texture["east"] + ".png", //right
                    texture["north"] + ".png", //front
                    texture["south"] + ".png" //back
                ];
                list = textureList;
            }
        }

        return list;
    }
}

const structureManager = new StructureManager();

//this.route = () => 
//document.querySelector(`#${this.canvasId}`);
/*
animate = () => {
        const dispose = () => this.dispose();
        const route = () => this.route().route;
        const scene = this.scene;
        this.engine.runRenderLoop(function () {
            if (route() != "/structure_editor") {
                dispose();
            }
            scene.render();
        });
    };
    */
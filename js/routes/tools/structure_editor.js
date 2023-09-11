const BABYLON = require("babylonjs");
const StructureEditor = {
    Component: () => {
        const isRight = BedrockTools.settings.get("right");
        return (
            Components.createHeader({ text: BedrockTools.localisation.translate( "bedrocktools.advanced.structureeditor" ), back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 8%;margin-right: 8%;width: auto;gap: 15px;">
                    <div style="width: 100%;">
                        ${Components.createElements({ elements: [`<canvas id="viewer"></canvas>`] })}
                        <div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;width: auto;gap: 15px;">
                            <div style="width: 40%;">
                                ${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "upload",
                                    title: "Upload:",
                                    id: "structureFile",
                                    text: {
                                        body: "Upload Structure file",
                                        id: "structureFileText",
                                    },
                                    accept: ".mcstructure",
                                    onChange: (e) => {
                                        const [file] = e.files;
                                        if (file) document.getElementById("structureFileText").innerText = file.name;
                                    },
                                },
                            )
                        ],
                    },
                )}
                ${Components.createElement(
                    {
                        type: "button",
                        text: "Render",
                        id: "render",
                        style: "hero",
                        onClick: async () => {
                            const structureFile = document.getElementById("structureFile");
                            // @ts-ignore
                            const [file] = structureFile.files;
                            if (file) {
                                const reader = new FileReader();
                                reader.addEventListener(
                                    "load", async () => {
                                        sceneManager.resetScene();
                                        await structureManager.setDataAsync(Buffer.from(reader.result));
                                        sceneManager.generateStructure(structureManager);
                                    },
                                );

                                reader.readAsArrayBuffer(file);
                            };
                        },
                    },
                )}
                            </div>
                            <div style="width: 100%;">
                                ${Components.createElements({
                    elements: [
                        Components.createElement({
                            type: "element",
                            title: "Block Editing Stuff Here..."
                        })
                    ]
                })}
                            </div>
                        </div>
                    </div>
                </div>`
            )
        )
    },
    onLoad: () => sceneManager.setupScene(),
};

class SceneManager {
    constructor(canvasId = "viewer") {
        /** @type {String} */
        this.canvasId = canvasId;
        /** @type {HTMLCanvasElement} */
        this.canvas = null;
        /** @type {BABYLON.Engine} */
        this.engine = null;
        /** @type {BABYLON.Scene} */
        this.scene = null;
        /** @type {BABYLON.FreeCamera} */
        this.camera = null;
        this.route = () => BedrockTools.router.routes.find((r) => r.route == BedrockTools.router.history.list[BedrockTools.router.history.list.length - 1]);
    }

    resetScene() {
        this.engine.stopRenderLoop();
        this.scene.dispose();
        this.engine.dispose();
        this.camera.dispose();
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.camera = new BABYLON.FreeCamera("mainCamera", new BABYLON.Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.canvas, true);
        this.createHemisphereLight("mainAmbient", "#ffEEAA", 1, new BABYLON.Vector3(1,1,1));
        this.animate();
        //this.blockTextureLoader.clear();
        /*
        this.scene.background = (
            new THREE.CubeTextureLoader()
                .setPath("assets/panorama/")
                .load([
                    "panorama_1.png",
                    "panorama_3.png",
                    "panorama_4.png",
                    "panorama_5.png",
                    "panorama_0.png",
                    "panorama_2.png"
                ])
        );
        */
    }

    setupScene() {
        this.canvas = document.querySelector(`#${this.canvasId}`);
        this.engine = new BABYLON.Engine(this.canvas, true);
        this.scene = new BABYLON.Scene(this.engine);
        this.createHemisphereLight("mainAmbient", "#ffEEAA", 1, new BABYLON.Vector3(1,1,0));
        this.camera = new BABYLON.FreeCamera("mainCamera", new BABYLON.Vector3(0, 5, -10), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.canvas, true);

        this.animate();
    };

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

    dispose()
    {
        this.scene.dispose();
        this.engine.stopRenderLoop();
        this.engine.dispose();
        this.renderer = null;
        this.canvas = null;
        this.camera = null;
        this.blockTextureLoader = null;
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

    createGround(name = "mainGround", width = 6, height = 6) {
        const ground = BABYLON.MeshBuilder.CreateGround(name,
            { width: width, height: height }, this.scene);
        return ground;
    }


    generateStructure(structureManager) {
        for (let i = 0; i < structureManager.virtualStructure.length; i++) {
            this.addBlockAsync(structureManager.virtualStructure[i]);
        }
    }
    /**
     * 
     * @param {BlockData} block 
     * @returns 
     */
    async addBlockAsync(block) {
        if (block.paletteData.name.value == "minecraft:air") return;
        
        const cube = BABYLON.MeshBuilder.CreateBox(crypto.randomUUID(), { width: 1, height: 1 });
        cube.position = block.position;
    }
}
class StructureManager {
    constructor() {
        /** @type {Object} the structure data.*/
        this.structureData = null;
        /** @type {BABYLON.Vector3} the structure size.*/
        this.structureSize = new BABYLON.Vector3();
        /** @type {Array<BlockData>} virtual block data world.*/
        this.virtualStructure = [];
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
    async setDataAsync(structureBufferData) {
        this.virtualStructure = [];
        const { parsed } = await NBT.parse(structureBufferData);
        this.structureData = parsed.value.structure.value;
        this.structureSize = new BABYLON.Vector3(parsed.value.size.value.value[0], parsed.value.size.value.value[1], parsed.value.size.value.value[2]);
        var selection = 0;
        for (let x = 0; x < this.structureSize.x; x++) {
            for (let y = 0; y < this.structureSize.y; y++) {
                for (let z = 0; z < this.structureSize.z; z++) {
                    const palette = this.structureData.block_indices.value.value[0].value[selection];
                    const blockPaletteData = this.structureData.palette.value.default.value.block_palette.value.value[palette];
                    const block = new BlockData();
                    block.paletteData = blockPaletteData;
                    block.position = new BABYLON.Vector3(x, y, z);
                    block.texture = blocks[blockPaletteData.name.value.replace("minecraft:", "")].textures;
                    this.virtualStructure.push(block);
                    selection++;
                }
            }
        }
    }
}

class BlockData {
    constructor() {
        this.paletteData = null;
        this.position = new BABYLON.Vector3(0, 0, 0);
        this.texture = "missing_texture";
    }
}

const sceneManager = new SceneManager();
const structureManager = new StructureManager();
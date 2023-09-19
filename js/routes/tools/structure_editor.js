const BABYLON = require("babylonjs");
const BlockRegistry = BedrockTools.requestFacet("bedrocktools.blockregistry");
/** @type {BABYLON.Scene} */
let babylonScene;

/** @type {Engine} */
let engine;

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
                                                    babylonScene.dispose();
                                                    babylonScene = SceneManager.createScene(engine);
                                                    engine.startAnimationLoop(babylonScene);
                                                    await structureManager.parseDataAsync(Buffer.from(reader.result));

                                                    for(let i = 0; i < structureManager.worldSpaceData.length; i++)
                                                    {
                                                        SceneManager.createCube(structureManager.worldSpaceData[i], babylonScene);
                                                    }
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
        engine = new Engine().createEngine("viewer");
        babylonScene = SceneManager.createScene(engine);
        engine.startAnimationLoop(babylonScene);
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
                structureManager.dispose();
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
        babylonScene = null;
    }
}

class SceneManager {
    /**
     * 
     * @param {Engine} engine
     */
    static createScene(engine)
    {
        const scene = new BABYLON.Scene(engine.engine);
        const camera = new BABYLON.ArcRotateCamera("mainCamera", 0, 0, 10, new BABYLON.Vector3(), this.scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(engine.canvas, true);
        camera.inputs.addMouseWheel();
        camera.wheelPrecision = 15;
        this.createHemisphereLight("mainSun");
        new BABYLON.AxesViewer(scene, 0.6, 0, null,null,null, 4);
        //scene.debugLayer.show({overlay: true, handleResize: true});
        return scene;
    }

    static createHemisphereLight(name = "mainAmbient", color = "#ffffff", intensity = 1.0, position = new BABYLON.Vector3()) {
        const light = new BABYLON.HemisphericLight(name, position);
        light.diffuse = BABYLON.Color3.FromHexString(color);
        light.intensity = intensity;
        return light;
    }

    static createDirectionalLight(name = "mainDirectional", color = "#ffffff", intensity = 1.0, direction = new BABYLON.Vector3()) {
        const light = new BABYLON.DirectionalLight(name, direction, this.scene);
        light.intensity = intensity;
        light.diffuse = BABYLON.Color3.FromHexString(color);
        return light;
    }

    /**
     * @argument {BlockData} block
     * @argument {BABYLON.Scene} scene
     */
    static createCube(block, scene)
    {
        const foundMesh = scene.getMeshByName(block.data.name);
        if(foundMesh)
        {
            foundMesh.thinInstanceAdd(BABYLON.Matrix.Translation(block.position.x, block.position.y, block.position.z));
            return;
        }

        if(block.data.isVisible)
        {
            const cube = BABYLON.MeshBuilder.CreateBox(block.data.name, {width: 1, height: 1, depth: 1}, scene);
            const multi = new BABYLON.MultiMaterial(block.data.name, scene);

            const leftText = new BABYLON.Texture(block.data.textures[2], scene, true, false, BABYLON.Constants.TEXTURE_NEAREST_LINEAR);
            leftText.wAng = BABYLON.Tools.ToRadians(-90);
            const rightText = new BABYLON.Texture(block.data.textures[3], scene, true, false, BABYLON.Constants.TEXTURE_NEAREST_LINEAR);
            rightText.wAng = BABYLON.Tools.ToRadians(-90);

            const frontMat = new BABYLON.StandardMaterial(`${block.data.name}-front`, scene);
            frontMat.diffuseTexture = new BABYLON.Texture(block.data.textures[4], scene, true, false, BABYLON.Constants.TEXTURE_NEAREST_LINEAR);
            const backMat = new BABYLON.StandardMaterial(`${block.data.name}-back`, scene);
            backMat.diffuseTexture = new BABYLON.Texture(block.data.textures[5], scene, true, true, BABYLON.Constants.TEXTURE_NEAREST_LINEAR);
            const leftMat = new BABYLON.StandardMaterial(`${block.data.name}-left`, scene);
            leftMat.diffuseTexture = leftText;
            const rightMat = new BABYLON.StandardMaterial(`${block.data.name}-right`, scene);
            rightMat.diffuseTexture = rightText;
            const upMat = new BABYLON.StandardMaterial(`${block.data.name}-up`, scene);
            upMat.diffuseTexture = new BABYLON.Texture(block.data.textures[0], scene, true, false, BABYLON.Constants.TEXTURE_NEAREST_LINEAR);
            const downMat = new BABYLON.StandardMaterial(`${block.data.name}-down`, scene);
            downMat.diffuseTexture = new BABYLON.Texture(block.data.textures[1], scene, true, false, BABYLON.Constants.TEXTURE_NEAREST_LINEAR);
            multi.subMaterials.push(frontMat);
            multi.subMaterials.push(backMat);
            multi.subMaterials.push(leftMat);
            multi.subMaterials.push(rightMat);
            multi.subMaterials.push(upMat);
            multi.subMaterials.push(downMat);

            var verticesCount=cube.getTotalVertices();
	        cube.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, cube));
	        cube.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 6, 6, cube));
	        cube.subMeshes.push(new BABYLON.SubMesh(2, 2, verticesCount, 12, 6, cube));
	        cube.subMeshes.push(new BABYLON.SubMesh(3, 3, verticesCount, 18, 6, cube));
	        cube.subMeshes.push(new BABYLON.SubMesh(4, 4, verticesCount, 24, 6, cube));
	        cube.subMeshes.push(new BABYLON.SubMesh(5, 5, verticesCount, 30, 6, cube));
	        cube.material=multi;
        }
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
        /** @type {Array<Block>} */
        this.worldSpaceData = [];
        this.blocks = BedrockTools.requestFacet( "bedrocktools.blocks" );
    }

    /**
     * 
     * @param {BABYLON.Vector3} position 
     * @returns undefined | BlockData
     */
    getBlock(position = new BABYLON.Vector3()) {
        const block = this.worldSpaceData.find(x => x.position.x == position.x && x.position.y == position.y && x.position.z == position.z);
        return block;
    }

    /**
     * @param {Buffer} structureBufferData 
     */
    async parseDataAsync(structureBufferData) {
        this.blockRegistry.dispose();
        this.dispose();
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
                    const blockName = this.blockRegistry.getBlock(palettes[paletteSelection].name.value);
                    const block = new BlockData(blockName);
                    block.position = new BABYLON.Vector3(x,y,z);
                    this.worldSpaceData.push(block);
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

    dispose()
    {
        this.worldSpaceData = [];
    }
}

class BlockData
{
    /**
     * @argument {Block} block
     */
    constructor(block)
    {
        this.data = block;
        this.position = new BABYLON.Vector3();
    }
}

const structureManager = new StructureManager();
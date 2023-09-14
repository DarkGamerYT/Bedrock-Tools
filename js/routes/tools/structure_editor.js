const BABYLON = require("babylonjs");
const StructureEditor = {
    Component: () => {
        const isRight = BedrockTools.settings.get("right");
        return (
            Components.createHeader({ label: BedrockTools.localisation.translate( "bedrocktools.advanced.structureeditor" ), back: true, settings: true })
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
                                            accept: ".mcstructure",
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
                                                    sceneManager.resetScene();
                                                    await structureManager.setDataAsync(Buffer.from(reader.result));
                                                    sceneManager.generateStructure(structureManager);
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
        /** @type {BABYLON.ArcRotateCamera} */
        this.camera = null;
        /** @type {TextureManager} */
        this.textureManager = null;
        /** @type {MaterialManager} */
        this.materialManager = new MaterialManager();
        this.route = () => BedrockTools.router.routes.find((r) => r.route == BedrockTools.router.history.list[BedrockTools.router.history.list.length - 1]);
    }

    resetScene() {
        this.engine.stopRenderLoop();
        this.scene.dispose();
        this.engine.dispose();
        this.camera.dispose();
        this.setupScene();
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
        this.textureManager = new TextureManager("assets/blocks", "missing_texture.png", this.scene);
        this.createHemisphereLight("mainAmbient", "#ffEEAA", 1, new BABYLON.Vector3(1,1,0));
        this.camera = new BABYLON.ArcRotateCamera("mainCamera", 0, 0, 10, new BABYLON.Vector3(), this.scene);
        this.camera.setTarget(BABYLON.Vector3.Zero());
        this.camera.attachControl(this.canvas, true);
        this.camera.inputs.addMouseWheel();
        this.camera.wheelPrecision = 15;

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
        const material = block.getBlockMaterial(this.scene, this.textureManager, this.materialManager);
        const cube = BABYLON.MeshBuilder.CreateBox(crypto.randomUUID(), { width: 1, height: 1 });
        cube.material = material;
        cube.subMeshes=[];
    	var verticesCount=cube.getTotalVertices();
	    cube.subMeshes.push(new BABYLON.SubMesh(0, 0, verticesCount, 0, 6, cube));
	    cube.subMeshes.push(new BABYLON.SubMesh(1, 1, verticesCount, 6, 6, cube));
	    cube.subMeshes.push(new BABYLON.SubMesh(2, 2, verticesCount, 12, 6, cube));
	    cube.subMeshes.push(new BABYLON.SubMesh(3, 3, verticesCount, 18, 6, cube));
	    cube.subMeshes.push(new BABYLON.SubMesh(4, 4, verticesCount, 24, 6, cube));
	    cube.subMeshes.push(new BABYLON.SubMesh(5, 5, verticesCount, 30, 6, cube));
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
        this.isCube = true;
    }

    /**
     * @param {BABYLON.Scene} scene
     * @param {TextureManager} textureManager 
     * @param {MaterialManager} materialManager 
     */
    getBlockMaterial(scene, textureManager, materialManager)
    {
        if(this.isCube)
        {
            /** @type {Array<BABYLON.Texture>} */
            let cubeTexture;
            if(typeof this.texture == "string")
            {
                const textureList = [
                    this.texture + ".png",
                    this.texture + ".png",
                    this.texture + ".png",
                    this.texture + ".png",
                    this.texture + ".png",
                    this.texture + ".png"
                ]
                cubeTexture = textureManager.loadCubeTextures(scene, textureList, this.paletteData.name.value);
            }
            else
            {
                const keys = Object.keys(this.texture);
                if(keys.length == 3)
                {
                    const textureList = [
                        this.texture["up"] + ".png",
                        this.texture["down"] + ".png",
                        this.texture["side"] + ".png",
                        this.texture["side"] + ".png",
                        this.texture["side"] + ".png",
                        this.texture["side"] + ".png"
                    ]
                    cubeTexture = textureManager.loadCubeTextures(scene, textureList, this.paletteData.name.value);
                }
                else
                {
                    const textureList = [
                        this.texture["up"] + ".png",
                        this.texture["down"] + ".png",
                        this.texture["east"] + ".png",
                        this.texture["west"] + ".png",
                        this.texture["north"] + ".png",
                        this.texture["south"] + ".png"
                    ]
                    cubeTexture = textureManager.loadCubeTextures(scene, textureList, this.paletteData.name.value);
                }
            }

            return materialManager.createCubeMaterial(scene, cubeTexture, this.paletteData.name.value);
        }
    }
}

class TextureManager
{
    /**
     * 
     * @param {String} rootPath 
     * @param {String} defaultTexture
     * @param {BABYLON.Scene} scene
     */
    constructor(rootPath = "assets/blocks", defaultTexture, scene)
    {
        /** @type {Array<BABYLON.Texture>} */
        this.textures = [];
        /** @type {Array<String>} */
        this.failedPaths = [];
        /** @type {String} */
        this.rootPath = rootPath;
        /** @type {BABYLON.Texture} */
        this.defaultTexture = this.loadTexture(scene, defaultTexture, "missing_texture");
    }

    /**
     * 
     * @param {Array<String>} urls
     * @param {BABYLON.Scene} scene
     * @param {String} name
     * @returns {Array<BABYLON.Texture>}
     */
    loadCubeTextures(scene, urls = [], name)
    {
        /** @type {Array<BABYLON.Texture>} */
        const textures = [];
        for(let i = 0; i < urls.length; i++)
        {
            textures.push(this.loadTexture(scene, urls[i], `${name}-${i}`));
        }
        return textures;
    }

    /**
     * @param {BABYLON.Scene} scene
     * @param {String} url
     * @param {String} name
     * @returns {BABYLON.Texture}
     */
    loadTexture(scene, url = "missing_texture", name)
    {
        const loadedTexture = this.textures.findIndex(x => x.name == name)
        if(loadedTexture != -1) return this.textures[loadedTexture];

        const fullpath = `${this.rootPath}/${url}`;
        if(this.failedPaths.includes(fullpath)) return this.defaultTexture;

        const texture = new BABYLON.Texture(fullpath, scene, true, false, BABYLON.Constants.TEXTURE_NEAREST_SAMPLINGMODE);
        if(texture.loadingError) 
        {
            this.failedPaths.push(fullpath);
            return this.defaultTexture;
        }
        this.textures.push(texture);
        return texture;
    }

    clear()
    {
        this.textures = [];
        this.failedPaths = [];
    }
}

class MaterialManager
{
    constructor()
    {
        /** @type {Array<BABYLON.Material>} */
        this.materials = [];
    }

    /**
     * 
     * @param {BABYLON.Scene} scene 
     * @param {Array<BABYLON.BaseTexture>} texture
     * @param {String} name
     * @returns {BABYLON.Material}
     */
    createCubeMaterial(scene, texture, name)
    {
        const mat = this.materials.findIndex(x => x.name == name);
        if(mat != -1) return this.materials[mat];

        const multiMaterial = new BABYLON.MultiMaterial(name, scene);

        for(let i = 0; i < texture.length; i++)
        {
            const material = new BABYLON.StandardMaterial(`${name}-${i}`, scene);
            material.diffuseTexture = texture[i];
            multiMaterial.subMaterials.push(material);
        }
        this.materials.push(multiMaterial);
        return multiMaterial;
    }

    clear()
    {
        this.materials = [];
    }
}

const sceneManager = new SceneManager();
const structureManager = new StructureManager();
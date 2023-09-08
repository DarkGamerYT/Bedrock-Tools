const THREE = require("three");
const StructureEditor = {
    Component: () => {
        const isRight = BedrockTools.settings.get("right");
        return (
            Components.createHeader({ text: "Structure Editor", back: true, settings: true })
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
                                        await structureManager.setData(Buffer.from(reader.result));
                                        sceneManager.generateStructureAsync(structureManager);
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
    onLoad: () => sceneManager.createScene(),
};

class SceneManager {
    constructor(canvasId = "viewer") {
        this.canvas = null;
        this.canvasId = canvasId;
        this.renderer = null;
        this.scene = new THREE.Scene({ antialias: true });
        this.camera = null;
        this.blockTextureLoader = new THREE.TextureLoader().setPath("assets/blocks/");
        this.route = () => BedrockTools.router.routes.find((r) => r.route == BedrockTools.router.history.list[BedrockTools.router.history.list.length - 1]);
    }

    resetScene()
    {
        this.scene.traverse( function( object ) {
            if(object.isMesh)
            {
                object.geometry.dispose();
                object.material.dispose();
            }
            if(object.isTexture)
            {
                object.dispose();
            }
            if(object.isLight)
            {
                object.dispose();
            }
        
        } );
        this.scene.clear();
        const light = this.createDirectionalLight(0xfff0c9, 4);
        this.scene.add(new THREE.GridHelper(3, 3));
        this.scene.add(light, this.createAmbientLight(0xfff0c9, 1));

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
    }

    createScene() {
        this.canvas = document.querySelector(`#${this.canvasId}`);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setPixelRatio(window.devicePixelRatio * 5);
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);

        const light = this.createDirectionalLight(0xfff0c9, 4);
        this.scene.add(new THREE.GridHelper(3, 3));
        this.scene.add(light, this.createAmbientLight(0xfff0c9, 1));

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
        
        new OrbitControls(this.camera, this.renderer.domElement);

        this.camera.position.setX(5);
        this.camera.position.setY(5);
        this.camera.position.setZ(5);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.animate();
    };

    animate = () => {
        if (this.route().route != "/structure_editor") 
        {
            this.scene.clear();
            this.renderer.dispose();
            this.renderer = null;
            this.canvas = null;
            this.camera = null;
            return;
        }
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    };
    /*
    createCube(
        position = new THREE.Vector3(0, 0, 0),
        imgSourceFront = "missing_texture",
        imgSourceBack = undefined,
        imgSourceLeft = undefined,
        imgSourceRight = undefined,
        imgSourceTop = undefined,
        imgSourceBottom = undefined
    ) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const loader = new THREE.TextureLoader().setPath("assets/blocks/");
        let material;
        if (imgSourceBack) {
            const frontTexture = loader.load((imgSourceFront ?? "missing_texture") + ".png");
            const backTexture = loader.load((imgSourceBack ?? "missing_texture") + ".png");
            const leftTexture = loader.load((imgSourceLeft ?? "missing_texture") + ".png");
            const rightTexture = loader.load((imgSourceRight ?? "missing_texture") + ".png");
            const topTexture = loader.load((imgSourceTop ?? "missing_texture") + ".png");
            const bottomTexture = loader.load((imgSourceBottom ?? "missing_texture") + ".png");

            frontTexture.magFilter = THREE.NearestFilter;
            frontTexture.encoding = THREE.sRGBEncoding;
            backTexture.magFilter = THREE.NearestFilter;
            backTexture.encoding = THREE.sRGBEncoding;
            leftTexture.magFilter = THREE.NearestFilter;
            leftTexture.encoding = THREE.sRGBEncoding;
            rightTexture.magFilter = THREE.NearestFilter;
            rightTexture.encoding = THREE.sRGBEncoding;
            topTexture.magFilter = THREE.NearestFilter;
            topTexture.encoding = THREE.sRGBEncoding;
            bottomTexture.magFilter = THREE.NearestFilter;
            bottomTexture.encoding = THREE.sRGBEncoding;

            material = [
                new THREE.MeshLambertMaterial({ map: rightTexture, side:THREE.DoubleSide }),
                new THREE.MeshLambertMaterial({ map: leftTexture, side:THREE.DoubleSide }),
                new THREE.MeshLambertMaterial({ map: topTexture, side:THREE.DoubleSide }),
                new THREE.MeshLambertMaterial({ map: bottomTexture, side:THREE.DoubleSide }),
                new THREE.MeshLambertMaterial({ map: frontTexture, side:THREE.DoubleSide }),
                new THREE.MeshLambertMaterial({ map: backTexture, side:THREE.DoubleSide })
            ];
        }
        else {
            const texture = loader.load((imgSourceFront ?? "missing_texture") + ".png");
            texture.magFilter = THREE.NearestFilter;
            texture.encoding = THREE.sRGBEncoding;
            material = new THREE.MeshLambertMaterial({ map: texture, side:THREE.DoubleSide });
        };

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(position.x, position.y, position.z)
        return cube;
    }
    */

    createDirectionalLight(color = 0xffffff, intensity = 1.0) {
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set( 1, 1, 1 ); //default; light shining from top
        return light;
    }

    createAmbientLight(color = 0xffffff, intensity = 1.0) {
        const light = new THREE.AmbientLight(color, intensity);
        return light;
    }

    createLines(points = [], color = 0xffffff) {
        const material = new THREE.LineBasicMaterial({ color: color });
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        return line;
    }

    createSizeLines(structureSize = [], startPoint = new THREE.Vector3(0,0,0), isRgb = false, flipX = false, flipY = false, flipZ = false)
    {
        const xLine = this.createLines([
            startPoint,
            new THREE.Vector3(flipX? startPoint.x - structureSize[0] : startPoint.x + structureSize[0], startPoint.y, startPoint.z)
        ],
            isRgb? 0xff0000 : 0xffffff);
        const yLine = this.createLines([
            startPoint,
            new THREE.Vector3(startPoint.x, flipY? startPoint.y - structureSize[1] : startPoint.y + structureSize[1], startPoint.z)
        ],
        isRgb? 0x00ff00 : 0xffffff);
        const zLine = this.createLines([
            startPoint,
            new THREE.Vector3(startPoint.x, startPoint.y, flipZ? startPoint.z - structureSize[2] : startPoint.z + structureSize[2])
        ],
        isRgb? 0x0000ff : 0xffffff);
        return { xLine, yLine, zLine };
    }

    async generateStructureAsync(structureManager)
    {
        for(let i = 0; i < structureManager.virtualStructure.length; i++)
        {
            try
            {
                await this.addBlockAsync(structureManager.virtualStructure[i]);
            }
            catch
            {

            }
        }
    }

    //Block managing stuff...
    async addBlockAsync(block)
    {
        if(block.paletteData.name.value == "minecraft:air") return;
        const bnx = structureManager.getBlock(new THREE.Vector3(block.position.x - 1, block.position.y, block.position.z));
        const bpx = structureManager.getBlock(new THREE.Vector3(block.position.x + 1, block.position.y, block.position.z));
        const bny = structureManager.getBlock(new THREE.Vector3(block.position.x, block.position.y - 1, block.position.z));
        const bpy = structureManager.getBlock(new THREE.Vector3(block.position.x, block.position.y + 1, block.position.z));
        const bnz = structureManager.getBlock(new THREE.Vector3(block.position.x, block.position.y, block.position.z - 1));
        const bpz = structureManager.getBlock(new THREE.Vector3(block.position.x, block.position.y, block.position.z + 1));

        const blockTexture = await block.getTextureAsync(this.blockTextureLoader);

        if(bnx == undefined || block.paletteData.name.value != bnx?.paletteData.name.value)
        {
            const texture = blockTexture.right;
            texture.magFilter = THREE.NearestFilter;
            texture.encoding = THREE.sRGBEncoding;
            const planeGeo = new THREE.PlaneGeometry( 1, 1 );
            planeGeo.rotateY( - Math.PI / 2 );
            planeGeo.translate( block.position.x - 0.5, block.position.y, block.position.z );

            const mesh = new THREE.Mesh( planeGeo, new THREE.MeshLambertMaterial( { map: texture } ) );

            this.scene.add(mesh);
        }
        if(bpx == undefined || block.paletteData.name.value != bpx?.paletteData.name.value)
        {
            const texture = blockTexture.left;
            texture.magFilter = THREE.NearestFilter;
            texture.encoding = THREE.sRGBEncoding;
            const planeGeo = new THREE.PlaneGeometry( 1, 1 );
            planeGeo.rotateY( Math.PI / 2 );
            planeGeo.translate( block.position.x + 0.5, block.position.y, block.position.z );

            const mesh = new THREE.Mesh( planeGeo, new THREE.MeshLambertMaterial( { map: texture } ) );

            this.scene.add(mesh);
        }
        if(bny == undefined || block.paletteData.name.value != bny?.paletteData.name.value)
        {
            const texture = blockTexture.down;
            texture.magFilter = THREE.NearestFilter;
            texture.encoding = THREE.sRGBEncoding;
            const planeGeo = new THREE.PlaneGeometry( 1, 1 );
			planeGeo.rotateX( Math.PI / 2 );
			planeGeo.translate( block.position.x, block.position.y - 0.5, block.position.z );

            const mesh = new THREE.Mesh( planeGeo, new THREE.MeshLambertMaterial( { map: texture } ) );

            this.scene.add(mesh);
        }
        if(bpy == undefined || block.paletteData.name.value != bpy?.paletteData.name.value)
        {
            const texture = blockTexture.up;
            texture.magFilter = THREE.NearestFilter;
            texture.encoding = THREE.sRGBEncoding;
            const planeGeo = new THREE.PlaneGeometry( 1, 1 );
			planeGeo.rotateX( - Math.PI / 2 );
			planeGeo.translate( block.position.x, block.position.y + 0.5, block.position.z );

            const mesh = new THREE.Mesh( planeGeo, new THREE.MeshLambertMaterial( { map: texture } ) );

            this.scene.add(mesh);
        }
        if(bnz == undefined || block.paletteData.name.value != bnz?.paletteData.name.value)
        {
            const texture = blockTexture.front;
            texture.magFilter = THREE.NearestFilter;
            texture.encoding = THREE.sRGBEncoding;
            const planeGeo = new THREE.PlaneGeometry( 1, 1 );
			planeGeo.rotateY( Math.PI );
			planeGeo.translate( block.position.x, block.position.y, block.position.z - 0.5 );

            const mesh = new THREE.Mesh( planeGeo, new THREE.MeshLambertMaterial( { map: texture } ) );

            this.scene.add(mesh);
        }
        if(bpz == undefined || block.paletteData.name.value != bpz?.paletteData.name.value)
        {
            const texture = blockTexture.back;
            texture.magFilter = THREE.NearestFilter;
            texture.encoding = THREE.sRGBEncoding;
            const planeGeo = new THREE.PlaneGeometry( 1, 1 );
			planeGeo.translate( block.position.x, block.position.y, block.position.z + 0.5 );

            const mesh = new THREE.Mesh( planeGeo, new THREE.MeshLambertMaterial( { map: texture } ) );

            this.scene.add(mesh);
        }
    }
}
class StructureManager
{
    constructor()
    {
        /** @type {Object} the structure data.*/
        this.structureData = null;
        /** @type {THREE.Vector3} the structure size.*/
        this.structureSize = new THREE.Vector3(0,0,0);
        /** @type {Array<BlockData>} virtual block data world.*/
        this.virtualStructure = [];
    }

    /**
     * 
     * @param {THREE.Vector3} position 
     * @returns undefined | BlockData
     */
    getBlock(position = new THREE.Vector3(0,0,0))
    {
        const block = this.virtualStructure.find(x => x.position.x == position.x && x.position.y == position.y && x.position.z == position.z); 
        return block;
    }

    /**
     * @param {Buffer} structureBufferData 
     */
    async setData(structureBufferData)
    {
        const { parsed } = await NBT.parse(structureBufferData);
        this.structureData = parsed.value.structure.value;
        this.structureSize = new THREE.Vector3(parsed.value.size.value.value[0], parsed.value.size.value.value[1], parsed.value.size.value.value[2]);
        var selection = 0;
        for (let x = 0; x < this.structureSize.x; x++) {
            for (let y = 0; y < this.structureSize.y; y++) {
                for (let z = 0; z < this.structureSize.z; z++) {
                    const palette = this.structureData.block_indices.value.value[0].value[selection];
                    const blockPaletteData = this.structureData.palette.value.default.value.block_palette.value.value[palette];
                    const block = new BlockData();
                    block.paletteData = blockPaletteData;
                    block.position = new THREE.Vector3(x,y,z);
                    block.texture = blocks[blockPaletteData.name.value.replace("minecraft:","")].textures;
                    this.virtualStructure.push(block);
                    selection++;
                }
            }
        }
    }
}

class BlockData
{
    constructor()
    {
        this.paletteData = null;
        this.position = new THREE.Vector3(0,0,0);
        this.texture = "missing_texture";
    }

    async getTextureAsync(loader)
    {
        const missingTexture = await loader.load("missing_texture.png");
        const textures = {
                up : missingTexture,
                down : missingTexture,
                left : missingTexture,
                right : missingTexture,
                front : missingTexture,
                back : missingTexture
        }
        if(typeof this.texture == "object")
        {
            const objectTexture = Object.keys(this.texture);
            if(objectTexture.length == 3)
            {
                let upTexture = undefined; 
                let sideTexture = undefined;
                let downTexture = undefined;
                try {
                    upTexture = await loader.loadAsync(this.texture?.up + ".png");
                }
                catch {}
                try {
                    sideTexture = await loader.loadAsync(this.texture?.side + ".png");
                }
                catch {}
                try {
                    downTexture = await loader.loadAsync(this.texture?.down + ".png");
                }
                catch {}

                textures.up = upTexture ?? missingTexture;
                textures.down = downTexture ?? missingTexture;
                textures.left = sideTexture ?? missingTexture;
                textures.right = sideTexture ?? missingTexture;
                textures.front = sideTexture ?? missingTexture;
                textures.back = sideTexture ?? missingTexture;
                return textures;
            }
        }
        else
        {
            try
            {
                const blockTexture = await loader.loadAsync(this.texture + ".png");
                textures.up = blockTexture ?? missingTexture;
                textures.down = blockTexture ?? missingTexture;
                textures.left = blockTexture ?? missingTexture;
                textures.right = blockTexture ?? missingTexture;
                textures.front = blockTexture ?? missingTexture;
                textures.back = blockTexture ?? missingTexture;
            }
            catch {}
            return textures;
        }
    }
}

const sceneManager = new SceneManager();
const structureManager = new StructureManager();
const THREE = require("three");
let structureData;
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
                                        const { parsed } = await NBT.parse(Buffer.from(reader.result));
                                        const structureSize = parsed.value.size.value.value;
                                        structureData = parsed.value.structure.value;
                                        
                                        const rgbLines = sceneManager.createSizeLines(structureSize, new THREE.Vector3(-structureSize[0] / 2, 0, -structureSize[2] / 2), true);
                                        const sizeLines1 = sceneManager.createSizeLines(structureSize, new THREE.Vector3(structureSize[0] / 2, 0, structureSize[2] / 2), false, true, false, true);
                                        const sizeLines2 = sceneManager.createSizeLines(structureSize, new THREE.Vector3(-structureSize[0] / 2, structureSize[1], structureSize[2] / 2), false, false, true, true);
                                        const sizeLines3 = sceneManager.createSizeLines(structureSize, new THREE.Vector3(structureSize[0] / 2, structureSize[1], -structureSize[2] / 2), false, true, true, false);
                                        sceneManager.scene.add(rgbLines.xLine, rgbLines.yLine, rgbLines.zLine)
                                        sceneManager.scene.add(sizeLines1.xLine, sizeLines1.yLine, sizeLines1.zLine)
                                        sceneManager.scene.add(sizeLines2.xLine, sizeLines2.yLine, sizeLines2.zLine)
                                        sceneManager.scene.add(sizeLines3.xLine, sizeLines3.yLine, sizeLines3.zLine)

                                        var selection = 0;
                                        for (let x = 0; x < structureSize[0]; x++) {
                                            for (let y = 0; y < structureSize[1]; y++) {
                                                for (let z = 0; z < structureSize[2]; z++) {
                                                    const palette = structureData.block_indices.value.value[0].value[selection];
                                                    const block = structureData.palette.value.default.value.block_palette.value.value[palette];
                                                    if (block.name.value != "minecraft:air") {
                                                        var texturePath = block.name.value.replace("minecraft:", "");
                                                        const blockTexture = blocks[texturePath];
                                                        const blockTextureType = typeof blockTexture?.textures;
                                                        if(blockTextureType == "object")
                                                        {
                                                            if(Object.keys(blockTexture.textures).length == 3)
                                                            {
                                                                sceneManager.scene.add(sceneManager.createCube(new THREE.Vector3(x - structureSize[0]/2 + 0.5, y + 0.5, z - structureSize[2]/2 + 0.5),
                                                                    blockTexture.textures.side,
                                                                    blockTexture.textures.side,
                                                                    blockTexture.textures.side,
                                                                    blockTexture.textures.side,
                                                                    blockTexture.textures.up,
                                                                    blockTexture.textures.down));
                                                            }
                                                            else
                                                            {
                                                                sceneManager.scene.add(sceneManager.createCube(new THREE.Vector3(x - structureSize[0]/2 + 0.5, y + 0.5, z - structureSize[2]/2 + 0.5),
                                                                    blockTexture.textures.north,
                                                                    blockTexture.textures.south,
                                                                    blockTexture.textures.east,
                                                                    blockTexture.textures.west,
                                                                    blockTexture.textures.up,
                                                                    blockTexture.textures.down));
                                                            }
                                                        }
                                                        else
                                                            sceneManager.scene.add(sceneManager.createCube(new THREE.Vector3(x - structureSize[0]/2 + 0.5, y + 0.5, z - structureSize[2]/2 + 0.5), blockTexture.textures));
                                                        
                                                    }
                                                    selection++;
                                                }
                                            }
                                        };
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
        this.route = () => BedrockTools.router.routes.find((r) => r.route == BedrockTools.router.history.list[BedrockTools.router.history.list.length - 1]);
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
}
const sceneManager = new SceneManager();
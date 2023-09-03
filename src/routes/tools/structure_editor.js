const THREE = require("three");
let structureData;
window.router.routes.push({
    name: "Structure Editor",
    route: "/structure_editor",
    rpc: "structureEditor",
    component: () => {
        const isRight = window.settings.get("right");
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
                                    accept: "mcstructure",
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
                                        const startPoint = new THREE.Vector3(-structureSize[0] / 2, 0, -structureSize[2] / 2);
                                        const xLine = sceneManager.createLines([
                                            startPoint,
                                            new THREE.Vector3(startPoint.x + structureSize[0], startPoint.y, startPoint.z)
                                        ],
                                            0xff0000);
                                        const yLine = sceneManager.createLines([
                                            startPoint,
                                            new THREE.Vector3(startPoint.x, startPoint.y + structureSize[1], startPoint.z)
                                        ],
                                            0x00ff00);
                                        const zLine = sceneManager.createLines([
                                            startPoint,
                                            new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z + structureSize[2])
                                        ],
                                            0x0000ff);
                                        sceneManager.scene.add(xLine, yLine, zLine);
                                        console.log(structureData);

                                        var selection = 0;
                                        for (let x = 0; x < structureSize[0]; x++) {
                                            for (let y = 0; y < structureSize[1]; y++) {
                                                for (let z = 0; z < structureSize[2]; z++) {
                                                    const palette = structureData.block_indices.value.value[0].value[selection];
                                                    const block = structureData.palette.value.default.value.block_palette.value.value[palette];
                                                    if (block.name.value != "minecraft:air") {
                                                        var texturePath = block.name.value.replace("minecraft:", "");
                                                        sceneManager.scene.add(sceneManager.createCube(new THREE.Vector3(x - 0.5, y + 0.5, z - 0.5), texturePath));
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
    extra: () => sceneManager.createScene()
});

class SceneManager {
    constructor(canvasId = "viewer") {
        this.canvas = null;
        this.canvasId = canvasId;
        this.renderer = null;
        this.scene = new THREE.Scene({ antialias: true });
        this.camera = null;
        this.route = () => window.router.routes.find((r) => r.route == window.router.history.list[window.router.history.list.length - 1]);
    }

    createScene() {
        this.canvas = document.querySelector(`#${this.canvasId}`);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });

        this.renderer.setPixelRatio(window.devicePixelRatio * 5);
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);
        this.scene.add(new THREE.GridHelper(3, 3));
        this.scene.add(this.createDirectionalLight(0xfff4d7, 2), this.createAmbientLight(0xfff4d7));

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
            backTexture.magFilter = THREE.NearestFilter;
            leftTexture.magFilter = THREE.NearestFilter;
            rightTexture.magFilter = THREE.NearestFilter;
            topTexture.magFilter = THREE.NearestFilter;
            bottomTexture.magFilter = THREE.NearestFilter;

            material = [
                new THREE.MeshStandardMaterial({ map: rightTexture }),
                new THREE.MeshStandardMaterial({ map: leftTexture }),
                new THREE.MeshStandardMaterial({ map: topTexture }),
                new THREE.MeshStandardMaterial({ map: bottomTexture }),
                new THREE.MeshStandardMaterial({ map: frontTexture }),
                new THREE.MeshStandardMaterial({ map: backTexture })
            ];
        }
        else {
            const texture = loader.load((imgSourceFront ?? "missing_texture") + ".png");
            texture.magFilter = THREE.NearestFilter;
            texture.colorSpace = THREE.SRGBColorSpace;
            material = new THREE.MeshStandardMaterial({ map: texture });
        };

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(position.x, position.y, position.z);
        return cube;
    }

    createDirectionalLight(color = 0xffffff, intensity = 1.0) {
        const light = new THREE.DirectionalLight(color, intensity);
        light.translateOnAxis(new THREE.Vector3(1, 1, 1), 20);
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
}
const sceneManager = new SceneManager();
const THREE = require('three');
window.router.routes.push({
    name: "Structure Editor",
    route: "/structure_editor",
    rpc: "structureEditor",
    component: () => {
        const isRight = window.settings.get("right");
        return (
            Components.createHeader({ text: "Structure Editor", back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 100%;">
                        ${Components.createElements({
                            elements: [
                                `<canvas id="viewer" style="margin: 10px;"></canvas>`
                            ]
                        })}
                    </div>
                </div>`
            )
        )
    },
    extra: () => sceneManager.createScene()
});

class SceneManager
{
    constructor(canvasId = "viewer")
    {
        this.canvas = null;
        this.canvasId = canvasId;
        this.renderer = null;
        this.scene = new THREE.Scene();
        this.camera = null;
        this.route = () => window.router.routes.find((r) => r.route == window.router.history.list[window.router.history.list.length - 1]);
    }

    createScene()
    {        
        this.canvas = document.querySelector(`#${this.canvasId}`)
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas
        });
        this.renderer.setPixelRatio(window.devicePixelRatio * 5);
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 5000);
        const grid = new THREE.GridHelper(75, 100);
        this.scene.add(grid, this.createCube(new THREE.Vector3(0,1,0), "assets/imgs/test/missing_texture.png", "assets/imgs/test/missing_texture.png"), this.createDirectionalLight(0xfff4d7, 2), this.createAmbientLight(0xfff4d7));
        this.scene.background = new THREE.Color(0.01,0.2,0.2);

        new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.setZ(30);
        this.animate();
    }

    animate = () =>
    {
        if(this.route().route != "/structure_editor") return;
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    createCube(position = new THREE.Vector3(0,0,0), imgSourceFront = "assets/imgs/test/missing_texture.png", imgSourceBack = undefined, imgSourceLeft = undefined, imgSourceRight = undefined, imgSourceTop = undefined, imgSourceBottom = undefined)
    {
        const geometry = new THREE.BoxGeometry(1,1,1);
        const loader = new THREE.TextureLoader();
        let material;
        if(imgSourceBack != undefined)
        {
            const frontTexture =  loader.load(imgSourceFront);
            const backTexture = loader.load(imgSourceBack);
            const leftTexture = loader.load(imgSourceLeft);
            const rightTexture = loader.load(imgSourceRight);
            const topTexture = loader.load(imgSourceTop);
            const bottomTexture = loader.load(imgSourceBottom);

            frontTexture.magFilter = THREE.NearestFilter;
            frontTexture.minFilter = THREE.NearestFilter;
            backTexture.magFilter = THREE.NearestFilter;
            backTexture.minFilter = THREE.NearestFilter;
            leftTexture.magFilter = THREE.NearestFilter;
            leftTexture.minFilter = THREE.NearestFilter;
            rightTexture.magFilter = THREE.NearestFilter;
            rightTexture.minFilter = THREE.NearestFilter;
            topTexture.magFilter = THREE.NearestFilter;
            topTexture.minFilter = THREE.NearestFilter;
            bottomTexture.magFilter = THREE.NearestFilter;
            bottomTexture.minFilter = THREE.NearestFilter;
            const cubeMaterials = [
                new THREE.MeshStandardMaterial( {map: frontTexture} ),
                new THREE.MeshStandardMaterial( {map: backTexture} ),
                new THREE.MeshStandardMaterial( {map: leftTexture} ),
                new THREE.MeshStandardMaterial( {map: rightTexture} ),
                new THREE.MeshStandardMaterial( {map: topTexture} ),
                new THREE.MeshStandardMaterial( {map: bottomTexture} )
            ]
            material = cubeMaterials;
        }
        else
        {
            const texture = loader.load(imgSourceFront);
            texture.magFilter = THREE.NearestFilter;
            texture.minFilter = THREE.NearestFilter;
            material = new THREE.MeshStandardMaterial( {map: texture} ); 
        }
        const cube = new THREE.Mesh( geometry, material ); 
        cube.position.set(position.x, position.y, position.z);
        return cube;
    }

    createDirectionalLight(color = 0xffffff, intensity = 1.0, rotation = new THREE.Vector3(0,0,0))
    {
        const light = new THREE.DirectionalLight(color, intensity);
        light.translateOnAxis(new THREE.Vector3(1,1,1), 20);
        return light;
    }

    createAmbientLight(color = 0xffffff, intensity = 1.0)
    {
        const light = new THREE.AmbientLight(color, intensity);
        return light;
    }
}
const sceneManager = new SceneManager();
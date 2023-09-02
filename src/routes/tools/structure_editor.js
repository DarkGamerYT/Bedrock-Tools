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
        this.camera = new THREE.PerspectiveCamera(75, this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000);

        const grid = new THREE.GridHelper(75, 100);
        this.scene.add(grid, this.createCube());
        this.scene.background = new THREE.Color(0.01,0.2,0.2);

        new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.setZ(30);
        this.animate();
    }

    animate = () =>
    {
        if(this.route().route != "/structure_editor") return;
        console.log("test");
        requestAnimationFrame(this.animate);
        this.renderer.render(this.scene, this.camera);
    }

    createCube()
    {
        const geometry = new THREE.BoxGeometry(1,1,1);
        const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        const cube = new THREE.Mesh( geometry, material ); 
        return cube;
    }
}
const sceneManager = new SceneManager();
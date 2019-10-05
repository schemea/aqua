import {AmbientLight, Color, PerspectiveCamera, Scene, SpotLight, Vector3, WebGLRenderer} from "three";
import {Aquarium} from "./aquarium";
import {Fish} from "./fish";
import {Vector} from "./vector";

export class World {
    renderer: WebGLRenderer;
    scene: Scene = new Scene();
    camera = new PerspectiveCamera(35);
    light = new SpotLight(0xffffff);
    ambient = new AmbientLight(0xffffff);

    private timestamp: DOMHighResTimeStamp = 0;
    public aquarium = new Aquarium();

    get canvas() {
        return this.renderer.domElement;
    }

    constructor() {
        this.renderer = new WebGLRenderer({
            antialias: true,
            alpha: false
        });

        // this.scene.background = new Color(0x020210);
        this.scene.background = new Color(0xdddddd);

        this.initialize();
    }

    private renderLoop(newTimestamp: DOMHighResTimeStamp) {
        const elapsed = newTimestamp - this.timestamp;
        this.timestamp = newTimestamp;

        this.aquarium.update(elapsed);

        this.renderer.render(this.scene, this.camera)
    }

    onClick(event: MouseEvent) {
        Object.assign(window, {
            Vector,
            Vector3,
            camera: this.camera,
            aquarium: this.aquarium
        });
        const projection = Vector.projectMouse(event, this.camera, -this.camera.position.z);
        console.log(projection);
        const fish = new Fish(this);
        const rand = (delta: number) => Math.random() * 2 * delta - delta;
        fish.movement = Vector.random().multiplyScalar(fish.speed + rand(0.05));
        fish.position.copy(new Vector3(0, 0, 0));
        this.aquarium.addFish(fish);
        this.scene.add(fish.mesh);
    }

    initializeLights() {
        this.light.position.set(0, this.aquarium.volume.y * 1.2, 0);
        this.light.lookAt(0, 0, 0);
        this.light.intensity = 1.5;
        this.light.castShadow = true;

        this.ambient.intensity = 0.5;

        this.scene.add(this.light);
        this.scene.add(this.ambient);
    }

    initializeEvents() {
        document.addEventListener("click", this.onClick.bind(this));
    }

    initialize(): void {
        this.camera.translateZ(2.5);
        this.camera.translateY(1.1);
        this.camera.lookAt(0, 0, 0);

        this.initializeLights();
        this.initializeEvents();

        this.scene.add(this.aquarium.mesh);

        this.timestamp = performance.now();
        this.renderer.setAnimationLoop(this.renderLoop.bind(this));
    }

    resize(width: number, height: number): void {
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }
}

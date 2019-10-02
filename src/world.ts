import {WebGLRenderer, Scene, PerspectiveCamera, Color, Vector3, Light, AmbientLight} from "three";
import {Aquarium} from "./aquarium";
import {Fish} from "./fish";

export class World {
    renderer: WebGLRenderer;
    scene: Scene = new Scene();
    camera = new PerspectiveCamera();
    light = new Light(0xffffff);
    ambient = new AmbientLight(0xffffff);

    private timestamp: DOMHighResTimeStamp = 0;
    private aquarium = new Aquarium();

    get canvas() {
        return this.renderer.domElement;
    }

    constructor() {
        this.renderer = new WebGLRenderer({
            antialias: true,
            alpha: false
        });

        // this.scene.background = new Color(0x020210);
        this.scene.background = new Color(0xffffff);

        this.initialize();
    }

    private renderLoop(newTimestamp: DOMHighResTimeStamp) {
        const elapsed = newTimestamp - this.timestamp;
        this.timestamp = newTimestamp;

        this.aquarium.update(elapsed);

        this.renderer.render(this.scene, this.camera)
    }

    onClick(event: MouseEvent) {
        const fish = new Fish(this.aquarium);
        const rand = (delta: number) => Math.random() * delta - delta * 0.5;
        fish.movement = new Vector3(rand(0.5), rand(0.5), rand(0.5));
        fish.position.set(rand(1.75), rand(0.75), rand(0.75));
        this.aquarium.addFish(fish);
        this.scene.add(fish.mesh);
    }

    initializeLights() {
        this.light.translateZ(-3);
        this.light.translateY(0.5);
        this.light.lookAt(0, 0, 0);
        this.light.intensity = 10;

        this.ambient.intensity = 1;
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

        this.scene.add(this.light);
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

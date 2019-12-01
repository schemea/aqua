// import {AmbientLight, Color, PerspectiveCamera, Scene, SpotLight, Vector3, WebGLRenderer} from "three";
import { Aquarium } from "./aquarium";
import { Renderer } from "@webgl/renderer";
import { PerspectiveCamera } from "@webgl/cameras/perspective";
import { Group } from "@webgl/group";
import { Vector3 } from "@webgl/vector";

export class World {
    renderer: Renderer;
    camera: PerspectiveCamera;
    scene: Group;
    aquarium: Aquarium;
    private timestamp: DOMHighResTimeStamp = 0;

    constructor() {
        this.renderer = new Renderer(document.body);
        this.camera = new PerspectiveCamera(50, innerWidth / innerHeight, 0.0001, 1000);

        this.aquarium = new Aquarium(this);
        this.scene = new Group(this.context);

        // this.scene.background = new Color(0x020210);
        // this.scene.background = new Color(0xdddddd);

        this.initialize();
    }

    get canvas() { return this.renderer.canvas; }

    get context() { return this.renderer.context; }

    onClick(event: MouseEvent) {
        // Object.assign(window, {
        //     Vector,
        //     Vector3,
        //     camera: this.camera,
        //     aquarium: this.aquarium
        // });
        // const projection = Vector.projectMouse(event, this.camera, -this.camera.position.z);
        // console.log(projection);
        // const rand = (delta: number) => Math.random() * 2 * delta - delta;
        // fish.movement = Vector.random().multiplyScalar(fish.speed + rand(0.05));
        // fish.position.copy(new Vector3(0, 0, 0));
        // this.aquarium.addFish(fish);

        // const fish = new Fish(this);
        // this.scene.addMesh(fish.mesh);
        const fish = this.aquarium.addFish(new Vector3(0, 0, 0));
        console.log("click");
    }

    initializeLights() {
        // this.light.position.set(0, this.aquarium.volume.y * 1.2, 0);
        // this.light.lookAt(0, 0, 0);
        // this.light.intensity = 1.5;
        // this.light.castShadow = true;
        //
        // this.ambient.intensity = 0.5;
        //
        // this.scene.add(this.light);
        // this.scene.add(this.ambient);
    }

    initializeEvents() {
        document.addEventListener("click", this.onClick.bind(this));
    }

    initialize(): void {
        this.renderer.enableDefaultFeatures();
        // this.context.enable(this.context.CULL_FACE);
        // this.context.cullFace(this.context.BACK);

        this.camera.position.z = 2.5;
        this.camera.position.y = 1.1;
        this.camera.lookAt(new Vector3(0, 0, 0));

        this.camera.rotateX(-25);
        this.camera.updateTransformMatrix();

        this.initializeLights();
        this.initializeEvents();

        this.scene.addGroup(this.aquarium.meshes);

        this.timestamp = performance.now();
        this.renderer.setRenderLoop(this.renderLoop.bind(this));

        this.resize(innerWidth, innerHeight);
    }

    resize(width: number, height: number): void {
        this.renderer.resize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.camera.updateViewProjectionMatrix();
    }

    private renderLoop(newTimestamp: DOMHighResTimeStamp) {
        const elapsed = newTimestamp - this.timestamp;
        this.timestamp = newTimestamp;
        this.aquarium.meshes.rotateY(0.1);
        this.aquarium.updateTransformMatrix();

        // this.aquarium.update(elapsed);

        this.renderer.drawGroup(this.scene, this.camera.viewProjection);
        // this.renderer.drawGroup(this.aquarium.meshes, this.camera.viewProjection);
    }
}

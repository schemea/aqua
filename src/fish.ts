import { Element3D } from "./element";
import { Direction } from "./direction";
import { Vector3 } from "@webgl/vector";
import { BoxGeometry } from "@webgl/geometries/box";
import { World } from "./world";
import { BasicMaterial } from "@webgl/materials";
import { Color } from "@webgl/models/color";
import { Mesh } from "@webgl/models/mesh";

export class Fish extends Element3D {
    following?: Fish;
    speed = 0.3;
    oldPosition!: Vector3;
    mesh: Mesh;

    constructor(public world: World) {
        super();

        this.volume    = new Vector3(0.1, 0.05, 0.05);
        const geometry = new BoxGeometry(world.context, this.volume.x, this.volume.y, this.volume.z);
        const color    = new Color(0xf05050);
        // const color    = new Color(0xffffff, 0.5);
        const material = new BasicMaterial(color);
        // material.emissive = color;
        // material.emissiveIntensity = 0.05;
        this.mesh = new Mesh(geometry, material);
    }

    get aquarium() {return this.world.aquarium;}

    update(delta: number) {
        this.oldPosition = this.position.clone();
        const maxEdge    = Math.max(this.volume.x, this.volume.y, this.volume.z);

        /** detection radius, relative to fish size */

        if (this.following) {
            if (this.position.distance(this.following.position) > maxEdge * 1.1) {
                this.movement = this.following.movement;
                // this.movement = Vector.normalize(Vector.relativeTo(this.position, this.following.position));
                this.movement = this.following.position.from(this.position).normalized();
                this.movement = this.movement.multiply(this.speed);
            }
        } else {
            this.aquarium.fishes.forEach(fish => {
                if (fish === this)
                    return;

                const d = this.position.distance(fish.position);

                if (d < maxEdge * 1.2) {
                    this.movement = fish.movement;
                }
            })
        }

        super.update(delta);

        const direction = this.aquarium.contains(this);
        if (direction !== Direction.NONE && this.movement) {
            this.position.assign(this.oldPosition);
            switch (direction) {
                case Direction.LEFT:
                case Direction.RIGHT:
                    this.movement.x = this.movement.x * -1;
                    break;
                case Direction.TOP:
                case Direction.BOTTOM:
                    this.movement.y = this.movement.y * -1;
                    break;
                case Direction.BACK:
                case Direction.FRONT:
                    this.movement.z = this.movement.z * -1;
                    break;
            }
        }
    }

    updateTransformMatrix(): void {
        this.mesh.position = this.position;
        this.mesh.updateTransformMatrix();
    }
}

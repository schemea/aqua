import {Element3D} from "./element";
import {BoxBufferGeometry, Mesh, MeshPhysicalMaterial, Vector3} from "three";
import {Aquarium} from "./aquarium";
import {Glass} from "./glass";
import {Vector} from "./math";

export class Fish extends Element3D {
    following?: Fish;
    speed = 0.3;

    constructor(public aquarium: Aquarium) {
        super();
        this.volume = new Vector3(0.15, 0.1, 0.1);
        const geometry = new BoxBufferGeometry(this.volume.x, this.volume.y, this.volume.z);
        const material = new MeshPhysicalMaterial({
            color: 0x0000ff
        });
        this.mesh = new Mesh(geometry);
    }

    update(delta: number) {
        const position = this.position.clone();
            const maxEdge = Math.max(this.volume.x, this.volume.y, this.volume.z);
        if (this.following) {
            if (Vector.distanceTo(position, this.following.position) > maxEdge * 1.1) {
                this.movement = Vector.normalize(Vector.relativeTo(position, this.following.position));
                this.movement.multiplyScalar(this.speed);
            }
        } else {

            this.aquarium.fishes.forEach(fish => {
                if (fish === this)
                    return;

                const d = Vector.distanceTo(position, fish.position);
                let following = fish.following;

                if (d < maxEdge * 2.5) {
                    while (following) {
                        if (following === this)
                            return;
                        else
                            following = following.following;
                    }
                    this.following = fish;
                }
            })
        }

        super.update(delta);

        const exceedsGlass = this.aquarium.exceedsGlass(this);
        if (exceedsGlass !== Glass.NONE && this.movement) {
            this.position.copy(position);
            switch (exceedsGlass) {
                case Glass.LEFT:
                case Glass.RIGHT:
                    this.movement.setX(this.movement.x * -1);
                    break;
                case Glass.TOP:
                case Glass.BOTTOM:
                    this.movement.setY(this.movement.y * -1);
                    break;
                case Glass.BACK:
                case Glass.FRONT:
                    this.movement.setZ(this.movement.z * -1);
                    break;
            }
        }
    }
}

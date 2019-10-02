import {Mesh, Vector3} from "three";

export class Element3D {
    volume!: Vector3;

    get position() { return this.mesh.position; }

    get x() { return this.position.x; }

    get y() { return this.position.y; }

    get z() { return this.position.z; }

    set x(value: number) { this.position.setX(value); }

    set y(value: number) { this.position.setY(value); }

    set z(value: number) { this.position.setZ(value); }

    update(delta: DOMHighResTimeStamp) {
        const factor = delta / 1000;

        if (this.movement) {
            this.x += this.movement.x * factor;
            this.y += this.movement.y * factor;
            this.z += this.movement.z * factor;
        }
    }

    movement?: Vector3;
    mesh!: Mesh;
}

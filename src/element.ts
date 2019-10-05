import {Mesh, Vector3} from "three";
import {Bounds} from "./bounds";

export class Element3D {
    volume!: Vector3;

    get position() { return this.mesh.position; }

    get x() { return this.position.x; }

    get y() { return this.position.y; }

    get z() { return this.position.z; }

    set x(value: number) { this.position.setX(value); }

    set y(value: number) { this.position.setY(value); }

    set z(value: number) { this.position.setZ(value); }

    get bounds() {
        const width = this.volume.x;
        const height = this.volume.y;
        const depth = this.volume.z;
        const x = this.x - width / 2;
        const y = this.y - height / 2;
        const z = this.z - depth / 2;

        return new Bounds(x, y, z, width, height, depth);
    }

    update(delta: DOMHighResTimeStamp) {
        const factor = delta / 1000;

        if (this.movement) {
            this.x += this.movement.x * factor;
            this.y += this.movement.y * factor;
            this.z += this.movement.z * factor;
        }
    }

    intersect(other: Element3D, minDistance?: number): Axe {
        const bounds = this.bounds;
        const oBounds = other.bounds;

        if(minDistance) {
            oBounds.x -= minDistance;
            oBounds.y -= minDistance;
            oBounds.z -= minDistance;
            oBounds.width += minDistance * 2;
            oBounds.height += minDistance * 2;
            oBounds.depth += minDistance * 2;
        }

        if (bounds.left < oBounds.right && bounds.right > oBounds.left)
            return Axe.X;
        else if (bounds.bottom < oBounds.top && bounds.top > oBounds.bottom)
            return Axe.Y;
        else if (bounds.back < oBounds.front && bounds.front > oBounds.back)
            return Axe.Z;
        else
            return Axe.NONE;
    }

    movement?: Vector3;
    mesh!: Mesh;
}

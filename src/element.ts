import { Bounds } from "./bounds";
import { Direction } from "./direction";
import { Vector3 } from "@webgl/vector";
import { SharedRef } from "./shared";

interface BoundsLike {
    left: number;
    right: number;
    bottom: number;
    top: number;
    back: number;
    front: number;
}

export class Element3D extends SharedRef {
    volume!: Vector3;
    movement?: Vector3;
    position = new Vector3();

    get x() { return this.position.x; }

    set x(value: number) { this.position.x = value; }

    get y() { return this.position.y; }

    set y(value: number) { this.position.y = value; }

    get z() { return this.position.z; }

    set z(value: number) { this.position.z = value; }

    get bounds() {
        const width  = this.volume.x;
        const height = this.volume.y;
        const depth  = this.volume.z;
        const x      = this.x - width / 2;
        const y      = this.y - height / 2;
        const z      = this.z - depth / 2;

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
        const bounds  = this.bounds;
        const oBounds = other.bounds;

        if (minDistance) {
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

    contains(element: BoundsLike | { bounds: BoundsLike }): Direction {
        if ("bounds" in element && !("back" in element))
            element = element.bounds;

        const bounds = this.bounds;
        if (element.left < bounds.left)
            return Direction.LEFT;
        else if (element.right > bounds.right)
            return Direction.RIGHT;
        else if (element.bottom < bounds.bottom)
            return Direction.BOTTOM;
        else if (element.top > bounds.top)
            return Direction.TOP;
        else if (element.back < bounds.back)
            return Direction.BACK;
        else if (element.front > bounds.front)
            return Direction.FRONT;
        else
            return Direction.NONE;
    }

    updateTransformMatrix(): void {
        debugger;
        throw "not implemented";
    }
}

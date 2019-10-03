import {Vector3} from "three";
import {MaterialHandler} from "three/examples/jsm/loaders/obj2/shared/MaterialHandler";

export namespace Vector {
    export function relativeTo(origin: Vector3, target: Vector3): Vector3 {
        const x = target.x - origin.x;
        const y = target.y - origin.y;
        const z = target.z - origin.z;

        return new Vector3(x, y, z);
    }

    export function distanceTo(origin: Vector3, target: Vector3) {
        return magnitude(relativeTo(origin, target));
    }

    export function magnitude(vector: Vector3) {
        const xy = Math.sqrt(vector.x ** 2 + vector.y ** 2);
        return Math.sqrt(xy ** 2 + vector.z ** 2);
    }

    export function normalize(vector: Vector3): Vector3 {
        const magnitude = Vector.magnitude(vector);
        return new Vector3(vector.x / magnitude, vector.y / magnitude, vector.z / magnitude);
    }

    export function fromSpherical(r: number, theta: number, phi: number) {
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta)

        return new Vector3(x, y, z);
    }

    export function toSpherical(vector: Vector3): {r: number, phi: number, theta: number} {
        const r = Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
        return {
            r,
            phi: Math.atan(vector.y/vector.x),
            theta : Math.acos(vector.z / r)
        }
    }

    export function random() {
        return Vector.fromSpherical(1, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
    }
}


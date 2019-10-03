import {Camera, PerspectiveCamera, Quaternion, Vector2, Vector3} from "three";
import {MaterialHandler} from "three/examples/jsm/loaders/obj2/shared/MaterialHandler";

export namespace Vector {
    export function relativeTo(origin: Vector3, target: Vector3): Vector3 {
        const x = target.x - origin.x;
        const y = target.y - origin.y;
        const z = target.z - origin.z;

        return new Vector3(x, y, z);
    }

    export function distanceTo(origin: Vector3, target: Vector3) {
        return norm(relativeTo(origin, target));
    }

    export function norm(vector: Vector3) {
        const xy = Math.sqrt(vector.x ** 2 + vector.y ** 2);
        return Math.sqrt(xy ** 2 + vector.z ** 2);
    }

    export function normalize(vector: Vector3): Vector3 {
        const magnitude = Vector.norm(vector);
        return new Vector3(vector.x / magnitude, vector.y / magnitude, vector.z / magnitude);
    }

    export function fromSpherical(r: number, theta: number, phi: number) {
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta)

        return new Vector3(x, y, z);
    }

    export function toSpherical(vector: Vector3): { r: number, phi: number, theta: number } {
        const r = Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
        return {
            r,
            phi: Math.atan(vector.y / vector.x),
            theta: Math.acos(vector.z / r)
        }
    }

    export function random() {
        return Vector.fromSpherical(1, Math.random() * 2 * Math.PI, Math.random() * 2 * Math.PI);
    }

    export function getLookAt(obj: { quaternion: Quaternion }) {
        const lookAt = new Vector3(0, 0, -1);
        lookAt.applyQuaternion(obj.quaternion);
        return lookAt;
    }

    export function rotateY(vector: Vector3, angle: number) {
        const norm = Math.sqrt(vector.z ** 2 + vector.y ** 2);
        const org = Math.atan(vector.x / vector.z);
        angle += org;
        vector.setX(norm * Math.sin(angle));
        vector.setY(norm * Math.cos(angle));
        return vector;
    }

    export function projectMouse(position: { x: number, y: number }, camera: PerspectiveCamera, z: number) {
        const fov = camera.fov * Math.PI / 180;

        const d = 1 / Math.tan(fov / 2);
        const x = position.x / innerWidth - 0.5;
        const y = -(position.y / innerHeight - 0.5);
        const xalpha = Math.atan(x / d);
        const yalpha = Math.atan(y / d);

        console.log(fov / 2, yalpha);
        const lookAt = getLookAt(camera);
        // lookAt.phi += xalpha;
        // lookAt.theta += yalpha;
        rotateY(lookAt, -0.5);
        // rotateX(lookAt, yalpha);
        const sphericalLookAt = Vector.toSpherical(lookAt);
        return Vector.fromSpherical(z / Math.cos(sphericalLookAt.phi), sphericalLookAt.theta, sphericalLookAt.phi);
    }
}


import {PerspectiveCamera, Quaternion, Vector3} from "three";
import {Matrix3} from "./matrix";


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
        const z = r * Math.cos(theta);

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

    function rotate(vector: Vector3, angle: number, axis: Vector3) {
        const mat = new Matrix3();
        mat.rotate(angle, axis);
        mat.transform(vector);
        return vector;
    }

    export function rotateX(vector: Vector3, angle: number) {
        const y = vector.y;
        const z = vector.z;
        vector.setY(y * Math.cos(angle) - z * Math.sin(angle));
        vector.setZ(y * Math.sin(angle) + z * Math.cos(angle));
        return vector;
    }

    export function rotateY(vector: Vector3, angle: number) {
        const x = vector.x;
        const z = vector.z;
        vector.setX(x * Math.cos(angle) + z * Math.sin(angle));
        vector.setZ(-x * Math.sin(angle) + z * Math.cos(angle));
        return vector;
    }

    export function rotateZ(vector: Vector3, angle: number) {
        const x = vector.x;
        const y = vector.y;
        vector.setX(x * Math.cos(angle) - y * Math.sin(angle));
        vector.setY(x * Math.sin(angle) + y * Math.cos(angle));
        return vector;
    }

    export function projectMouse(position: { x: number, y: number }, camera: PerspectiveCamera, z: number) {
        const fov = camera.fov * Math.PI / 180;
        const d = 1 / Math.tan(fov / 2);
        const x = position.x * 2 / innerWidth - 1;
        const y = position.y * 2 / innerHeight - 1;
        const xalpha = Math.atan(x / d);
        const yalpha = Math.atan(y / d);

        const lookAt = getLookAt(camera);
        // rotateX(lookAt, yalpha);
        const test = rotateX(lookAt.clone(), 1);
        const three = lookAt.applyAxisAngle(new Vector3(1, 0, 0), 1);
        console.log("lookat", lookAt);
        const sphericalLookAt = Vector.toSpherical(lookAt);
        console.log(sphericalLookAt);
        console.log("z", z);
        const r = z / Math.cos(90 - sphericalLookAt.phi);
        console.log("r", r);
        return Vector.fromSpherical(r, sphericalLookAt.theta, sphericalLookAt.phi);
    }
}


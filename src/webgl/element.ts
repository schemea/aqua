import { Vector3 } from "@webgl/vector";
import { SharedRef } from "../shared";
import { Transform } from "./transform";
import { Matrix4 } from "./matrix/matrix4";
import { SquareMatrix } from "./matrix/square";
import { Matrix } from "./matrix";

export class WebGLElement extends SharedRef {
    position = new Vector3();
    rotation = new Transform();

    transform = new Transform();

    /** HOOKS */

    beforeDraw() { }

    afterDraw() { }

    /** HOOKS END */

    lookAt(vector: Vector3): void {
        vector.from(this.position);
        const v = this.position.cross(vector);
        const c = this.position.dot(vector);

        if (c === 1) {
            this.rotation.reset();
            this.rotation.scale(-1);
            return;
        }

        const vx = SquareMatrix.fromArray([
            0, -v.z, v.y,
            v.z, 0, -v.x,
            -v.y, v.x, 0,
        ]);

        const rot  = SquareMatrix.add(SquareMatrix.identity(3), vx, vx.multiply(vx).multiply(1 / (1 + c)));
        const mat4 = new Matrix4();
        rot.forEach((value, i, j) => mat4.set(i, j, value));
        this.rotation.set(mat4);
    }

    updateTransformMatrix(): void {
        this.transform.reset();
        this.transform.translate(this.position.coordinates);
        this.transform.push(this.rotation);
    }

    rotate(theta: number, axis: Vector3): void {
        this.rotation.rotate(theta * Math.PI / 180, axis);
    }

    rotateX(theta: number): void { this.rotate(theta, new Vector3(1, 0, 0)); }

    rotateY(theta: number): void { this.rotate(theta, new Vector3(0, 1, 0)); }

    rotateZ(theta: number): void { this.rotate(theta, new Vector3(0, 0, 1)); }
}

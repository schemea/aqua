import {Vector3} from "@webgl/vector";
import {Matrix, Matrix4} from "@webgl/matrix";

export class WebGLElement {
    position = new Vector3();
    rotation = new Matrix4();

    transform = Matrix.identity(4) as Matrix4;

    updateTransformMatrix(): void {
        this.transform = Matrix.identity(4);
        this.transform = this.transform.translate(this.position.coordinates);
        this.transform = this.transform.multiply(this.rotation);
    }

    rotate(theta: number, axis: Vector3): void {
        this.rotation = this.rotation.rotate(theta * Math.PI / 180, axis);
    }

    rotateX(theta: number): void { this.rotate(theta, new Vector3(1, 0, 0)); }

    rotateY(theta: number): void { this.rotate(theta, new Vector3(0, 1, 0)); }

    rotateZ(theta: number): void { this.rotate(theta, new Vector3(0, 0, 1)); }
}

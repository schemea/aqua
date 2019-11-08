import {Camera} from "@webgl/cameras/index";
import {Matrix, Matrix4} from "@webgl/matrix";

export class PerspectiveCamera extends Camera {
    projection: Matrix4;

    constructor(public fov: number, public aspect: number, public near: number, public far: number) {
        super();
    }

    updateProjectionMatrix(): void {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * this.fov * Math.PI / 180);
        const rInv = 1.0 / (this.near - this.far);
        this.projection = Matrix.fromArray([
            [f / this.aspect, 0, 0, 0],
            [0, f, 0, 0],
            [0, 0, (this.near + this.far) * rInv, -1],
            [0, 0, this.near * this.far * rInv * 2, 0]
        ]) as Matrix4;
    }
}

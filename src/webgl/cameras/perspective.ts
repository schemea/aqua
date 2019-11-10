import {Camera} from "@webgl/cameras/index";
import {Matrix4} from "@webgl/matrix";

export class PerspectiveCamera extends Camera {
    projection: Matrix4;

    constructor(public fov: number, public aspect: number, public near: number, public far: number) {
        super();

        this.updateProjectionMatrix();
        this.updateWorldMatrix();
    }

    updateProjectionMatrix(): void {
        const f = Math.tan(Math.PI * 0.5 - 0.5 * this.fov * Math.PI / 180);
        const rInv = 1.0 / (this.near - this.far);
        this.projection = Matrix4.fromArray([
            f / this.aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (this.near + this.far) * rInv, this.near * this.far * rInv * 2,
            0, 0, -1, 0
        ]);
    }
}

import {Matrix, Matrix4} from "@webgl/matrix";
import {WebGLElement} from "@webgl/element";
import {Vector2, Vector3} from "@webgl/vector";

export class Camera extends WebGLElement {
    projection: Matrix4;
    view: Matrix4;
    viewProjection: Matrix4;

    constructor() {
        super();

        this.view = Matrix4.identity(4);
        this.viewProjection = Matrix4.identity(4);
        this.transform = Matrix4.identity(4);
        this.projection = Matrix4.identity(4);
    }

    rotate(theta: number, axis: Vector3): void {
        super.rotate(theta, axis);
    }

    updateTransformMatrix(): void {
        // this.transform = this.view.inverse();
        super.updateTransformMatrix();
        this.view = this.transform.inverse();
    }

    updateProjectionMatrix(): void { this.projection = Matrix4.identity(4); }

    updateViewProjectionMatrix(): void { this.viewProjection = this.projection.multiply(this.view); }

    unproject(vector: Vector2): Vector3 {
        const viewProjection = this.view.multiply(this.projection);
        console.log(viewProjection.toString());
        let mat = Matrix.create(4, 1);
        mat.data = [...vector.coordinates, 1, 1];
        mat = Matrix.multiply(this.viewProjection.inverse(), mat);
        // mat = Matrix.transpose(mat);

        console.log("mat", mat);
        const vec = new Vector3();
        console.log("z", this.position.z);
        const w = 1 / mat.data[3];
        vec.coordinates = <[number, number, number]>mat.data.slice(0, vec.dimension).map(value => value);
        return vec;
    }
}

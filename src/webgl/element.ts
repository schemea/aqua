import {Vector3} from "@webgl/vector";
import {Matrix, Matrix4} from "@webgl/matrix";

export class WebGLElement {
    position = new Vector3();
    rotate = new Vector3();

    transform = Matrix.identity(4) as Matrix4;

    updateTransformMatrix(): void {
        this.transform = Matrix.identity(4);
        this.transform = this.transform.translate(this.position.coordinates);
        this.rotate.coordinates.forEach((value, index) => {
            const axis = new Vector3();
            axis.coordinates[index] = 1;
            this.transform = this.transform.rotate(value * Math.PI / 180, axis);
        });
    }
}

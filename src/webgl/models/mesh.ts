import {Geometry} from "@webgl/geometries";
import {Vector3} from "@webgl/vector";
import {Material} from "@webgl/materials";
import {Matrix, Matrix4} from "@webgl/matrix";

export class Mesh {
    position = new Vector3();
    rotate = new Vector3();

    transform = Matrix.identity(4) as Matrix4;

    constructor(public geometry: Geometry, public material: Material) { }

    updateTransformMatrix(): void {
        this.transform = <Matrix4>Matrix.identity(4);
        this.transform.translate(this.position.coordinates);
        this.rotate.coordinates.forEach((value, index) => {
            const axis = new Vector3();
            axis.coordinates[index] = 1;
            this.transform.rotate(value * Math.PI / 180, axis);
        });
    }
}

import { Matrix, Matrix4 } from "../transforms/matrix";
import { WebGLElement } from "@webgl/element";
import { Vector2, Vector3 } from "@webgl/vector";

export class Camera extends WebGLElement {
    projection: Matrix4;
    view: Matrix4;
    viewProjection: Matrix4;

    constructor() {
        super();

        this.view           = Matrix4.identity(4);
        this.viewProjection = Matrix4.identity(4);
        this.transform      = Matrix4.identity(4);
        this.projection     = Matrix4.identity(4);

        (window as any).camera = this;
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

    unproject(spos: Vector2): Vector3 {
        // const viewProjection = this.view.multiply(this.projection);
        // console.log(viewProjection.toString());
        // let mat = Matrix.create(4, 1);
        // mat.data = [...vector.coordinates, 1, 1];
        // mat = Matrix.multiply(this.viewProjection.inverse(), mat);
        // // mat = Matrix.transpose(mat);
        //
        // console.log("mat", mat);
        // const vec = new Vector3();
        // console.log("z", this.position.z);
        // const w = 1 / mat.data[3];
        // vec.coordinates = <[number, number, number]>mat.data.slice(0, vec.dimension).map(value => value);
        // return vec;

        // const unprojection = this.view.inverse().multiply(this.projection.inverse());
        // const mat4         = new Matrix(1, 4);
        //
        // mat4.data = [ vector.x, vector.y, 0, 1 ];
        //
        // const q   = mat4.multiply(unprojection);
        // const vec = new Vector3();
        // // debugger;
        //
        // vec.coordinates = q.data.slice(0, 3).map(value => value / q.data[3]) as [ number, number, number ];
        let vector = new Vector3(...spos.coordinates, 1);
        vector.x *= 2 / innerWidth;
        vector.y *= 2 / innerHeight;
        vector.x -= 1;
        vector.y -= 1;
        vector.y *= -1;

        let unprojection = this.view.inverse().multiply(this.projection.inverse());
        let vec4         = new Matrix(4, 1);

        vec4.data = [ vector.x, vector.y, vector.z, 1 ];

        // vector = unprojection.transform(vector);
        vec4.data          = unprojection.multiply(vec4).data;
        vector.coordinates = vec4.data.slice(0, 3).map(value => value / 1) as [ number, number, number ];
        // vector.z *= 0.25;

        console.log("w", vec4.data[3], "     ", vector.coordinates.map(value => Math.round(value * 100) / 100));

        console.log("projected", this.viewProjection.transform(vector).coordinates);

        return vector;
    }
}

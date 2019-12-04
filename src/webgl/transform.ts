import { SquareMatrix } from "./matrix/square";
import { Matrix } from "./matrix";
import { Vector3 } from "./vector";
import { Matrix4 } from "./matrix/matrix4";
import { getArrayFromArgs } from "./utils";

export class Transform {
    stash: Matrix4[] = [];

    // private matrix = new SquareMatrix(4);

    constructor(private matrix = new Matrix4()) { }

    static merge(curr: Matrix4, next: Matrix4) { return curr.multiply(next); }

    push(m: Matrix4): void;
    push(m: Transform): void;
    push(m) {
        if ("matrix" in m) {
            m = m.matrix;
        }
        this.matrix = Transform.merge(this.matrix, m);
    }

    save() { this.stash.push(this.matrix); }

    restore() { this.matrix = this.stash.pop(); }

    translate(args: number[]);
    translate(...args: number[]);
    translate(...args) {
        args = getArrayFromArgs(args);
        this.push(Matrix4.translate(...args));
    }

    translateX(x: number) { this.translate(x, 0, 0); }

    translateY(y: number) { this.translate(0, y, 0); }

    translateZ(z: number) { this.translate(0, 0, z); }

    scale(...args: number[]) { this.push(SquareMatrix.scale(...args) as Matrix4); }

    scaleX(x: number) { this.scale(x, 1, 1); }

    scaleY(y: number) { this.scale(1, y, 1); }

    scaleZ(z: number) { this.scale(1, 1, z); }

    rotate(theta: number, axis: Vector3) { this.push(Matrix4.rotate(theta, axis)); }

    rotateX(theta: number) { this.rotate(theta, new Vector3(1, 0, 0)); }

    rotateY(theta: number) { this.rotate(theta, new Vector3(0, 1, 0)); }

    rotateZ(theta: number) { this.rotate(theta, new Vector3(0, 0, 1)); }

    reset() { this.matrix = Matrix4.identity(); }

    apply(vector: Vector3): Vector3 {
        let vec4  = new Matrix(4, 1);
        vec4.data = [ vector.x, vector.y, vector.z, 1 ];

        vec4 = this.matrix.multiply(vec4);

        return new Vector3(...vec4.data.slice(0, 3));
    }

    set(matrix: Matrix4) { this.matrix = matrix; }

    get() { return this.matrix; }

    invert() { this.matrix = this.matrix.inverse(); }

    clone() { return new Transform(this.matrix.clone()); }
}

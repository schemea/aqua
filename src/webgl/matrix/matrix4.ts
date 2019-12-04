import { Vector3 } from "../vector";
import { Matrix } from "./index";
import { SquareMatrix } from "./square";
import { registerMatrix, vectorFromMatrix } from "./utils";

export class Matrix4 extends SquareMatrix<4> {
    constructor() {
        super(4);
    }

    static fromArray(data: number[]): Matrix4;
    static fromArray(data: number[][]): Matrix4;
    static fromArray(data: number[] | number[][]): Matrix4 {
        if (typeof data[0] === "number") {
            const mat: Matrix4 = Object.create(Matrix4.prototype);
            Object.defineProperties(mat, {
                data: {
                    value: data,
                    configurable: true,
                    writable: true,
                },
                dimensions: {
                    value: { m: 4, n: 4 },
                    writable: false,
                    configurable: true,
                },
            });
            return mat;
        } else {
            return Matrix.fromArray(data as number[][]) as Matrix4;
        }
    }

    static rotate(theta: number, axis: Vector3): Matrix4 {
        axis      = axis.normalized();
        const x   = axis.x;
        const y   = axis.y;
        const z   = axis.z;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        return Matrix4.fromArray([
            [ cos + x ** 2 * (1 - cos), x * y * (1 - cos) - z * sin, x * z * (1 - cos) + y * sin, 0 ],
            [ y * x * (1 - cos) + z * sin, cos + y ** 2 * (1 - cos), y * z * (1 - cos) - x * sin, 0 ],
            [ z * x * (1 - cos) - y * sin, z * y * (1 - cos) + x * sin, cos + z ** 2 * (1 - cos), 0 ],
            [ 0, 0, 0, 1 ],
        ]);
    }

    static rotateX(theta: number): Matrix4 { return Matrix4.rotate(theta, new Vector3(1, 0, 0)); }

    static rotateY(theta: number): Matrix4 { return Matrix4.rotate(theta, new Vector3(0, 1, 0)); }

    static rotateZ(theta: number): Matrix4 { return Matrix4.rotate(theta, new Vector3(0, 0, 1)); }

    transform(vec: Vector3): Vector3 {
        const r = Matrix.multiply(this, Matrix.fromVector(vec));
        return vectorFromMatrix(Vector3, r);
    }
}

export interface Matrix4 {
    multiply(scalar: number): Matrix4;

    multiply(matrix: Matrix4): Matrix4;

    multiply<P extends number>(matrix: Matrix<4, P>): Matrix<4, P>;

    inverse(): Matrix4;

    clone(): Matrix4;
}

export declare namespace Matrix4 {
    function translate(...args: number[]): Matrix4
    function translate<N extends number>(...args: number[]): SquareMatrix<N>
}

registerMatrix((m, n) => m === n && n === 4 && Matrix4.prototype);

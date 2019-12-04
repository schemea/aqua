import { Vector2, Vector3 } from "../vector";
import { Dimension, getMatrixPrototype, MatrixOperationError, setDiagonal } from "./utils";
// import { SquareMatrix } from "./square";
import { Matrix4 } from "./matrix4";


export class Matrix<M extends number = number, N extends number = M> {
    dimensions: Dimension<M, N>;
    data: number[] = [];

    constructor(m: M, n: N) {
        Matrix.initialize(this, m, n);
    }

    static initialize(mat: Matrix, m: number, n: number) {
        mat.data       = new Array(m * n);
        mat.dimensions = { m, n };
    }

    static create<T extends Matrix>(m: number, n: number, mat?: Matrix): T {
        if (!mat)
            mat = Object.create(getMatrixPrototype(m, n));
        Matrix.initialize(mat, m, n);
        return mat as T;
    }

    static fromVector(vector: Vector2): Matrix<3, 1>;
    static fromVector(vector: Vector3): Matrix<4, 1>;
    static fromVector(vector: Vector3 | Vector2): Matrix {
        return Matrix.transpose(Matrix.fromArray([ [ ...vector.coordinates, 1 ] ]));
    }

    static fromArray<M extends number = number, N extends number = number>(data: number[][]): Matrix<M, N>;
    static fromArray(data: number[][]): Matrix;
    static fromArray<M extends number = number, N extends number = number>(data: number[][]): any {
        const matrix = Matrix.create(data.length as M, data[0].length as N) as Matrix<M, N>;
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < data[0].length; ++j) {
                matrix.set(i, j, data[i][j]);
            }
        }
        return matrix;
    }

    static add<M extends number, N extends number>(...args: Matrix<M, N>[]): Matrix<M, N> {
        const m = args[0].dimensions.m;
        const n = args[0].dimensions.n;

        const r = Matrix.create(m, n) as Matrix<M, N>;
        for (let i = 0; i < m; ++i) {
            for (let j = 0; j < n; ++j) {
                const value = args.reduce((prev, curr) => prev + curr.get(i, j), 0);
                r.set(i, j, value);
            }
        }
        return r;
    }

    static transpose<M extends number, N extends number>(matrix: Matrix<M, N>);
    static transpose<M extends number, N extends number>(matrix: Matrix<M, N>) {
        const m          = matrix.dimensions.m;
        const n          = matrix.dimensions.n;
        const transposed = Matrix.create(n, m);

        for (let i = 0; i < m; ++i) {
            for (let j = 0; j < n; ++j) {
                transposed.set(j, i, matrix.get(i, j));
            }
        }

        return transposed;
    }

    static multiply<M extends number, N extends number, P extends number>(a: Matrix<M, N>, b: Matrix<N, P>): Matrix<M, P> {
        const m = a.dimensions.m;
        const n = a.dimensions.n;
        const p = b.dimensions.n;

        if (n !== b.dimensions.m)
            throw new MatrixOperationError("Matrix dimension does not match");
        const result = Matrix.create(m, p) as Matrix<M, P>;

        function computeCase(i: number, j: number): number {
            let value = 0;
            for (let k = 0; k < n; ++k) {
                value += a.get(i, k) * b.get(k, j);
            }
            return value;
        }

        for (let i = 0; i < m; ++i) {
            for (let j = 0; j < p; ++j) {
                result.set(i, j, computeCase(i, j));
            }
        }

        return result;
    }

    transpose() { return Matrix.transpose(this); }

    static removeRow<M extends number, N extends number>(mat: Matrix<M, N>, i) {
        const newMat: Matrix<number, N> = Object.create(getMatrixPrototype(mat.dimensions.m - 1, mat.dimensions.n));
        newMat.data                     = mat.data.splice(mat.dimensions.n * i, mat.dimensions.n);
        return newMat;
    }

    static removeColumn<M extends number, N extends number>(mat: Matrix<M, N>, j) {
        const newMat: Matrix<number, N> = Object.create(getMatrixPrototype(mat.dimensions.m, mat.dimensions.n - 1));
        newMat.data                     = mat.data.filter((value, index) => (index % mat.dimensions.n) === j);
        newMat.dimensions.m--;
        return newMat;
    }

    set(i: number, j: number, value: number): void {
        this.data[i * this.dimensions.n + j] = value;
    }

    get(i: number, j: number): number | undefined {
        return this.data[i * this.dimensions.n + j];
    }

    equals(other: Matrix) {
        const dimensions = this.dimensions;
        for (let i = 0; i < dimensions.m; ++i) {
            for (let j = 0; j < dimensions.n; ++j) {
                if (this.get(i, j) !== other.get(i, j))
                    return false;
            }
        }
        return true;
    }

    assign(matrix: Matrix<M, N>): void {
        this.data       = matrix.data;
        this.dimensions = matrix.dimensions;
    }

    copy(matrix: Matrix<M, N>): void {
        this.data       = [ ...matrix.data ];
        this.dimensions = { ...matrix.dimensions };
    }

    toString(): string {
        let data  = this.data.map(val => val.toFixed(1));
        const max = data.reduce((prev, curr) => Math.max(prev, curr.length), 0);
        data      = data.map(value => value.padStart(max + 1));
        for (let i = 0; i < this.dimensions.m; i++) {
            data[this.dimensions.n * (i + 1) - 1] += "\n";
        }
        return data.join(" ");
    }

    clone(): Matrix<M, N> {
        const newMatrix = Object.create(Object.getPrototypeOf(this));
        newMatrix.copy(this);
        return newMatrix;
    }

    forEach(fn: (value: number, i: number, j: number) => void) {
        const m = this.dimensions.m;
        const n = this.dimensions.n;
        for (let i = 0; i < m; ++i) {
            for (let j = 0; j < n; ++j) {
                fn(this.get(i, j), i, j);
            }
        }
    }

    multiply(scalar: number): Matrix<M, N>;
    multiply<P extends number>(matrix: Matrix<N, P>): Matrix<M, P>;
    multiply(arg: number | Matrix): Matrix {
        if (typeof arg === "number") {
            const mat = Matrix.create(this.dimensions.m, this.dimensions.n);
            mat.data  = this.data.map(value => value * arg);
            return mat;
        }
        return Matrix.multiply(this, arg);
    }

    round(digits: number = 2) {
        const mat = this.clone();
        const fac = 10 ** digits;
        mat.data  = mat.data.map(value => Math.round(value * fac) / fac);

        return mat;
    }
}

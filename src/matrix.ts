import {Vector2, Vector3} from "three";
import {Vector} from "./vector";

export class MatrixOperationError {
    constructor(public error: string) { }
}

interface Dimension<M extends number, N extends number> {
    m: M;
    n: N;
}

function setDiagonal<N extends number>(matrix: Matrix<N, N>, value: number) {
    for (let i = 0; i < matrix.dimensions.m; ++i) {
        matrix.set(i, i, value);
    }
}

function createUninitializedMatrix<M extends number, N extends number>(m: M, n: N, mat: Matrix<M, N> = Object.create(Matrix.prototype)) {
    mat.data = new Array(m);
    for (let i = 0; i < m; ++i) {
        mat.data[i] = new Array(n);
    }
    return mat;
}

export class Matrix<M extends number = number, N extends number = M> {
    data: number[][] = [];

    constructor(m: M, n: N) {
        this.data = new Array(m);
        for (let i = 0; i < m; ++i) {
            const row = this.data[i] = new Array(n);
            row.fill(0);
        }
    }

    get dimensions(): Dimension<M, N> {
        const first = this.data[0];
        return {
            m: this.data.length as M,
            n: (first ? first.length : 0) as N
        };
    }

    set(i: number, j: number, value: number): void {
        this.data[i][j] = value;
    }

    get(i: number, j: number): number | undefined {
        const row = this.data[i];
        return row ? row[j] : undefined;
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

    assign(matrix: Matrix<N, N>): void {
        this.data = matrix.data.map(row => [...row])
    }

    toString(): string {
        return this.data.map(row => row.map(value => value.toString().padStart(3, ' ')).join('')).join('\n');
    }

    clone(): Matrix<M, N> {
        const newMatrix = Object.create(Matrix.prototype);
        newMatrix.assign(this);
        return newMatrix;
    }

    static identity<N extends number>(n: N): Matrix<N, N> {
        const matrix = new Matrix(n, n);
        setDiagonal(matrix, 1);
        return matrix;
    }

    static fromVector<N extends number = number>(vector: Vector3 | Vector2, pad = 1): Matrix<N, 1> {
        let d = 0;
        if ("z" in vector)
            d = 3;
        else if (vector instanceof Vector2)
            d = 2;
        const matrix = createUninitializedMatrix<N, 1>(d + pad as N, 1);
        matrix.set(0, 0, vector.x);
        matrix.set(1, 0, vector.y);
        matrix.set(1, 0, vector.y);

        if ("z" in vector)
            matrix.set(2, 0, vector.z);

        for (let i = d; i < d + pad; ++i)
            matrix.set(i, 0, 1);

        return matrix;
    }

    static fromArray<M extends number = number, N extends number = number>(data: number[][]): Matrix<M, N> {
        const matrix = createUninitializedMatrix<M, N>(data.length as M, data[0].length as N);
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < data[0].length; ++j) {
                matrix.set(i, j, data[i][j]);
            }
        }
        return matrix;
    }

    static add<M extends number, N extends number, P extends number, Q extends number>(a: Matrix<M, N>, b: Matrix<P, Q>): Matrix<M, N> {
        const r = createUninitializedMatrix(a.dimensions.m, a.dimensions.n);
        for (let i = 0; i < a.dimensions.m; ++i) {
            for (let j = 0; j < a.dimensions.n; ++j) {
                const value = a.get(i, j) + b.get(i, j);
                r.set(i, j, value);
            }
        }
        return r;
    }

    static transpose<M extends number, N extends number>(matrix: Matrix<M, N>) {
        const m = matrix.dimensions.m;
        const n = matrix.dimensions.n;
        const transposed = createUninitializedMatrix(n, m);

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
        const result = createUninitializedMatrix(m, p);

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
}

export class SquareMatrix<N extends number> extends Matrix<N, N> {
    get size(): N { return this.data.length as N; }

    constructor(n: N) {
        super(n, n);
        setDiagonal(this, 1);
    }

    scale(...values: number[]) {
        const n = this.size;
        const m = new SquareMatrix(n);

        for (let i = 0; i < Math.min(values.length, n - 1); ++i) {
            m.set(i, i, values[i])
        }

        this.multiply(m);
    }

    translate(...values: number[]): void {
        const n = this.size;
        const m = new SquareMatrix(n);

        for (let i = 0; i < Math.min(values.length, n - 1); ++i) {
            m.set(i, n - 1, values[i])
        }

        this.multiply(m);
    }

    multiply(matrix: Matrix<N, N>) {
        const r = SquareMatrix.multiply(this, matrix);
        this.data = r.data;
    }
}

export class Matrix3 extends SquareMatrix<4> {

    constructor() {
        super(4);
    }

    rotate(theta: number, axis: Vector3) {
        axis = Vector.normalize(axis);
        const x = axis.x;
        const y = axis.y;
        const z = axis.z;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        this.multiply(Matrix3.fromArray([
            [cos + x ** 2 * (1 - cos), x * y * (1 - cos) - z * sin, x * z * (1 - cos) + y * sin, 0],
            [y * x * (1 - cos) + z * sin, cos + y ** 2 * (1 - cos), y * z * (1 - cos) - x * sin, 0],
            [z * x * (1 - cos) - y * sin, z * y * (1 - cos) + x * sin, cos + z ** 2 * (1 - cos), 0],
            [0, 0, 0, 1]
        ]));
    }

    rotateX(theta: number) {
        this.rotate(theta, new Vector3(1, 0, 0));
    }

    rotateY(theta: number) {
        this.rotate(theta, new Vector3(0, 1, 0));
    }

    rotateZ(theta: number) {
        this.rotate(theta, new Vector3(0, 0, 1));
    }

    translateX(x: number): void {
        this.translate(x, 0, 0);
    }

    translateY(y: number): void {
        this.translate(0, y, 0);
    }

    translateZ(z: number): void {
        this.translate(0, 0, z);
    }

    scaleX(x: number): void {
        this.scale(x, 1, 1);
    }

    scaleY(y: number): void {
        this.scale(1, y, 1);
    }

    scaleZ(z: number): void {
        this.scale(1, 1, z);
    }

    transform(vec: Vector3) {
        const vecMatrix = Matrix.fromVector(vec, 1);
        const r = Matrix.multiply(this, vecMatrix);
        return new Vector3(
            r.get(0, 0),
            r.get(1, 0),
            r.get(2, 0)
        )
    }
}

export interface Matrix3 {
    translate(x: number, y: number, z: number);

    scale(x: number, y: number, z: number);
}

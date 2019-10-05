import {Vector2, Vector3} from "three";

export class ErrorMatrix {
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
        const matrix = new Matrix<N, 1>(d + pad as N, 1);
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
        const matrix = new Matrix<M, N>(data.length as M, data[0].length as N);
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < data[0].length; ++j) {
                matrix.set(i, j, data[i][j]);
            }
        }
        return matrix;
    }

    static add<M extends number, N extends number, P extends number, Q extends number>(a: Matrix<M, N>, b: Matrix<P, Q>): Matrix<M, N> {
        const r = new Matrix(a.dimensions.m, a.dimensions.n);
        for (let i = 0; i < a.dimensions.m; ++i) {
            for (let j = 0; j < a.dimensions.n; ++j) {
                const value = a.get(i, j) + b.get(i, j);
                r.set(i, j, value);
            }
        }
        return r;
    }

    static multiply<M extends number, N extends number, P extends number>(a: Matrix<M, N>, b: Matrix<N, P>): Matrix<M, P> {
        const m = a.dimensions.m;
        const n = a.dimensions.n;
        const p = b.dimensions.n;

        if (n !== b.dimensions.m)
            throw new ErrorMatrix("Matrix dimension does not match");
        const result = new Matrix(m, p);

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
    get size(): number { return this.data.length; }

    constructor(n: N) {
        super(n, n);
        setDiagonal(this, 1);
    }

    translate(...values: number[]): void {
        const n = this.size;
        const m = new SquareMatrix(n);

        for (let i = 0; i < Math.min(values.length, n); ++i) {
            m.set(i, n - 1, values[i])
        }
        const r = Matrix3.multiply(this, m);

        this.data = r.data;
    }
}

export class Matrix3 extends SquareMatrix<4> {

    constructor() {
        super(4);
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
}

import { Matrix } from "./index";
import { registerMatrix, setDiagonal } from "./utils";
import { createMatrixView } from "./view";
import { Matrix4 } from "./matrix4";

export class SquareMatrix<N extends number = number> extends Matrix<N, N> {
    constructor(n: N) {
        super(n, n);
        this.data.fill(0);
        setDiagonal(this, 1);
    }

    get size(): N { return this.dimensions.n as N; }

    static fromArray<N extends number>(data: number[]): SquareMatrix<N>;
    static fromArray<N extends number>(data: number[][]): SquareMatrix<N>;
    static fromArray<N extends number>(data: number[] | number[][]): SquareMatrix<N> {
        if (typeof data[0] === "number") {
            const mat: SquareMatrix<N> = Object.create(SquareMatrix.prototype);
            const size                 = Math.sqrt(data.length);
            if (!Number.isInteger(size))
                throw "invalid array length";
            Object.defineProperties(mat, {
                data: {
                    value: data,
                    configurable: true,
                    writable: true,
                },
                dimensions: {
                    value: { m: size, n: size },
                    writable: false,
                    configurable: true,
                },
            });
            return mat;
        } else {
            return Matrix.fromArray(data as number[][]) as SquareMatrix<N>;
        }
    }

    determinant(): number {
        const _this = this;

        if (this.size === 1) {
            return this.get(0, 0);
        }

        function exclude(i: number) {
            const indices = [];
            for (let j = 0; j < _this.size; ++j) {
                if (j !== i)
                    indices.push(j);
            }

            return indices;
        }

        const rows = exclude(0);

        let det = 0;
        for (let i = 0; i < this.size; ++i) {
            const sign = i % 2 === 0 ? 1 : -1;
            const mat  = createMatrixView<SquareMatrix>(this, rows, exclude(i));
            det += sign * mat.determinant() * this.get(0, i);
        }

        return det;
    }

    cofactor(i, j): number {
        const exclude = (i: number) => {
            const indices = [];
            for (let j = 0; j < this.size; ++j) {
                if (j !== i)
                    indices.push(j);
            }

            return indices;
        };

        const det = createMatrixView<SquareMatrix>(this, exclude(i), exclude(j)).determinant();

        return (-1) ** (i + j) * det;
    }

    adjugate(): SquareMatrix<N> {
        const adjugate = Matrix.create<SquareMatrix<N>>(this.dimensions.m, this.dimensions.n);
        for (let i = 0; i < this.dimensions.m; i++) {
            for (let j = 0; j < this.dimensions.n; j++) {
                adjugate.set(i, j, this.cofactor(i, j));
            }
        }

        return adjugate;
    }

    inverse(): SquareMatrix<N> {
        const adj = this.adjugate().multiply(1 / this.determinant());
        return Matrix.transpose(adj) as SquareMatrix<N>;
    }

    static scale<N extends number = number>(...values: number[]): SquareMatrix<N> {
        const n = values.length + 1;
        const m = new SquareMatrix(n as N);

        for (let i = 0; i < Math.min(values.length, n - 1); ++i) {
            m.set(i, i, values[i])
        }

        return m;
    }

    static identity(n?: 4): Matrix4;
    static identity(n: number);
    static identity(n: number = 4) {
        const matrix = Matrix.create(n, n);
        for (let i = 0; i < matrix.data.length; i++) {
            matrix.data[i] = 0;
        }
        setDiagonal(matrix, 1);
        return matrix;
    }

    static translate<N extends number = number>(...values: number[]): SquareMatrix<N> {
        const n = values.length + 1;
        const m = SquareMatrix.identity(n);

        if (typeof values[0] === "object") {
            values = values[0];
        }

        for (let i = 0; i < Math.min(values.length, n - 1); ++i) {
            m.set(i, n - 1, values[i])
        }

        return m;
    }
}

export interface SquareMatrix<N extends number> {
    multiply(scalar: number): SquareMatrix<N>;

    multiply(matrix: SquareMatrix<N>): SquareMatrix<N>;

    multiply<P extends number>(matrix: Matrix<N, P>): Matrix<N, P>;

    clone(): SquareMatrix<N>;
}

registerMatrix((m, n) => m === n && SquareMatrix.prototype);

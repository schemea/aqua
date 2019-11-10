import {Vector, Vector2, Vector3} from "./vector";

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

type AutoMatrix<M extends number, N extends number> = Matrix<M, N> & ([N] extends [M] ?
    (N extends 3 ? Matrix4 : SquareMatrix<N>)
    : Matrix<M, N>);

function getMatrixPrototype<M extends number, N extends number>(m: M, n: N): AutoMatrix<M, N> {
    if (m as number !== n)
        return Matrix.prototype as AutoMatrix<M, N>;
    else if (m === 4)
        return Matrix4.prototype as AutoMatrix<M, N>;
    else
        return SquareMatrix.prototype as AutoMatrix<M, N>;
}

function vectorFromMatrix<T extends Vector, N extends number>(constructor: { new(...args: number[]): any }, matrix: Matrix<N, 1>): T {
    const vec = Vector.create(matrix.dimensions.m - 1);
    vec.coordinates = Matrix.transpose(matrix).data.slice(0, vec.dimension);
    return vec as T;
}

export class Matrix<M extends number = number, N extends number = M> {
    dimensions: Dimension<M, N>;
    data: number[] = [];

    constructor(m: M, n: N) {
        Matrix.initialize(this, m, n);
    }

    static initialize(mat: Matrix, m: number, n: number) {
        mat.data = new Array(m * n);
        mat.dimensions = {m, n};
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
        return Matrix.transpose(Matrix.fromArray([[...vector.coordinates, 1]]));
    }

    static fromArray<M extends number = number, N extends number = number>(data: number[][]): AutoMatrix<M, N>;
    static fromArray(data: number[][]): Matrix;
    static fromArray<M extends number = number, N extends number = number>(data: number[][]): any {
        const matrix = Matrix.create(data.length as M, data[0].length as N) as AutoMatrix<M, N>;
        for (let i = 0; i < data.length; ++i) {
            for (let j = 0; j < data[0].length; ++j) {
                matrix.set(i, j, data[i][j]);
            }
        }
        return matrix;
    }

    static add<M extends number, N extends number, P extends number, Q extends number>(a: Matrix<M, N>, b: Matrix<P, Q>): AutoMatrix<M, N> {
        const r = Matrix.create(a.dimensions.m, a.dimensions.n) as AutoMatrix<M, N>;
        for (let i = 0; i < a.dimensions.m; ++i) {
            for (let j = 0; j < a.dimensions.n; ++j) {
                const value = a.get(i, j) + b.get(i, j);
                r.set(i, j, value);
            }
        }
        return r;
    }

    static transpose<T extends SquareMatrix>(matrix: T): T;
    static transpose<M extends number, N extends number>(matrix: Matrix<M, N>);
    static transpose<M extends number, N extends number>(matrix: Matrix<M, N>) {
        const m = matrix.dimensions.m;
        const n = matrix.dimensions.n;
        const transposed = Matrix.create(n, m);

        for (let i = 0; i < m; ++i) {
            for (let j = 0; j < n; ++j) {
                transposed.set(j, i, matrix.get(i, j));
            }
        }

        return transposed;
    }

    static multiply<M extends number, N extends number, P extends number>(a: Matrix<M, N>, b: Matrix<N, P>): AutoMatrix<M, P> {
        const m = a.dimensions.m;
        const n = a.dimensions.n;
        const p = b.dimensions.n;

        if (n !== b.dimensions.m)
            throw new MatrixOperationError("Matrix dimension does not match");
        const result = Matrix.create(m, p) as AutoMatrix<M, P>;

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

    static identity(n: 4): Matrix4;
    static identity<N extends number>(n: N): SquareMatrix<N>;
    static identity(n: number) {
        const matrix = Matrix.create(n, n);
        for (let i = 0; i < matrix.data.length; i++) {
            matrix.data[i] = 0;
        }
        setDiagonal(matrix, 1);
        return matrix;
    }

    static removeRow<M extends number, N extends number>(mat: Matrix<M, N>, i) {
        const newMat: Matrix<number, N> = Object.create(getMatrixPrototype(mat.dimensions.m - 1, mat.dimensions.n));
        newMat.data = mat.data.splice(mat.dimensions.n * i, mat.dimensions.n);
        return newMat;
    }

    static removeColumn<M extends number, N extends number>(mat: Matrix<M, N>, j) {
        const newMat: Matrix<number, N> = Object.create(getMatrixPrototype(mat.dimensions.m, mat.dimensions.n - 1));
        newMat.data = mat.data.filter((value, index) => (index % mat.dimensions.n) === j);
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

    multiplyScalar(scalar: number) {
        this.forEach(((v, i, j) => this.set(i, j, v * scalar)));
    }

    assign(matrix: Matrix<M, N>): void {
        this.data = matrix.data;
        this.dimensions = matrix.dimensions;
    }

    copy(matrix: Matrix<M, N>): void {
        this.data = [...matrix.data];
        this.dimensions = {...matrix.dimensions};
    }

    toString(): string {
        let data = this.data.map(val => val.toString());
        const max = data.reduce((prev, curr) => Math.max(prev, curr.length), 0);
        data = data.map(value => value.padStart(max + 1));
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
}

export function createMatrixView<T extends Matrix = Matrix>(matrix: Matrix, rows: number[] = [], cols: number[] = []): T {
    const matrixPrototype = getMatrixPrototype(rows.length, cols.length);

    const name = matrixPrototype.constructor.name + "View";

    let constructor = module.exports[name];
    let prototype;

    if (constructor) {
        prototype = constructor.prototype;
    } else {
        prototype = Object.create(matrixPrototype, {
            copy: {
                value() {
                    const m = this.dimensions.m;
                    const n = this.dimensions.n;

                    const data = new Array(m);
                    for (let i = 0; i < m; ++i) {
                        data[i] = new Array(n);
                    }

                    this.forEach((value, i, j) => data[i][j] = value);
                    this.data = data;
                }
            },
            data: {
                get() {
                    throw new MatrixOperationError("Cannot access data member of MatrixView");
                },
                set(value) {
                    const get = Object.getOwnPropertyDescriptor(Matrix.prototype, "get");
                    const set = Object.getOwnPropertyDescriptor(Matrix.prototype, "set");
                    const dimensions = Object.getOwnPropertyDescriptor(Matrix.prototype, "dimensions");
                    Object.defineProperties(this, {
                        data: {value},
                        get,
                        set,
                        dimensions
                    });
                    delete this.matrix;
                    delete this.copy;
                    delete this.rows;
                    delete this.cols;
                }
                // get() {return this.matrix.data.filter((row, i) => this.rows.includes(i)).map(row => row.filter((cell, j) => this.cols.includes(j))); }
            },
            get: {
                value(i: number, j: number): number | undefined {
                    return this.matrix.get(this.rows[i], this.cols[j]);
                }
            },
            set: {
                // Copy on write
                value(i: number, j: number, value: number): void {
                    this.copy();
                    this.set(i, j, value);
                    // throw new MatrixOperationError("MatrixView is read only");
                    // (this.matrix as Matrix).set(this.rows[i], this.cols[j], value);
                }
            },
            dimensions: {
                get() {
                    return {
                        m: this.rows.length,
                        n: this.cols.length
                    }
                }
            }
        });

        if ("size" in matrixPrototype) {
            Object.defineProperty(prototype, "size", {
                get() {
                    return this.dimensions.m;
                }
            });
        }

        module.exports[name] = constructor = new Function(`return function ${name}(...args){ return createMatrixView(...args)}`)();
        constructor.prototype = prototype;
        prototype.constructor = constructor;
    }

    const view = Object.create(prototype, {
        matrix: {
            value: matrix,
            writable: false,
            configurable: true
        }
    });

    return Object.assign(view, {
        rows,
        cols
    });
}

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
            const size = Math.sqrt(data.length);
            if (!Number.isInteger(size))
                throw "invalid array length";
            Object.defineProperties(mat, {
                data: {
                    value: data,
                    configurable: true,
                    writable: true
                },
                dimensions: {
                    value: {m: size, n: size},
                    writable: false,
                    configurable: true
                }
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
            const mat = createMatrixView<SquareMatrix>(this, rows, exclude(i));
            det += sign * mat.determinant() * this.get(0, i);
        }

        return det;
    }

    adjugate(): SquareMatrix<N> {
        const _this = this;

        function exclude(i: number) {
            const indices = [];
            for (let j = 0; j < _this.size; ++j) {
                if (j !== i)
                    indices.push(j);
            }

            return indices;
        }

        function computeCell(i, j): number {
            const det = createMatrixView<SquareMatrix>(_this, exclude(i), exclude(j)).determinant();
            return (-1) ** (i + j) * det;
        }

        const adjugate = Matrix.create<SquareMatrix<N>>(this.dimensions.m, this.dimensions.n);
        for (let i = 0; i < this.dimensions.m; i++) {
            for (let j = 0; j < this.dimensions.n; j++) {
                adjugate.set(i, j, computeCell(i, j));
            }
        }

        return adjugate;
    }

    inverse(): SquareMatrix<N> {
        const adj = this.adjugate();
        adj.multiplyScalar(1 / this.determinant());

        return Matrix.transpose(adj) as SquareMatrix<N>;
    }

    scale(...values: number[]): SquareMatrix<N> {
        const n = this.size;
        const m = new SquareMatrix(n);

        for (let i = 0; i < Math.min(values.length, n - 1); ++i) {
            m.set(i, i, values[i])
        }

        return m.multiply(this);
    }

    translate(...values: number[]): SquareMatrix<N>;
    translate(...values: [number[]]): SquareMatrix<N>;
    translate(...values: any): SquareMatrix<N> {
        const n = this.size;
        const m = new SquareMatrix(n);

        if (typeof values[0] === "object") {
            values = values[0];
        }

        for (let i = 0; i < Math.min(values.length, n - 1); ++i) {
            m.set(i, n - 1, values[i])
        }

        return this.multiply(m);
    }

    multiply(matrix: SquareMatrix<N>): SquareMatrix<N> {
        const r = SquareMatrix.multiply(this, matrix);
        return r as SquareMatrix<N>;
    }
}

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
                    writable: true
                },
                dimensions: {
                    value: {m: 4, n: 4},
                    writable: false,
                    configurable: true
                }
            });
            return mat;
        } else {
            return Matrix.fromArray(data as number[][]) as Matrix4;
        }
    }

    rotate(theta: number, axis: Vector3): Matrix4 {
        axis = axis.normalized();
        const x = axis.x;
        const y = axis.y;
        const z = axis.z;
        const cos = Math.cos(theta);
        const sin = Math.sin(theta);
        return this.multiply(Matrix4.fromArray([
            [cos + x ** 2 * (1 - cos), x * y * (1 - cos) - z * sin, x * z * (1 - cos) + y * sin, 0],
            [y * x * (1 - cos) + z * sin, cos + y ** 2 * (1 - cos), y * z * (1 - cos) - x * sin, 0],
            [z * x * (1 - cos) - y * sin, z * y * (1 - cos) + x * sin, cos + z ** 2 * (1 - cos), 0],
            [0, 0, 0, 1]
        ]));
    }

    rotateX(theta: number): Matrix4 { return this.rotate(theta, new Vector3(1, 0, 0)); }

    rotateY(theta: number): Matrix4 { return this.rotate(theta, new Vector3(0, 1, 0)); }

    rotateZ(theta: number): Matrix4 { return this.rotate(theta, new Vector3(0, 0, 1)); }

    translate(...values): SquareMatrix<4> {
        if (values[0] instanceof Vector3)
            return super.translate(values[0].coordinates);
        else
            return super.translate(...values);
    }

    translateX(x: number): Matrix4 { return this.translate(x, 0, 0); }

    translateY(y: number): Matrix4 { return this.translate(0, y, 0); }

    translateZ(z: number): Matrix4 { return this.translate(0, 0, z); }

    scaleX(x: number): Matrix4 { return this.scale(x, 1, 1); }

    scaleY(y: number): Matrix4 { return this.scale(1, y, 1); }

    scaleZ(z: number): Matrix4 { return this.scale(1, 1, z); }

    transform(vec: Vector3): Vector3 {
        const r = Matrix.multiply(this, Matrix.fromVector(vec));
        return vectorFromMatrix(Vector3, r);
    }
}

export interface Matrix4 {
    multiply(matrix: Matrix4): Matrix4;

    translate(x: number, y: number, z: number): Matrix4;

    translate(coordinates: [number, number, number]): Matrix4;

    translate(vec: Vector3): Matrix4;

    scale(x: number, y: number, z: number): Matrix4;

    inverse(): Matrix4;

    clone(): Matrix4;
}

export interface SquareMatrix<N extends number> {
    clone(): SquareMatrix<N>;
}

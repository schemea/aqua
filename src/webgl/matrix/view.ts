import { Matrix } from "./index";
import { getMatrixPrototype, MatrixOperationError } from "./utils";

const matricesViews = new Map();

export function createMatrixView<T extends Matrix = Matrix>(matrix: Matrix, rows: number[] = [], cols: number[] = []): T {
    const matrixPrototype = getMatrixPrototype(rows.length, cols.length);
    let constructor       = matricesViews.get(matrixPrototype);

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
                },
            },
            data: {
                get() {
                    throw new MatrixOperationError("Cannot access data member of MatrixView");
                },
                set(value) {
                    const get        = Object.getOwnPropertyDescriptor(Matrix.prototype, "get");
                    const set        = Object.getOwnPropertyDescriptor(Matrix.prototype, "set");
                    const dimensions = Object.getOwnPropertyDescriptor(Matrix.prototype, "dimensions");
                    Object.defineProperties(this, {
                        data: { value },
                        get,
                        set,
                        dimensions,
                    });
                    delete this.matrix;
                    delete this.copy;
                    delete this.rows;
                    delete this.cols;
                },
                // get() {return this.matrix.data.filter((row, i) => this.rows.includes(i)).map(row => row.filter((cell, j) => this.cols.includes(j))); }
            },
            get: {
                value(i: number, j: number): number | undefined {
                    return this.matrix.get(this.rows[i], this.cols[j]);
                },
            },
            set: {
                // Copy on write
                value(i: number, j: number, value: number): void {
                    this.copy();
                    this.set(i, j, value);
                    // throw new MatrixOperationError("MatrixView is read only");
                    // (this.matrix as Matrix).set(this.rows[i], this.cols[j], value);
                },
            },
            dimensions: {
                get() {
                    return {
                        m: this.rows.length,
                        n: this.cols.length,
                    }
                },
            },
        });

        if ("size" in matrixPrototype) {
            Object.defineProperty(prototype, "size", {
                get() {
                    return this.dimensions.m;
                },
            });
        }

        constructor = new Function(`return function ${ matrixPrototype.constructor.name + "View" }(...args){ return createMatrixView(...args)}`)();
        matricesViews.set(matrixPrototype, constructor);

        constructor.prototype = prototype;
        prototype.constructor = constructor;
    }

    const view = Object.create(prototype, {
        matrix: {
            value: matrix,
            writable: false,
            configurable: true,
        },
    });

    return Object.assign(view, {
        rows,
        cols,
    });
}

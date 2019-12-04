import { Matrix } from "./index";
import { Vector } from "../vector";

export class MatrixOperationError {
    constructor(public error: string) { }
}

export interface Dimension<M extends number, N extends number> {
    m: M;
    n: N;
}

export function setDiagonal<N extends number>(matrix: Matrix<N, N>, value: number) {

    for (let i = 0; i < matrix.dimensions.m; ++i) {
        matrix.set(i, i, value);
    }
}

const matrixProtypeMap: ((m: number, n: number) => Matrix)[] = [];

export function registerMatrix(predicate: (m: number, n: number) => Matrix) {
    matrixProtypeMap.push(predicate);
}

export function getMatrixPrototype<M extends number, N extends number>(m: M, n: N) {
    let prototype: Matrix;
    for (let i = matrixProtypeMap.length - 1; i >= 0; i--) {
        const predicate = matrixProtypeMap[i];
        if ((prototype = predicate(m, n))) {
            return prototype;
        }
    }

    return Matrix.prototype;
    // if (m as number !== n)
    //     return Matrix.prototype;
    // else if (m === 4)
    //     return Matrix4.prototype;
    // else
    //     return SquareMatrix.prototype;
}

export function vectorFromMatrix<T extends Vector, N extends number>(constructor: { new(...args: number[]): any }, matrix: Matrix<N, 1>): T {
    const vec       = Vector.create(matrix.dimensions.m - 1);
    vec.coordinates = Matrix.transpose(matrix).data.slice(0, vec.dimension);
    return vec as T;
}

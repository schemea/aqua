import {Matrix, Matrix3} from "./matrix";
import {Vector3} from "three";

function toRadian(deg: number) {
    return deg * Math.PI / 180;
}

function round(value: number, digits: number = 5) {
    return Math.round(value * 10 ** digits) / 10 ** digits;
}

function roundVec(vec: Vector3, digits: number = 5) {
    vec.setX(round(vec.x, digits));
    vec.setY(round(vec.y, digits));
    vec.setZ(round(vec.z, digits));

    return vec;
}

test('matrix: fromArray', () => {
    const a = Matrix.fromArray([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]);
    const b = Matrix.identity(3);

    expect(a.equals(b)).toBeTruthy();
});

test('matrix: add', () => {
    const a = Matrix.fromArray([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ]);
    const b = Matrix.identity(3);

    expect(Matrix.add(a, b)).toEqual(Matrix.fromArray([
        [2, 1, 1],
        [1, 2, 1],
        [1, 1, 2]
    ]));
});

test('matrix: multiply by identity', () => {
    const a = Matrix.fromArray([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ]);
    const b = Matrix.identity(3);

    expect(Matrix.multiply(a, b)).toEqual(a);
});

test('matrix: multiply 2 square matrices', () => {
    const a = Matrix.fromArray([
        [1, 2],
        [2, 0]
    ]);
    const b = Matrix.fromArray([
        [3, 1],
        [-1, -1]
    ]);

    expect(Matrix.multiply(a, b)).toEqual(Matrix.fromArray([
        [1, -1],
        [6, 2]
    ]));
});

test('matrix: multiply 3x2 by 2x3', () => {
    const a = Matrix.fromArray([
        [1, 2],
        [2, 4],
        [7, -2]
    ]);
    const b = Matrix.fromArray([
        [1, 1, 0],
        [-1, 0, -3]
    ]);
    expect(Matrix.multiply(a, b)).toEqual(Matrix.fromArray([
        [-1, 1, -6],
        [-2, 2, -12],
        [9, 7, 6]
    ]));
});

test('matrix3: transform', () => {
    const vec = new Vector3(1, 1, 1);
    const matrix = new Matrix3();
    expect(matrix.transform(vec)).toEqual(new Vector3(1, 1, 1));
});

test('matrix3: translate', () => {
    const vec = new Vector3(3, 3, 2);
    const matrix = new Matrix3();
    matrix.translate(2, 1, 2);
    expect(matrix.transform(vec)).toEqual(new Vector3(5, 4, 4));
});

test('matrix3: multiple translates', () => {
    const vec = new Vector3(3, 3, 2);
    const matrix = new Matrix3();
    matrix.translate(2, 1, 2);
    matrix.translate(1, 1, 2);
    expect(matrix.transform(vec)).toEqual(new Vector3(6, 5, 6));
});

test('matrix3: rotateX', () => {
    const vec = new Vector3(0, 1, 0);
    const matrix = new Matrix3();
    matrix.rotateX(toRadian(90));

    const r = matrix.transform(vec);
    expect(roundVec(r)).toEqual(new Vector3(0, 0, 1));
});

test('matrix3: rotateY', () => {
    const vec = new Vector3(1, 0, 0);
    const matrix = new Matrix3();
    matrix.rotateY(toRadian(90));

    const r = matrix.transform(vec);
    expect(roundVec(r)).toEqual(new Vector3(0, 0, -1));
});

test('matrix3: rotateZ', () => {
    const vec = new Vector3(1, 0, 0);
    const matrix = new Matrix3();
    matrix.rotateZ(toRadian(90));

    const r = matrix.transform(vec);
    expect(roundVec(r)).toEqual(new Vector3(0, 1, 0));
});

test('matrix: transpose', () => {
    let mat = Matrix.fromArray([[1, 2, 3]]);
    mat = Matrix.transpose(mat);
    expect(mat).toEqual(Matrix.fromArray([
        [1],
        [2],
        [3]
    ]));
});

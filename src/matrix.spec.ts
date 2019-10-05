import {Matrix, Matrix3} from "./matrix";
import {Vector3} from "three";

test('matrix from array', () => {
    const a = Matrix.fromArray([
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1]
    ]);
    const b = Matrix.identity(3);

    expect(a.equals(b)).toBeTruthy();
});

test('add two matrices', () => {
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

test('multiply matrix by identity', () => {
    const a = Matrix.fromArray([
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
    ]);
    const b = Matrix.identity(3);

    expect(Matrix.multiply(a, b)).toEqual(a);
});

test('multiply two square matrices', () => {
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

test('multiply 3x2 by 2x3 matrices', () => {
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

test('transform vector3 by identity matrix3', () => {
    const vec = new Vector3(1, 1, 1);
    const matrix = new Matrix3();
    expect(matrix.transform(vec)).toEqual(new Vector3(1, 1, 1));
});

test('apply translation matrix3 to vector3', () => {
    const vec = new Vector3(3, 3, 2);
    const matrix = new Matrix3();
    matrix.translate(2, 1, 2);
    expect(matrix.transform(vec)).toEqual(new Vector3(5, 4, 4));
});

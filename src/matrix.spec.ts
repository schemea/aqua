import {Matrix, Matrix3, SquareMatrix} from "./matrix";
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

function roundMatrix(mat: Matrix, digits: number = 5) {
    mat.forEach((value, i, j) => mat.set(i, j, round(value, digits)));
    return mat;
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

test('matrix: multiply', () => {
    {
        const a = Matrix.fromArray([
            [1, 1, 1],
            [1, 1, 1],
            [1, 1, 1]
        ]);
        const b = Matrix.identity(3);

        expect(Matrix.multiply(a, b)).toEqual(a);
    }
    {
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
    }
    {
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
    }
});

test('matrix: transpose', () => {
    {
        let mat = Matrix.fromArray([[1, 2, 3]]);
        mat = Matrix.transpose(mat);
        expect(mat).toEqual(Matrix.fromArray([
            [1],
            [2],
            [3]
        ]));
    }
    {
        let mat = Matrix.fromArray([
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]);
        mat = Matrix.transpose(mat);
        expect(mat).toEqual(Matrix.fromArray([
            [1, 4, 7],
            [2, 5, 8],
            [3, 6, 9]
        ]));
    }
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
    matrix.translate(-5, 0.5, 25);
    expect(matrix.transform(vec)).toEqual(new Vector3(0, 4.5, 29));
});

test('matrix3: scale', () => {
    const vec = new Vector3(3, 3, 2);
    {
        const matrix = new Matrix3();
        matrix.scale(2, 3, 0.5);
        expect(matrix.transform(vec)).toEqual(new Vector3(6, 9, 1));
    }
    {
        const matrix = new Matrix3();
        matrix.scaleX(2);
        matrix.scaleY(2);
        matrix.scaleZ(2);
        matrix.scaleX(0.25);
        matrix.scaleY(3);
        matrix.scaleZ(10);
        expect(matrix.transform(vec)).toEqual(new Vector3(1.5, 18, 40));
    }
});

test('matrix3: rotate', () => {
    {
        const vec = new Vector3(0, 1, 0);
        const matrix = new Matrix3();
        matrix.rotateX(toRadian(90));

        const r = matrix.transform(vec);
        expect(roundVec(r)).toEqual(new Vector3(0, 0, 1));
    }
    {
        const vec = new Vector3(1, 0, 0);
        const matrix = new Matrix3();
        matrix.rotateY(toRadian(90));

        const r = matrix.transform(vec);
        expect(roundVec(r)).toEqual(new Vector3(0, 0, -1));
    }
    {
        const vec = new Vector3(1, 0, 0);
        const matrix = new Matrix3();
        matrix.rotateZ(toRadian(90));

        const r = matrix.transform(vec);
        expect(roundVec(r)).toEqual(new Vector3(0, 1, 0));
    }
});

test('square: inverse', () => {
    const n = Math.round(3);
    const mat = new SquareMatrix(n);
    mat.forEach((value, i, j) => mat.set(i, j, Math.floor(Math.random() * 100)));

    const inv = mat.clone();
    inv.inverse();
    inv.multiply(mat);

    expect(roundMatrix(inv)).toEqual(Matrix.identity(n));
});

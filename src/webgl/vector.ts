import {Matrix, SquareMatrix} from "./matrix";

export class Vector<D extends number = number> {
    coordinates: number[];

    constructor(dimension: D) {
        this.coordinates = new Array(dimension);
        for (let i = 0; i < dimension; i++) {
            this.coordinates[i] = 0;
        }
    }

    get dimension(): D { return this.coordinates.length as D; }

    static fromCoordinates<D extends number>(...args: number[]): Vector<D> {
        const vec = new Vector(args.length as D);
        vec.coordinates = [...args];

        return vec;
    }

    static add(...vecs: Vector2[]): Vector2;
    static add(...vecs: Vector3[]): Vector3;
    static add<D extends number>(...vecs: Vector<D>[]): Vector<D>;
    static add(...vecs: Vector[]): Vector {
        const r = Vector.create(vecs[0].dimension);
        for (let i = 0; i < vecs[0].dimension; i++) {
            r.coordinates[i] = vecs.reduce((sum, vec) => sum + vec.coordinates[i], 0);
        }
        return r;
    }

    static create<T extends Vector>(vector: Vector): T;
    static create<D extends number, T extends Vector<D> = Vector<D>>(dimension: D): T;
    static create(arg: number | Vector) {
        if (typeof arg === "number") {
            switch (arg) {
                case 3:
                    return new Vector3();
                default:
                    return new Vector(arg);
            }
        } else {
            const prototype = Object.getPrototypeOf(arg);
            const vec = Object.create(prototype) as Vector;
            vec.coordinates = new Array(arg.dimension);
            for (let i = 0; i < arg.dimension; i++) {
                vec.coordinates[i] = 0;
            }
            return vec;
        }
    }


    dot(vector: Vector<D>): number {
        if (vector.dimension !== this.dimension) {
            throw "vector must be of same dimensions";
        }

        const d = vector.dimension;

        const a = Matrix.create(1, d);
        const b = Matrix.create(d, 1);

        a.data = this.coordinates;
        b.data = vector.coordinates;

        return Matrix.multiply(a, b).get(0, 0);
    }

    clone(): Vector<D> {
        const vec = Vector.create(this) as Vector<D>;
        vec.assign(this);
        return vec;
    }

    from(origin: Vector<D>): Vector<D> {
        const vec = Vector.create(this.dimension);

        for (let i = 0; i < this.coordinates.length; i++) {
            vec.coordinates[i] = this.coordinates[i] - origin.coordinates[i];
        }
        return vec;
    }

    norm(): number {
        return Math.sqrt(this.coordinates.reduce((prev, curr) => prev + curr ** 2, 0));
    }

    distance(vec: Vector<D>): number {
        return this.from(vec).norm();
    }

    assign(vec: Vector<D>): void {
        this.coordinates = [...vec.coordinates];
    }

    multiply(scalar: number): Vector<D> {
        const vec = this.clone();
        vec.coordinates = vec.coordinates.map(value => value * scalar);
        return vec;
    }

    normalized(): Vector<D> {
        const magnitude = this.norm();
        const vec = this.clone();
        vec.coordinates = vec.coordinates.map(value => value / magnitude);
        return vec;
    }

    negated(): Vector<D> {
        const vec = Vector.create(this);
        vec.coordinates = this.coordinates.map(value => -value);
        return vec as Vector<D>;
    }
}

export class Vector2 extends Vector {
    constructor(x = 0, y = 0) {
        super(2);
        this.coordinates = [x, y];
    }

    get x(): number { return this.coordinates[0]; }

    set x(value: number) { this.coordinates[0] = value; }

    get y(): number { return this.coordinates[1]; }

    set y(value: number) { this.coordinates[1] = value; }
}

export class Vector3 extends Vector {
    constructor(x = 0, y = 0, z = 0) {
        super(3);
        this.coordinates = [x, y, z];
    }

    get x(): number { return this.coordinates[0]; }

    set x(value: number) { this.coordinates[0] = value; }

    get y(): number { return this.coordinates[1]; }

    set y(value: number) { this.coordinates[1] = value; }

    get z(): number { return this.coordinates[2]; }

    set z(value: number) { this.coordinates[2] = value; }

    static fromSpherical(r: number, theta: number, phi: number) {
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);

        return new Vector3(x, y, z);
    }

    cross(vector: Vector3): Vector3 {
        const matrix = SquareMatrix.fromArray([
            0, 0, 0,
            ...this.coordinates,
            ...vector.coordinates
        ]);

        return new Vector3(
            matrix.cofactor(0, 0),
            matrix.cofactor(0, 1),
            matrix.cofactor(0, 2)
        );
    }

    toSpherical(): { r: number, phi: number, theta: number } {
        const r = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
        return {
            r,
            phi: Math.atan(this.y / this.x),
            theta: Math.acos(this.z / r)
        }
    }
}

export interface Vector3 {
    coordinates: [number, number, number];
    dimension: 3;

    clone(): Vector3;

    from(origin: Vector<3>): Vector3;

    normalized(): Vector3;

    negated(): Vector3;

    multiply(scalar: number): Vector3;
}

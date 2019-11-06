export class Vector3 {
    coordinates: number[] = [];

    constructor(x = 0, y = 0, z = 0) {
        this.coordinates[0] = x;
        this.coordinates[1] = y;
        this.coordinates[2] = z;
    }

    get x(): number { return this.coordinates[0]; }

    set x(value: number) { this.coordinates[0] = value; }

    get y(): number { return this.coordinates[1]; }

    set y(value: number) { this.coordinates[1] = value; }

    get z(): number { return this.coordinates[2]; }

    set z(value: number) { this.coordinates[2] = value; }
}

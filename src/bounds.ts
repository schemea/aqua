export class Bounds {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    depth: number;

    get left() {return this.x;}

    get bottom() {return this.y;}

    get back() {return this.z;}

    get right() {return this.x + this.width;}

    get top() {return this.y + this.height;}

    get front() {return this.z + this.depth;}

    constructor(x?: number, y?: number, z?: number, width?: number, height?: number, depth?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.depth = depth || 0;
    }
}

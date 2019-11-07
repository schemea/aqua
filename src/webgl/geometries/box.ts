import {Geometry} from "@webgl/geometries/index";
import {Vector, Vector3} from "@webgl/vector";

export function pushQuad(vertices: number[], position: Vector3, dx: Vector3, dy: Vector3) {
    vertices.push(
        ...Vector.add(position, dx.negated(), dy).coordinates,
        ...Vector.add(position, dx, dy).coordinates,
        ...Vector.add(position, dx.negated(), dy.negated()).coordinates,
        ...Vector.add(position, dx.negated(), dy.negated()).coordinates,
        ...Vector.add(position, dx, dy.negated()).coordinates,
        ...Vector.add(position, dx, dy).coordinates,
    );
}


export class BoxGeometry extends Geometry {

    constructor(context: WebGLRenderingContext, public width: number, public height: number, public depth: number) {
        super(context, 3);
        this.updateBuffer();
    }

    updateBuffer(): void {
        const vertices: number[] = [];

        const dx = new Vector3(this.width / 2, 0, 0);
        const dy = new Vector3(0, this.height / 2, 0);
        const dz = new Vector3(0, 0, this.depth / 2);

        pushQuad(vertices, dx.negated(), dz, dy);
        pushQuad(vertices, dx, dz, dy);

        pushQuad(vertices, dy, dx, dz);
        pushQuad(vertices, dy.negated(), dx, dz);

        pushQuad(vertices, dz, dx, dy);
        pushQuad(vertices, dz.negated(), dx, dy);

        this.vertices(vertices);
    }
}

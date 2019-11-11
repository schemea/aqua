import {VertexBuffer} from "@webgl/models/buffer";
import {Vector3} from "@webgl/vector";

export class Geometry {
    readonly buffer: VertexBuffer;
    readonly normals: VertexBuffer;

    vertexCount = 0;

    constructor(public readonly context: WebGLRenderingContext, public readonly dimension: number) {
        this.buffer = new VertexBuffer(this.context, this.context.ARRAY_BUFFER);
        this.normals = new VertexBuffer(context, context.ARRAY_BUFFER);
        this.mode = context.TRIANGLES;
    }

    get mode() { return this.buffer.mode; }

    set mode(value: GLenum) { this.buffer.mode = value; }

    setVertices(data: number[], usage = this.context.STATIC_DRAW): void {
        this.buffer.bind();
        this.buffer.data(new Float32Array(data), usage);
        this.vertexCount = data.length / this.dimension;
    }

    setNormals(data: number[], usage = this.context.STATIC_DRAW): void {
        this.normals.bind();
        this.normals.data(new Float32Array(data), usage);
    }
}

export function computeNormals(vertices: number[]): number[] {
    if (vertices.length % 9 !== 0) {
        throw "vertices.length must be a multiple of 9";
    }

    function getPoint(i: number) {
        return new Vector3(
            vertices[i],
            vertices[i + 1],
            vertices[i + 2]
        );
    }

    const normals: number[] = [];

    for (let i = 0; i < vertices.length; i += 9) {
        const a = getPoint(i);
        const b = getPoint(i + 3);
        const c = getPoint(i + 6);

        for (let j = 0; j < 3; j++) {
            normals.push(...b.from(a).cross(c.from(a)).coordinates);
        }
    }

    return normals;
}

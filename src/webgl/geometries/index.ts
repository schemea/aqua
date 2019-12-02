import { VertexBuffer } from "@webgl/models/buffer";
import { Vector3 } from "@webgl/vector";
import { Mode } from "@webgl/models/mode";
import { SharedRef } from "../../shared";

export class Geometry extends SharedRef {
    readonly buffer: VertexBuffer;
    readonly normals: VertexBuffer;

    vertexCount = 0;

    constructor(public readonly context: WebGLRenderingContext, public readonly dimension: number) {
        super();

        this.buffer  = new VertexBuffer(this.context, this.context.ARRAY_BUFFER);
        this.normals = new VertexBuffer(context, context.ARRAY_BUFFER);
        this.mode    = context.TRIANGLES;
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

    release(): void {
        super.release();

        this.buffer.release();
        this.normals.release();
    }
}

export function computeNormals(vertices: number[], mode: Mode): number[] {
    // if (vertices.length % 9 !== 0) {
    //
    //     throw "vertices.length must be a multiple of 9";
    // }

    function getPoint(i: number) {

        return new Vector3(
            vertices[i],
            vertices[i + 1],
            vertices[i + 2],
        );
    }

    function computeNormal(a: Vector3, b: Vector3, c: Vector3): [ number, number, number ] {
        return b.from(a).cross(c.from(a)).coordinates;
    }

    const normals: number[] = [];

    if (mode === Mode.TRIANGLES) {
        for (let i = 0; i < vertices.length; i += 9) {
            const a = getPoint(i);
            const b = getPoint(i + 3);
            const c = getPoint(i + 6);

            const normal = computeNormal(a, b, c);

            for (let j = 0; j < 3; j++) {
                normals.push(...normal);
            }
        }
    } else if (mode === Mode.TRIANGLE_STRIP) {
        {
            const a = getPoint(0);
            const b = getPoint(3);
            const c = getPoint(6);

            const normal = computeNormal(a, b, c);

            for (let i = 0; i < 3; i++) {
                normals.push(...normal);
            }
        }

        for (let i = 3; i < vertices.length; i += 3) {
            const a = getPoint(i);
            const b = getPoint(i + 3);
            const c = getPoint(i + 6);

            normals.push(...computeNormal(a, b, c))
        }
    }


    return normals;
}

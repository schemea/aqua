import {VertexBuffer} from "@webgl/models/buffer";

export class Geometry {
    public buffer: VertexBuffer;
    vertexCount = 0;

    constructor(public readonly context: WebGLRenderingContext, public readonly dimension: number) {
        this.buffer = new VertexBuffer(this.context, this.context.ARRAY_BUFFER);
        this.mode = context.TRIANGLES;
    }

    get mode() { return this.buffer.mode; }

    set mode(value: GLenum) { this.buffer.mode = value; }

    vertices(data: number[], usage = this.context.STATIC_DRAW) {
        this.buffer.bind();
        this.buffer.data(new Float32Array(data), usage);
        this.vertexCount = data.length / this.dimension;
    }
}

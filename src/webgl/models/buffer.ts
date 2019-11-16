import {Mode} from "@webgl/models/mode";

export class Buffer {
    handle: WebGLBuffer;

    constructor(public context: WebGLRenderingContext, public target: GLenum) {
        this.handle = context.createBuffer();
    }

    get byteLength(): number { return this.getParameter(this.context.BUFFER_SIZE); }

    bind(): void {
        this.context.bindBuffer(this.target, this.handle);
    }

    data(data: BufferSource, usage: GLenum): void;
    data(size: number, usage: GLenum): void;
    data(arg, usage: GLenum): void {
        this.context.bufferData(this.target, arg, usage);
    }

    getParameter<T>(name: GLenum): T { return this.context.getBufferParameter(this.target, name); }

    release() {
        this.context.deleteBuffer(this.handle);
    }
}

export class VertexBuffer extends Buffer {
    mode: Mode;
    length: number;

    constructor(context: WebGLRenderingContext, target: GLenum) {
        super(context, target);
    }

    // vertices(data: number[], usage: GLenum) {
    //     super.data(new Float32Array(data), usage);
    //     length = data.length;
    // }

    // data(data, usage: number): void {
    //     throw "cannot call method data of a VertexBuffer";
    // }
}

import {Program} from "@webgl/program";

export class AttributeLocation {
    index: GLenum;

    constructor(public program: Program, name: string) {
        this.index = program.getAttribLocation(name);
    }

    get context() { return this.program.context; }

}

export class VertexAttributeLocation extends AttributeLocation {
    normalized = false;
    stride = 0;
    offset = 0;
    type: GLenum;

    constructor(program: Program, name: string, public dimension: number) {
        super(program, name);
        this.type = this.context.FLOAT;
    }

    enable(): void { this.context.enableVertexAttribArray(this.index); }

    bind(): void { this.context.vertexAttribPointer(this.index, this.dimension, this.type, this.normalized, this.stride, this.offset)}
}

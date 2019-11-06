import {Program} from "@webgl/program";

function getSuffix(context: WebGLRenderingContext, type: GLenum) {
    switch (type) {
        case context.FLOAT:
            return "f";
        case context.INT:
            return "i";
        default:
            throw "invalid type";
    }
}

export class UniformLocation {
    public handle: WebGLUniformLocation;

    constructor(public readonly program: Program, name: string) {
        this.handle = program.context.getUniformLocation(program.handle, name);
    }

    set(data: number[], type: GLenum) {
        const context = this.program.context;
        const fn = `uniform${data.length}${getSuffix(context, type)}`;
        context[fn](this.handle, ...data);
    }

    get<T>(): T {
        return this.program.context.getUniform(this.program.handle, this.handle);
    }
}

import {Shader} from "@webgl/shader";

export class Program {
    handle: WebGLProgram;
    id: string;

    constructor(public context: WebGLRenderingContext) {
        this.handle = context.createProgram();
    }

    attachShader(shader: Shader) { this.context.attachShader(this.handle, shader.handle); }

    use(): void { this.context.useProgram(this.handle); }

    getParameter<T>(name: GLenum): T { return this.context.getProgramParameter(this.handle, name); }

    getInfoLog(): string { return this.context.getProgramInfoLog(this.handle); }

    link() {
        this.context.linkProgram(this.handle);
        if (!this.getParameter(this.context.LINK_STATUS)) {
            console.error(this.getInfoLog());
        }
    }

    getAttribLocation(name: string): GLenum { return this.context.getAttribLocation(this.handle, name); }

    release(): void { this.context.deleteProgram(this.handle); }
}

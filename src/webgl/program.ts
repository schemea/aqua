import {Shader} from "@webgl/shader";
import {CacheManager} from "@webgl/utils";

export class Program {
    handle: WebGLProgram;
    name: string = "";

    constructor(public context: WebGLRenderingContext) {
        this.handle = context.createProgram();
    }

    static generateName(...shaders: Shader[]): string { return shaders.map(value => value.handle).join("-"); }

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

    attachShader(shader: Shader) {
        this.context.attachShader(this.handle, shader.handle);
        this.name += "-" + shader.handle;
    }
}


export class ProgramCache extends CacheManager<Program, (...shaders: Shader[]) => Program> {
    constructor(public readonly context: WebGLRenderingContext) {
        super((...shaders: Shader[]): Program => {
            const program = new Program(context);
            shaders.forEach(program.attachShader.bind(program));
            program.link();

            return program;
        });
    }

    extractKey(...shaders: Shader[]): any {
        if (typeof shaders[0] === "string")
            return shaders[0];
        return Program.generateName(...shaders);
    }
}

export interface ProgramCache {
    get(...shaders: Shader[]): Program;

    get(name: string): Program;

    cache(...shaders: Shader[]): void;
}

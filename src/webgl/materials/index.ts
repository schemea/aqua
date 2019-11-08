import {Program} from "@webgl/program";
import {Color} from "@webgl/models/color";
import {CacheManager} from "@webgl/utils";
import {Shader, ShaderCache} from "@webgl/shader";
import {Uniform} from "@webgl/locations/uniform";
import {Uniforms} from "@webgl/models/uniforms";

export class Material {
    color: Color;

    get type(): string { return Object.getPrototypeOf(this).constructor.name; }

    createProgram(shader: ShaderCache): Program {
        throw "createProgram() has not been implemented by " + this.type;
    }

    createShader(context: WebGLRenderingContext): Shader { throw "not implemented"; }

    use(program: Program) {
        program.use();
        const u_color = new Uniform(program, Uniforms.color);
        u_color.set(this.color.channels, program.context.FLOAT);
    }

}

export class MaterialProgramCache extends CacheManager<Program, (key: Material) => Program> {

    constructor(public readonly shaders: ShaderCache) {
        super((material: Material): Program => material.createProgram(shaders));
    }
}

export interface MaterialProgramCache {
    get(key: Material): Program;
}

export * from "./basic";

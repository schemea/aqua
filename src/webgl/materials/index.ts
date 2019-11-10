import {Program} from "@webgl/program";
import {Color} from "@webgl/models/color";
import {CacheManager} from "@webgl/utils";
import {MaterialShaderCache, Shader} from "@webgl/shader";
import {Uniform} from "@webgl/locations/uniform";
import {Uniforms} from "@webgl/models/uniforms";

export class Material {
    color: Color;

    get type(): string { return Object.getPrototypeOf(this).constructor.name; }

    createProgram(shader: MaterialShaderCache): Program {
        throw "createProgram() has not been implemented by " + this.type;
    }

    createShader(context: WebGLRenderingContext): Shader { throw "not implemented"; }

    apply(program: Program) {
        const u_color = new Uniform(program, Uniforms.color);
        u_color.set(this.color.channels, program.context.FLOAT);
    }

}

export class MaterialProgramCache extends CacheManager<Program, (key: Material) => Program> {

    constructor(public readonly shaders: MaterialShaderCache) {
        super((material: Material): Program => material.createProgram(shaders));
    }

    extractKey(key: Material): string {
        return key.type;
    }
}

export interface MaterialProgramCache {
    get(key: Material): Program;
}

export * from "./basic";

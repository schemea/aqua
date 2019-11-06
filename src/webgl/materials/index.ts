import {Program} from "@webgl/program";
import {Color} from "@webgl/color";
import {CacheManager} from "@webgl/utils";
import {ShaderCache} from "@webgl/shader";
import {UniformLocation} from "@webgl/uniform";
import {Uniform} from "@webgl/models/uniform";

export class Material {
    color: Color;

    get type(): string { return Object.getPrototypeOf(this).constructor.name; }

    createProgram(shader: ShaderCache): Program {
        throw "createProgram() has not been implemented by " + this.type;
    }

    use(program: Program) {
        program.use();
        const u_color = new UniformLocation(program, Uniform.color);
        u_color.set(this.color.channels, program.context.FLOAT);
    }

}

export class MaterialProgramCache extends CacheManager<Program, (key: Material) => Program> {

    constructor(public readonly shaders: ShaderCache) {
        super((material: Material): Program => material.createProgram(shaders));
    }

    // get(key: Material): Program;
}

export interface MaterialProgramCache {
    get(key: Material): Program;
}

export * from "./basic";

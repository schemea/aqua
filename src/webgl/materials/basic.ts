import {Material} from "@webgl/materials/index";
import {Program} from "@webgl/program";
import {Color} from "@webgl/color";
import {Shader, ShaderCache} from "@webgl/shader";
import fragmentSource from "@shaders/fragment.glsl";
import vertexSource from "@shaders/vertex.glsl";

export class MaterialBasic extends Material {

    constructor(public color = new Color()) {
        super();
    }

    createProgram(shaders: ShaderCache): Program {
        const program = new Program(shaders.context);
        // const fragment = shaders.get("fragment", shaders.context.FRAGMENT_SHADER);
        // const vertex = shaders.get("vertex", shaders.context.VERTEX_SHADER);
        const vertex = new Shader(shaders.context, shaders.context.VERTEX_SHADER);
        const fragment = new Shader(shaders.context, shaders.context.FRAGMENT_SHADER);
        vertex.source = vertexSource;
        fragment.source = fragmentSource;
        vertex.compile();
        fragment.compile();
        program.attachShader(vertex);
        program.attachShader(fragment);
        program.link();
        return program;
    }
}

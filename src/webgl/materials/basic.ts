import {Material} from "@webgl/materials/index";
import {Program} from "@webgl/program";
import {Color} from "@webgl/models/color";
import {MaterialShaderCache, Shader} from "@webgl/shader";
import fragmentSource from "@shaders/fragment.glsl";
import vertexSource from "@shaders/vertex.glsl";

export class BasicMaterial extends Material {

    constructor(public color = new Color()) {
        super();
    }

    createShader(context: WebGLRenderingContext): Shader {
        const shader = new Shader(context, context.FRAGMENT_SHADER);
        shader.source = fragmentSource;
        shader.compile();
        return shader;
    }

    createProgram(shaders: MaterialShaderCache): Program {
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

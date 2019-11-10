import {WebGLElement} from "@webgl/element";
import {Mesh} from "@webgl/models/mesh";
import {Program, ProgramCache} from "@webgl/program";
import {MaterialShaderCache, Shader} from "@webgl/shader";
import {CacheManager} from "@webgl/utils";
import vertexSource from "@shaders/vertex.glsl";

function createVertexShader(context: WebGLRenderingContext, source: string) {
    const shader = new Shader(context, context.VERTEX_SHADER);
    shader.source = source;
    shader.compile();
    return shader;
}

declare namespace createVertexShader {
    function bind(thisArg: null, context: WebGLRenderingContext): (source: string) => Shader;
}

function add<K, V>(map: Map<K, V[]>, key: K, value: V) {
    const list = map.get(key);
    if (list) {
        list.push(value);
    } else {
        map.set(key, [value]);
    }
}

export class Scene extends WebGLElement {
    meshes = new Map<Program, Mesh[]>();

    readonly shaders = {
        materials: new MaterialShaderCache(this.context),
        vertices: new CacheManager<Shader>(createVertexShader.bind(null, this.context))
    };

    readonly programs = new ProgramCache(this.context);

    constructor(public readonly context: WebGLRenderingContext) {
        super();
    }

    addMesh(mesh: Mesh) {
        const vertex = this.shaders.vertices.get(vertexSource);
        const fragment = this.shaders.materials.get(mesh.material);

        const program = this.programs.get(vertex, fragment);

        add(this.meshes, program, mesh);
    }

    updatePrograms(): void {
        const map = new Map<Program, Mesh[]>();
        this.meshes.forEach(meshes => {
            meshes.forEach(mesh => {
                const vertex = this.shaders.vertices.get(vertexSource);
                const fragment = this.shaders.materials.get(mesh.material);
                const program = this.programs.get(vertex, fragment);
                add(map, program, mesh);
            });
        });
        this.meshes = map;
    }
}

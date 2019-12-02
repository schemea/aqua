import { WebGLElement } from "@webgl/element";
import { Mesh } from "@webgl/models/mesh";
import { Program, ProgramCache } from "@webgl/program";
import { MaterialShaderCache, Shader } from "@webgl/shader";
import { CacheManager } from "@webgl/utils";
import vertexSource from "@shaders/vertex.glsl";
import { SharedRef } from "../shared";

function createVertexShader(context: WebGLRenderingContext, source: string) {
    const shader  = new Shader(context, context.VERTEX_SHADER);
    shader.source = source;
    shader.compile();
    return shader;
}

declare namespace createVertexShader {
    function bind(thisArg: null, context: WebGLRenderingContext): (source: string) => Shader;
}

function add<K, V extends SharedRef>(map: Map<K, V[]>, key: K, value: V) {
    const list = map.get(key);
    if (list) {
        list.push(value);
    } else {
        map.set(key, [ value ]);
    }
    value.ref();
}

export class Group extends WebGLElement {
    meshes = new Map<Program, Mesh[]>();
    groups = [] as Group[];
    readonly context: WebGLRenderingContext;

    readonly shaders: { materials: MaterialShaderCache; vertices: CacheManager<Shader, (name: string) => Shader> };
    readonly programs: ProgramCache;

    constructor(parent: Group);
    constructor(context: WebGLRenderingContext);
    constructor(arg: WebGLRenderingContext | Group) {
        super();
        if (arg instanceof Group) {
            this.context = arg.context;
            this.shaders = arg.shaders;

            arg.addGroup(this);
        } else {
            this.context = arg;
            this.shaders = {
                materials: new MaterialShaderCache(this.context),
                vertices: new CacheManager<Shader>(createVertexShader.bind(null, this.context)),
            };
        }
        this.programs = new ProgramCache(this.context);
    }

    addMesh(mesh: Mesh): Program {
        const vertex   = this.shaders.vertices.get(vertexSource);
        const fragment = this.shaders.materials.get(mesh.material);

        const program = this.programs.get(vertex, fragment);

        add(this.meshes, program, mesh);

        return program;
    }

    removeMesh(mesh: Mesh, program?: Program) {
        if (program) {
            const meshes = this.meshes.get(program);
            if (meshes) {
                meshes.splice(meshes.indexOf(mesh), 1);
                mesh.unref();
            }
        } else {
            this.meshes.forEach(meshes => meshes.splice(meshes.indexOf(mesh), 1));
            mesh.unref();
        }
    }

    addGroup(group: Group) {
        this.groups.push(group);
        group.ref();
    }

    removeGroup(group: Group) {
        this.groups.splice(this.groups.indexOf(group), 1);
        group.unref();
    }

    updatePrograms(): void {
        const map = new Map<Program, Mesh[]>();
        this.meshes.forEach(meshes => {
            meshes.forEach(mesh => {
                const vertex   = this.shaders.vertices.get(vertexSource);
                const fragment = this.shaders.materials.get(mesh.material);
                const program  = this.programs.get(vertex, fragment);
                add(map, program, mesh);
            });
        });
        this.meshes = map;

        this.groups.forEach(group => group.updatePrograms());
    }

    release(): void {
        super.release();

        this.meshes.forEach(pair => pair.forEach(mesh => mesh.unref()));
        this.groups.forEach(group => group.unref());
    }
}

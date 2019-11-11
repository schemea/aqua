import {Program} from "@webgl/program";
import {VertexAttributeLocation} from "@webgl/locations/attribute";
import {Attributes} from "@webgl/models/attributes";
import {MaterialProgramCache} from "@webgl/materials";
import {MaterialShaderCache} from "@webgl/shader";
import {Mesh} from "@webgl/models/mesh";
import {Color} from "@webgl/models/color";
import {Uniform} from "@webgl/locations/uniform";
import {Uniforms} from "@webgl/models/uniforms";
import {Group} from "@webgl/group";
import {Matrix4} from "@webgl/matrix";

function setGlobalUniforms(renderer: Renderer, program: Program, matrix: Matrix4) {
    const u_resolution = new Uniform(program, Uniforms.resolution);
    u_resolution.set([renderer.canvas.clientWidth, renderer.canvas.clientHeight], renderer.context.INT);

    const u_ambient = new Uniform(program, Uniforms.ambient);
    u_ambient.set([1, 1, 1], renderer.context.FLOAT);

    const u_view_projection = new Uniform(program, Uniforms.view_projection);
    u_view_projection.setMatrix(matrix);
}

export class Renderer {
    context: WebGLRenderingContext;
    shaders: MaterialShaderCache;
    programs: MaterialProgramCache;

    constructor(parent: HTMLElement);

    constructor(canvas: HTMLCanvasElement);

    constructor(context: WebGLRenderingContext);

    constructor(public arg: HTMLElement | WebGLRenderingContext) {
        if (arg instanceof HTMLCanvasElement) {
            this.context = arg.getContext("webgl", {alpha: false});
        } else if (arg instanceof WebGLRenderingContext) {
            this.context = arg;
        } else if (arg instanceof HTMLElement) {
            const canvas = arg.appendChild(document.createElement("canvas"));
            this.context = canvas.getContext("webgl", {alpha: false});
        } else {
            throw "invalid argument passed to Renderer constructor";
        }
        this.shaders = new MaterialShaderCache(this.context);
        this.programs = new MaterialProgramCache(this.shaders);
    }

    get canvas(): HTMLCanvasElement { return this.context.canvas as HTMLCanvasElement; }

    enableDefaultFeatures() {
        this.context.enable(this.context.BLEND);
        this.context.blendFunc(this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA);

        this.context.enable(this.context.DEPTH_TEST);
    }

    drawGroup(group: Group, view: Matrix4): void {
        view = view.multiply(group.transform);

        group.meshes.forEach((meshes, program) => {
            program.use();

            setGlobalUniforms(this, program, view);

            meshes.forEach(this.drawMesh.bind(this, program));
        });

        group.groups.forEach(value => this.drawGroup(value, view));
    }

    private drawMesh(program: Program, mesh: Mesh) {
        mesh.material.apply(program);

        const u_transform = new Uniform(program, Uniforms.transform);
        u_transform.setMatrix(mesh.transform);

        const geometry = mesh.geometry;
        geometry.buffer.bind();

        const a_position = new VertexAttributeLocation(program, Attributes.position, geometry.dimension);
        a_position.enable();
        a_position.bind();

        geometry.normals.bind();

        const a_normal = new VertexAttributeLocation(program, Attributes.normal, 3);
        a_normal.enable();
        a_normal.bind();

        this.context.drawArrays(geometry.mode, 0, geometry.vertexCount);
    }

    resize(width: number, height: number) {
        this.context.canvas.width = width;
        this.context.canvas.height = height;
        this.context.viewport(0, 0, width, height);
    }

    clearColor(color: Color) {
        this.context.clearColor(...color.channels);
    }

    clear(mask: GLenum = this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT): void {
        this.context.clear(mask);
    }

    setRenderLoop(fn: (timestamp: DOMHighResTimeStamp) => void) {
        const handler = time => {
            fn(time);
            requestAnimationFrame(handler);
        };
        requestAnimationFrame(handler);
    }
}

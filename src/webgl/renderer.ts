import {Geometry} from "@webgl/geometries";
import {Program} from "@webgl/program";
import {VertexAttributeLocation} from "@webgl/locations/attribute";
import {Attributes} from "@webgl/models/attributes";
import {MaterialProgramCache} from "@webgl/materials";
import {ShaderCache} from "@webgl/shader";
import {Mesh} from "@webgl/models/mesh";
import {Color} from "@webgl/models/color";
import {Uniform} from "@webgl/locations/uniform";
import {Uniforms} from "@webgl/models/uniforms";
import {Camera} from "@webgl/cameras";
import {Vector3} from "@webgl/vector";

export class Renderer {
    context: WebGLRenderingContext;
    shaders: ShaderCache;
    programs: MaterialProgramCache;
    // camera: PerspectiveCamera;
    camera: Camera;

    constructor(parent: HTMLElement);

    constructor(canvas: HTMLCanvasElement);

    constructor(context: WebGLRenderingContext);

    constructor(public arg: HTMLElement | WebGLRenderingContext) {
        if (arg instanceof HTMLCanvasElement) {
            this.context = arg.getContext("webgl");
        } else if (arg instanceof WebGLRenderingContext) {
            this.context = arg;
        } else if (arg instanceof HTMLElement) {
            const canvas = arg.appendChild(document.createElement("canvas"));
            this.context = canvas.getContext("webgl");
        } else {
            throw "invalid argument passed to Renderer constructor";
        }
        this.shaders = new ShaderCache(this.context);
        this.programs = new MaterialProgramCache(this.shaders);
        // this.camera = new PerspectiveCamera(90, this.canvas.clientWidth / this.canvas.clientHeight, 0.01, 1000);
        this.camera = new Camera();
        this.camera.position.x = 0.5;
        this.camera.updateTransformMatrix();
        this.camera.updateViewMatrix();
        this.camera.updateWorldMatrix();
        (<any>window).identity = this.camera.transform.multiply(this.camera.world);
        (<any>window).origin = this.camera.world.transform(this.camera.position);
        (<any>window).world = this.camera.world;
        (<any>window).transform = this.camera.transform;
        (<any>window).Vector3 = Vector3;

    }

    get canvas(): HTMLCanvasElement { return this.context.canvas as HTMLCanvasElement; }

    enableDefaultFeatures() {
        this.context.enable(this.context.BLEND);
        this.context.blendFunc(this.context.SRC_ALPHA, this.context.ONE_MINUS_SRC_ALPHA);

        this.context.enable(this.context.DEPTH_TEST);
    }

    drawGeometry(geometry: Geometry, program: Program) {
        program.use();
        geometry.buffer.bind();
        const a_position = new VertexAttributeLocation(program, Attributes.position, geometry.dimension);
        a_position.bind();
        a_position.enable();

        const u_resolution = new Uniform(program, Uniforms.resolution);
        u_resolution.set([this.canvas.clientWidth, this.canvas.clientHeight], this.context.INT);

        const u_world = new Uniform(program, Uniforms.world);
        // u_world.setMatrix(Matrix.identity(4));
        u_world.setMatrix(this.camera.world);

        this.context.drawArrays(geometry.mode, 0, geometry.vertexCount);
    }

    drawMesh(mesh: Mesh) {
        const program = this.programs.get(mesh.material);
        mesh.material.use(program);
        const u_transform = new Uniform(program, Uniforms.transform);
        u_transform.setMatrix(mesh.transform);
        this.drawGeometry(mesh.geometry, program);
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

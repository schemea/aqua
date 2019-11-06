import {Geometry} from "@webgl/geometry";
import {Program} from "@webgl/program";
import {VertexAttributeLocation} from "@webgl/location";
import {Attributes} from "@webgl/models/attributes";
import {MaterialProgramCache} from "@webgl/materials";
import {ShaderCache} from "@webgl/shader";
import {Mesh} from "@webgl/mesh";
import {Color} from "@webgl/color";

export class Renderer {
    shaders = new ShaderCache(this.context);
    programs = new MaterialProgramCache(this.shaders);


    constructor(public context: WebGLRenderingContext) { }

    drawGeometry(geometry: Geometry, program: Program) {
        program.use();
        geometry.buffer.bind();
        const attrib = new VertexAttributeLocation(program, Attributes.position, geometry.dimension);
        attrib.bind();
        attrib.enable();

        this.context.drawArrays(geometry.mode, 0, geometry.vertexCount);
    }

    drawMesh(mesh: Mesh) {
        const program = this.programs.get(mesh.material);
        mesh.material.use(program);
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

    clear(mask: GLenum): void {
        if (mask) {
            this.context.clear(mask);
        } else {
            this.context.clear(this.context.COLOR_BUFFER_BIT);
            this.context.clear(this.context.DEPTH_BUFFER_BIT);
        }
    }
}

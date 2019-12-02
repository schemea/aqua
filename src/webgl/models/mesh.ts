import { Geometry } from "@webgl/geometries";
import { Material } from "@webgl/materials";
import { WebGLElement } from "@webgl/element";

export class Mesh extends WebGLElement {
    constructor(public geometry: Geometry, public material: Material) {
        super();
        geometry.ref();
    }

    release() {
        this.geometry.unref();
    }
}

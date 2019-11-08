import {Matrix4} from "@webgl/matrix";
import {WebGLElement} from "@webgl/element";

export class Camera extends WebGLElement {
    projection: Matrix4;
    view: Matrix4;
    world: Matrix4;

    constructor() {
        super();

        this.updateTransformMatrix();
        this.updateViewMatrix();
        this.updateProjectionMatrix();
        this.updateWorldMatrix();
    }

    updateProjectionMatrix(): void { this.projection = Matrix4.identity(4); }

    updateViewMatrix(): void { this.view = this.transform.inverse(); }

    updateWorldMatrix(): void { this.world = this.projection.multiply(this.view); }
}

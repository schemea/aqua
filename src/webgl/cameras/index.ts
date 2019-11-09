import {Matrix4} from "@webgl/matrix";
import {WebGLElement} from "@webgl/element";

export class Camera extends WebGLElement {
    projection: Matrix4;
    view: Matrix4;
    world: Matrix4;

    constructor() {
        super();

        this.view = Matrix4.identity(4);
        this.world = Matrix4.identity(4);
        this.transform = Matrix4.identity(4);
        this.projection = Matrix4.identity(4);
    }

    updateTransformMatrix(): void {
        super.updateTransformMatrix();
        this.view = this.transform.inverse();
    }

    updateProjectionMatrix(): void { this.projection = Matrix4.identity(4); }

    updateWorldMatrix(): void { this.world = this.view.multiply(this.projection); }
}

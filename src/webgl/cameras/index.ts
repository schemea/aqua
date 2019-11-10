import {Matrix4} from "@webgl/matrix";
import {WebGLElement} from "@webgl/element";
import {Vector3} from "@webgl/vector";

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

    rotate(theta: number, axis: Vector3): void {
        super.rotate(-theta, axis);
    }

    updateTransformMatrix(): void {
        this.transform = this.view.inverse();
        // this.view = this.transform.inverse();
    }

    updateViewMatrix(): void {
        this.view = Matrix4.identity(4);
        this.view = this.view.translate(this.position.negated());
        this.view = this.view.multiply(this.rotation);
    }

    updateProjectionMatrix(): void { this.projection = Matrix4.identity(4); }

    updateWorldMatrix(): void { this.world = this.projection.multiply(this.view); }
}

import {Geometry} from "@webgl/geometries";

export class PlaneGeometry extends Geometry {
    constructor(context: WebGLRenderingContext, public width: number, public height: number) {
        super(context, 2);
        this.updateBuffer();
    }

    private updateBuffer() {
        const dx = this.width / 2;
        const dy = this.height / 2;
        this.vertices([
            -dx, dy,
            dx, dy,
            -dx, -dy,
            -dx, -dy,
            dx, -dy,
            dx, dy,
        ]);
    }
}

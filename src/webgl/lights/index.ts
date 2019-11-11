import {WebGLElement} from "@webgl/element";

export class Light extends WebGLElement {

    constructor(public readonly context: WebGLRenderingContext) {
        super();
    }
}

import {Geometry} from "@webgl/geometry";
import {Vector3} from "@webgl/vector";
import {Material} from "@webgl/materials";

export class Mesh {
    position = new Vector3();
    movement = new Vector3();

    constructor(public geometry: Geometry, public material: Material) {

    }

    update() { }
}

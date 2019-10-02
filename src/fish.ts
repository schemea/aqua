import {Element3D} from "./element";
import {Vector3, BoxBufferGeometry, Mesh, MeshPhysicalMaterial} from "three";

export class Fish extends Element3D {
    following?: Fish;

    constructor(){
        super();
        this.volume = new Vector3(0.15,0.1,0.1);
        const geometry = new BoxBufferGeometry(this.volume.x, this.volume.y, this.volume.z);
        const material = new MeshPhysicalMaterial({
            color: 0x0000ff
        });
        this.mesh = new Mesh(geometry);
    }
}

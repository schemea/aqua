import {Element3D} from "./element";
import {BoxBufferGeometry, Mesh, MeshPhysicalMaterial, Vector3} from "three";
import {Aquarium} from "./aquarium";
import {Glass} from "./glass";

export class Fish extends Element3D {
    following?: Fish;

    constructor(public aquarium: Aquarium){
        super();
        this.volume = new Vector3(0.15,0.1,0.1);
        const geometry = new BoxBufferGeometry(this.volume.x, this.volume.y, this.volume.z);
        const material = new MeshPhysicalMaterial({
            color: 0x0000ff
        });
        this.mesh = new Mesh(geometry);
    }

    update(delta: number) {
        const position = this.position.clone();
        super.update(delta);

        const outGlass = this.aquarium.outGlass(this);
        // console.log(Object.entries(Glass).find((key, value) => value === outGlass));
        if(outGlass !== Glass.NONE && this.movement){
            debugger;
            this.position.copy(position);
            switch (outGlass) {
                case Glass.LEFT:
                case Glass.RIGHT:
                    this.movement.setX(this.movement.x * -1);
                    break;
                case Glass.TOP:
                case Glass.BOTTOM:
                    this.movement.setY(this.movement.y * -1);
                    break;
                case Glass.BACK:
                case Glass.FRONT:
                    this.movement.setZ(this.movement.z * -1);
                    break;
            }
        }
    }
}

import {Fish} from "./fish";
import {Element3D} from "./element";
import {Vector3} from "@webgl/vector";
import {BoxGeometry} from "@webgl/geometries/box";
import {World} from "@src/world";
import {Mesh} from "@webgl/models/mesh";
import {BasicMaterial} from "@webgl/materials";
import {Color} from "@webgl/models/color";

export class Aquarium extends Element3D {
    fishes: Fish[] = [];

    constructor(public world: World) {
        super();

        this.volume = new Vector3(2, 1, 1);
        const geometry = new BoxGeometry(world.context, this.volume.x, this.volume.y, this.volume.z);
        this.mesh = new Mesh(geometry, new BasicMaterial(new Color(0xcccccc, 0.2)));


        // const glassMaterial = new MeshPhysicalMaterial({
        //     color: new Color(0x000000),
        //     transparent: true,
        //     opacity: 0.15,
        //     side: DoubleSide
        // });

        // glassMaterial.reflectivity = 8;
        // glassMaterial.metalness = 1.5;
        // glassMaterial.refractionRatio = 10.5;

        // const transparentMaterial = new MeshBasicMaterial({
        //     transparent: true,
        //     opacity: 0
        // });

        // for (const face of geometry.faces)
        //     face.materialIndex = 0;
        // geometry.faces[4].materialIndex = 1;
        // geometry.faces[5].materialIndex = 1;

        // this.mesh = new Mesh(geometry, [glassMaterial, transparentMaterial]);

    }

    update(delta: DOMHighResTimeStamp) {
        this.fishes.forEach(fish => {
            fish.update(delta);
        });
    }

    addFish(...fishes: Fish[]) {
        this.fishes.push(...fishes);
    }
}

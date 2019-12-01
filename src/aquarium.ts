import { Fish } from "./fish";
import { Element3D } from "./element";
import { Vector3 } from "@webgl/vector";
import { BoxGeometry } from "@webgl/geometries/box";
import { World } from "@src/world";
import { Mesh } from "@webgl/models/mesh";
import { BasicMaterial } from "@webgl/materials";
import { Color } from "@webgl/models/color";
import { Group } from "@webgl/group";

export class Aquarium extends Element3D {
    fishes = [] as Fish[];
    meshes = new Group(this.world.context);

    constructor(public world: World) {
        super();

        this.volume    = new Vector3(2, 1, 1);
        const geometry = new BoxGeometry(world.context, this.volume.x, this.volume.y, this.volume.z);

        this.meshes.addMesh(new Mesh(geometry, new BasicMaterial(new Color(0xcccccc, 0.075))));
    }

    update(delta: DOMHighResTimeStamp) {
        this.fishes.forEach(fish => {
            fish.update(delta);
        });
    }

    addFish(position: Vector3): Fish {
        const fish = new Fish(this.world);
        // fish.position.assign(position);
        this.meshes.addMesh(fish.mesh);
        // this.fishes.push(fish);

        return fish;
    }

    updateTransformMatrix(): void {
        super.updateTransformMatrix();
        this.meshes.updateTransformMatrix();
        console.log(this.meshes.transform)
    }
}

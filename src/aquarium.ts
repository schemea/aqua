import {BoxGeometry, Color, DoubleSide, Mesh, MeshBasicMaterial, MeshPhysicalMaterial, Vector3} from "three";
import {Fish} from "./fish";
import {Element3D} from "./element";
import {Glass} from "./glass";

export class Aquarium extends Element3D {
    fishes: Fish[] = [];

    constructor() {
        super();

        this.volume = new Vector3(2, 1, 1);
        const geometry = new BoxGeometry(this.volume.x, this.volume.y, this.volume.z);
        const glassMaterial = new MeshPhysicalMaterial({
            color: new Color(0xffffff),
            transparent: true,
            opacity: 0.2,
            side: DoubleSide
        });

        const transparentMaterial = new MeshBasicMaterial({
            transparent: true,
            opacity: 0
        });

        // glassMaterial.emissive = new Color(0xffffff);
        // glassMaterial.emissiveIntensity = 0.1;

        for (const face of geometry.faces)
            face.materialIndex = 0;
        geometry.faces[4].materialIndex = 1;
        geometry.faces[5].materialIndex = 1;
        // console.log(geometry.faces[1]);

        this.mesh = new Mesh(geometry, [glassMaterial, transparentMaterial]);

    }

    outGlass(element: Element3D) {
        const bounds = this.bounds;
        const elBounds = element.bounds;

        if (elBounds.left < bounds.left)
            return Glass.LEFT;
        else if (elBounds.right > bounds.right)
            return Glass.RIGHT;
        else if (elBounds.bottom < bounds.bottom)
            return Glass.BOTTOM;
        else if (elBounds.top > bounds.top)
            return Glass.TOP;
        else if (elBounds.back < bounds.back)
            return Glass.BACK;
        else if (elBounds.front > bounds.front)
            return Glass.FRONT;
        else
            return Glass.NONE;
    }

    update(delta: DOMHighResTimeStamp) {
        this.fishes.forEach(fish => fish.update(delta));
    }

    addFish(...fishes: Fish[]) {
        this.fishes.push(...fishes);
    }
}

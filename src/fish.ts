// import {Element3D} from "./element";
// import {BoxBufferGeometry, Color, Mesh, MeshPhysicalMaterial, Vector3} from "three";
// import {Direction} from "./direction";
// import {World} from "./world";
//
// export class Fish extends Element3D {
//     following?: Fish;
//     speed = 0.3;
//     oldPosition!: Vector3;
//
//     get aquarium() {return this.world.aquarium;}
//
//     constructor(public world: World) {
//         super();
//         this.volume = new Vector3(0.05, 0.025, 0.025);
//         const geometry = new BoxBufferGeometry(this.volume.x, this.volume.y, this.volume.z);
//         const color = new Color(0x101050);
//         const material = new MeshPhysicalMaterial({color});
//         material.emissive = color;
//         material.emissiveIntensity = 0.05;
//         this.mesh = new Mesh(geometry, material);
//     }
//
//     update(delta: number) {
//         this.oldPosition = this.position.clone();
//         const maxEdge = Math.max(this.volume.x, this.volume.y, this.volume.z);
//         if (this.following) {
//             if (Vector.distanceTo(this.oldPosition, this.following.position) > maxEdge * 1.1) {
//                 this.movement = this.following.movement;
//                 this.movement = Vector.normalize(Vector.relativeTo(this.oldPosition, this.following.position));
//                 this.movement.multiplyScalar(this.speed);
//             }
//         } else {
//
//             this.aquarium.fishes.forEach(fish => {
//                 if (fish === this)
//                     return;
//
//                 const d = Vector.distanceTo(this.oldPosition, fish.position);
//
//                 if (d < maxEdge * 1.2) {
//                     this.movement = fish.movement;
//                 }
//             })
//         }
//
//         super.update(delta);
//
//         const direction = this.aquarium.contains(this);
//         if (direction !== Direction.NONE && this.movement) {
//             this.position.copy(this.oldPosition);
//             switch (direction) {
//                 case Direction.LEFT:
//                 case Direction.RIGHT:
//                     this.movement.setX(this.movement.x * -1);
//                     break;
//                 case Direction.TOP:
//                 case Direction.BOTTOM:
//                     this.movement.setY(this.movement.y * -1);
//                     break;
//                 case Direction.BACK:
//                 case Direction.FRONT:
//                     this.movement.setZ(this.movement.z * -1);
//                     break;
//             }
//         }
//     }
// }

import "../styles/main.scss"
import {Renderer} from "@webgl/renderer";
import {Mesh} from "@webgl/models/mesh";
import {BasicMaterial} from "@webgl/materials";
import {Color} from "@webgl/models/color";
import {BoxGeometry} from "@webgl/geometries/box";

// declare global{
//     interface Window {
//         world?: World;
//     }
// }
//
// const world = new World();
//
// document.body.appendChild(world.canvas);
// window.addEventListener("resize", () => {
//     world.resize(window.innerWidth, window.innerHeight);
// });
//
// world.resize(window.innerWidth, window.innerHeight);
//
// window.world = world;

const renderer = new Renderer(document.body);
const context = renderer.context;

renderer.enableDefaultFeatures();
renderer.resize(innerWidth, innerHeight);
renderer.clearColor(Color.BLACK);

renderer.clear();
const material = new BasicMaterial(new Color(0.1, 0.1, 0.5, 0.15));
const mesh = new Mesh(new BoxGeometry(context, 0.5, 0.5, 0.5), material);
// mesh.position.x = 0.5;

let previous = 0;
renderer.setRenderLoop(timestamp => {
    const elapsed = timestamp - previous;
    renderer.clear();
    if (elapsed > 20) {
        previous = timestamp;
        renderer.camera.position.x = Math.random() * 0.03 - 0.015;
        renderer.camera.position.y = Math.random() * 0.03 - 0.015;
    }
    renderer.camera.updateTransformMatrix();
    renderer.camera.updateViewMatrix();
    renderer.camera.updateWorldMatrix();
    mesh.position.x = Math.cos(timestamp * 0.0015) * 0.5;
    mesh.position.y = Math.sin(timestamp * 0.0015) * 0.5;
    mesh.rotate.x += 1;
    mesh.rotate.y += 1;
    // mesh.rotate.z += 1;
    // console.log(mesh.rotate.y);
    mesh.updateTransformMatrix();
    renderer.drawMesh(mesh);
});

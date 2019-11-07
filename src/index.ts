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

renderer.setRenderLoop(timestamp => {
    renderer.clear();
    mesh.rotate.y += 1;
    mesh.rotate.z += 1;
    mesh.updateTransformMatrix();
    renderer.drawMesh(mesh);
});

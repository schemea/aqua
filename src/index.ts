import "../styles/main.scss"
import {Renderer} from "@webgl/renderer";
import {Mesh} from "@webgl/models/mesh";
import {BasicMaterial} from "@webgl/materials";
import {Color} from "@webgl/models/color";
import {BoxGeometry} from "@webgl/geometries/box";
import {PerspectiveCamera} from "@webgl/cameras/perspective";

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

renderer.camera = new PerspectiveCamera(90, innerWidth / innerHeight, 0.0001, 1000);
renderer.setRenderLoop(timestamp => {
    renderer.clear();
    renderer.camera.position.z = 2 + Math.cos(timestamp * 0.0005);
    renderer.camera.rotate.x = Math.sin(timestamp * 0.0025) * 10;
    renderer.camera.updateTransformMatrix();
    renderer.camera.updateWorldMatrix();
    mesh.position.x = Math.cos(timestamp * 0.0015) * 0.5;
    mesh.position.y = Math.sin(timestamp * 0.0015) * 0.5;
    mesh.rotate.x += 1;
    mesh.rotate.y += 1;
    mesh.rotate.z += 0.25;
    mesh.updateTransformMatrix();
    renderer.drawMesh(mesh);
});

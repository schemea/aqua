import "../styles/main.scss"
import {Renderer} from "@webgl/renderer";
import {Mesh} from "@webgl/models/mesh";
import {BasicMaterial} from "@webgl/materials";
import {Color} from "@webgl/models/color";
import {BoxGeometry} from "@webgl/geometries/box";
import {PerspectiveCamera} from "@webgl/cameras/perspective";
import {Scene} from "@webgl/scene";
import {Matrix4} from "@webgl/matrix";

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

const scene = new Scene(context);

renderer.enableDefaultFeatures();
renderer.resize(innerWidth, innerHeight);
renderer.clearColor(Color.BLACK);

renderer.clear();
const material = new BasicMaterial(new Color(0.25, 0.25, 0.5, 0.15));
const mesh = new Mesh(new BoxGeometry(context, 0.5, 0.5, 0.5), material);

scene.addMesh(mesh);

renderer.camera = new PerspectiveCamera(90, innerWidth / innerHeight, 0.0001, 1000);
renderer.setRenderLoop(timestamp => {
    renderer.clear();
    renderer.camera.position.z = 2 + Math.cos(timestamp * 0.0005);
    renderer.camera.rotation = Matrix4.identity(4);
    renderer.camera.rotateX(Math.sin(timestamp * 0.0025) * 10);
    renderer.camera.updateViewMatrix();
    renderer.camera.updateWorldMatrix();
    mesh.position.x = Math.cos(timestamp * 0.0015) * 0.5;
    mesh.position.y = Math.sin(timestamp * 0.0015) * 0.5;
    mesh.rotateX(1);
    mesh.rotateY(1);
    mesh.rotateZ(0.25);
    mesh.updateTransformMatrix();
    renderer.drawScene(scene);
});

window.addEventListener("resize", () => {
    renderer.resize(innerWidth, innerHeight);
    (<PerspectiveCamera>renderer.camera).aspect = innerWidth / innerHeight;
    renderer.camera.updateProjectionMatrix();
    renderer.camera.updateWorldMatrix();
});

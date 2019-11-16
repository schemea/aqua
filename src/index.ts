import "../styles/main.scss"
import {World} from "@src/world";

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


// const renderer = new Renderer(document.body);
// const context = renderer.context;
//
// const scene = new Group(context);
//
// renderer.enableDefaultFeatures();
// renderer.resize(innerWidth, innerHeight);
// renderer.clearColor(Color.BLACK);
//
// renderer.clear();
// const material = new BasicMaterial(new Color(0.25, 0.25, 0.5, 0.35));
// const mesh = new Mesh(new BoxGeometry(context, 0.5, 0.5, 0.5), material);
//
// scene.addMesh(mesh);
//
// const camera = new PerspectiveCamera(50, innerWidth / innerHeight, 0.0001, 1000);
// const timeKeeper = new TimeKeeper();

// renderer.setRenderLoop(timestamp => {
//     timeKeeper.update(timestamp);
//
//     renderer.clear();
//     camera.position.z = 4 + Math.cos(timestamp * 0.0005) * 2.5;
//     camera.rotation = Matrix4.identity(4);
//     camera.rotateX(Math.sin(timestamp * 0.0025) * 10);
//     camera.updateViewMatrix();
//     camera.updateViewProjectionMatrix();
//     mesh.position.x = Math.cos(timestamp * 0.0015) * 0.5;
//     mesh.position.y = Math.sin(timestamp * 0.0015) * 0.5;
//     mesh.rotateX(0.06 * timeKeeper.elapsed());
//     mesh.rotateY(0.06 * timeKeeper.elapsed());
//     mesh.rotateZ(0.06 * 0.25 * timeKeeper.elapsed());
//     mesh.updateTransformMatrix();
//
//     renderer.drawGroup(scene, camera.viewProjection);
// });

// window.addEventListener("resize", () => {
//     renderer.resize(innerWidth, innerHeight);
//     camera.aspect = innerWidth / innerHeight;
//     camera.updateProjectionMatrix();
//     camera.updateViewProjectionMatrix();
// });
//
// document.addEventListener("click", ev => {
//     const x = ev.pageX * 2 / innerWidth - 1;
//     const y = ev.pageY * 2 / innerHeight - 1;
//
//     let vec = new Vector2(x, -y);
//     vec = camera.unproject(vec);
//     console.log(x, y);
//
//     const mesh = new Mesh(new BoxGeometry(context, 1, 1, 1), material);
//     mesh.position = <Vector3>vec;
//     mesh.rotation = camera.rotation.inverse();
//     mesh.updateTransformMatrix();
//     scene.addMesh(mesh);
// });

const world = new World();

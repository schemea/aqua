import "../styles/main.scss"
import {Renderer} from "@webgl/renderer";
import {Geometry} from "@webgl/geometry";
import {Mesh} from "@webgl/mesh";
import {MaterialBasic} from "@webgl/materials";
import {Color} from "@webgl/color";

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


const canvas = document.body.appendChild(document.createElement("canvas"));
const context = canvas.getContext("webgl");

// const vShader = new Shader(gl, gl.VERTEX_SHADER);
// const fShader = new Shader(gl, gl.FRAGMENT_SHADER);
// const program = new Program(gl);
//
// console.log(vShader);
// vShader.source = vertexShader;
// vShader.compile();
// fShader.source = fragShader;
// fShader.compile();
//
// program.attachShader(vShader);
// program.attachShader(fShader);
// program.link();
//
const positions = [
    0, 0, 0,
    0, 0.5, 0,
    0.7, 0, 0
];
// const geometry = new Geometry(gl, 3);
// geometry.vertices(positions);
// geometry.mode = gl.TRIANGLES;
//
// //
// // const posBuffer = new VertexBuffer(gl, gl.ARRAY_BUFFER);
// // posBuffer.mode = gl.TRIANGLES;
// // posBuffer.bind();
// // const posLoc = new VertexAttribute(program,"position", 2);
// // posBuffer.length = 3;
// // posBuffer.data(new Float32Array(positions), gl.STATIC_DRAW);
// gl.viewport(0, 0, canvas.width, canvas.height);
// gl.clearColor(0, 0, 0, 1);
// gl.clear(gl.COLOR_BUFFER_BIT);
//
//
// // posBuffer.bind();
// // posLoc.enable();
// // posLoc.bind();
// const renderer = new Renderer(gl);
// // renderer.drawVertexBuffer(posBuffer);
// renderer.drawGeometry(geometry, program);
// // posBuffer.release();
// vShader.release();
// fShader.release();
// program.release();

const renderer = new Renderer(context);
renderer.resize(innerWidth, innerHeight);
renderer.clearColor(Color.BLACK);
renderer.clear(context.COLOR_BUFFER_BIT);
const geometry = new Geometry(context, 3);
geometry.vertices(positions);
geometry.mode = context.TRIANGLES;
const material = new MaterialBasic(new Color(0.1, 0.1, 0.5, 0.5));
const mesh = new Mesh(geometry, material);
renderer.drawMesh(mesh);

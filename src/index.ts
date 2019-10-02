import "../styles/main.scss"
import {World} from "./world";

declare global{
    interface Window {
        world?: World;
    }
}

const world = new World();

document.body.appendChild(world.canvas);
window.addEventListener("resize", () => {
    world.resize(window.innerWidth, window.innerHeight);
});

world.resize(window.innerWidth, window.innerHeight);

window.world = world;

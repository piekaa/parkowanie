import PiekoszekEngine from '/js/engine/PiekoszekEngine.js'
import Bus from "./Bus.js";
import StandingBus from "./StandingBus.js";
import Collider from "../engine/Collider.js";
import Vector from "../engine/Vector.js";

const game = new PiekoszekEngine(document.getElementById("canvas"));

const bus = game.createSprite("/assets/bus/bus.png", Bus,
    {
        x: 200,
        y: 300,
        sx: 0.5,
        sy: 0.5
    });

const standingBus = game.createSprite("/assets/bus/bus.png", StandingBus,
    {
        x: 500,
        y: 200,
        sx: 0.5,
        sy: 0.5,
    });
standingBus.addWheels("/assets/bus/wheel.png");
standingBus.addLights("/assets/bus/lightMask.png");

const standingBus2 = game.createSprite("/assets/bus/bus.png", StandingBus,
    {
        x: 500,
        y: 350,
        sx: 0.5,
        sy: 0.5,
    });
standingBus2.addWheels("/assets/bus/wheel.png");
standingBus2.addLights("/assets/bus/lightMask.png");
standingBus2.angle = 30;


const collider = new Collider(
    [
        new Vector(1, 1),
        new Vector(1, 79),
        new Vector(399, 79),
        new Vector(399, 1),
    ]);


bus.addWheels("/assets/bus/wheel.png");
bus.moving = true;
bus.addCollider(collider.copy());
standingBus.addCollider(collider.copy());
standingBus2.addCollider(collider.copy());

const cameraZoomSpeed = 0.03;
const minCamera = 0.45;
const maxCamera = 4;

game.addBehaviour((params) => {
    if (params.keyDown("q")) {
        game.camera.sx -= cameraZoomSpeed;
        game.camera.sy -= cameraZoomSpeed;
        if (game.camera.sx < minCamera) {
            game.camera.sx = minCamera;
            game.camera.sy = minCamera;
        }
    }
    if (params.keyDown("e")) {
        game.camera.sx += cameraZoomSpeed;
        game.camera.sy += cameraZoomSpeed;
        if (game.camera.sx > maxCamera) {
            game.camera.sx = maxCamera;
            game.camera.sy = maxCamera;
        }
    }
})

game.camera.follow(bus);
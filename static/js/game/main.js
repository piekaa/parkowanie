import PiekoszekEngine from '/js/engine/2d.js'
import Bus from "./Bus.js";
import StandingBus from "./StandingBus.js";

const game = new PiekoszekEngine(document.getElementById("canvas"));

const bus = game.createSprite("/assets/bus/bus.png", Bus);
bus.x = 200;
bus.y = 300;
bus.sx = 0.5;
bus.sy = 0.5;
bus.addWheels("/assets/bus/wheel.png");


const standingBus = game.createSprite("/assets/bus/bus.png", StandingBus);
standingBus.x = 500;
standingBus.y = 200;
standingBus.sx = 0.5;
standingBus.sy = 0.5;
standingBus.addWheels("/assets/bus/wheel.png");

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
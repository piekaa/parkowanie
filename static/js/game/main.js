import PiekoszekEngine from '/js/engine/2d.js'
import Bus from "./Bus.js";
import StandingBus from "./StandingBus.js";
import Sprite from "../engine/Sprite.js";
import Vector from "../engine/Vector.js";

const game = new PiekoszekEngine(document.getElementById("canvas"));

const standingBus = game.createSprite("/assets/bus/bus.png", StandingBus,
    {
        x: 500,
        y: 200,
        sx: 0.5,
        sy: 0.5
    });
standingBus.addWheels("/assets/bus/wheel.png");

const bus = game.createSprite("/assets/bus/bus.png", Bus,
    {
        x: 200,
        y: 300,
        sx: 0.5,
        sy: 0.5
    });
bus.addWheels("/assets/bus/wheel.png");

const cameraZoomSpeed = 0.03;
const minCamera = 0.45;
const maxCamera = 4;


const topRight = game.createSprite("/assets/bus/wheel.png", Sprite, {
    x: 900,
    y: 900,
})

game.createSprite("/assets/bus/wheel.png", Sprite, {
    x: 700,
    y: 900,
})

const leftBottom = game.createSprite("/assets/bus/wheel.png", Sprite, {
    x: 700,
    y: 400,
})

game.createSprite("/assets/bus/wheel.png", Sprite, {
    x: 900,
    y: 400,
})

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

    const mouse = params.mouse();
    if (mouse.mouseJustPressed) {

        const botToMouse = Vector.Direction(leftBottom.wx, leftBottom.wy, mouse.wx, mouse.wy);
        const topToMouse = Vector.Direction(topRight.wx, topRight.wy, mouse.wx, mouse.wy);

        // console.log("Bot:");
        // botToMouse.display();
        //
        // console.log("Top:");
        // topToMouse.display();

        console.log(`Dot: ${botToMouse.dot(topToMouse)}`);

    }

})

game.camera.follow(bus);
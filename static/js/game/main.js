import PiekoszekEngine from '/js/engine/2d.js'
import Bus from "./Bus.js";
import StandingBus from "./StandingBus.js";
import Sprite from "../engine/Sprite.js";

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

const topLeft = game.createSprite("/assets/bus/wheel.png", Sprite, {
    x: 700,
    y: 900,
})

const botLeft = game.createSprite("/assets/bus/wheel.png", Sprite, {
    x: 700,
    y: 400,
})

const botRight = game.createSprite("/assets/bus/wheel.png", Sprite, {
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

        const mouseVector = mouse.mouseWorldVector;

        const left = topLeft.worldPositionVector().mid(botLeft);
        const right = topRight.worldPositionVector().mid(botRight);

        const leftToMouse = left.direction(mouseVector);
        const rightToMouse = right.direction(mouseVector);

        rightToMouse.display();

        console.log(`Dot: ${leftToMouse.dot(rightToMouse)}`);

    }

})

game.camera.follow(bus);
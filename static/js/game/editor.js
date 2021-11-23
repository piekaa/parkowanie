import PiekoszekEngine from '/js/engine/PiekoszekEngine.js'
import Collider from "../engine/Collider.js";
import Vector from "../engine/Vector.js";
import EditorBus from "./EditorBus.js";

const game = new PiekoszekEngine(document.getElementById("canvas"), () => {

    const cameraSpeed = 5;
    const cameraZoomSpeed = 0.03;
    const minCamera = 0.45;
    const maxCamera = 4;

    game.addBehaviour((params) => {

        if (params.keyDown("w")) {
            game.camera.y += cameraSpeed;
        }
        if (params.keyDown("s")) {
            game.camera.y -= cameraSpeed;
        }

        if (params.keyDown("a")) {
            game.camera.x -= cameraSpeed;
        }
        if (params.keyDown("d")) {
            game.camera.x += cameraSpeed;
        }

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

        const lastPressed = window.lastPressedSprite;
        if (lastPressed !== undefined) {
        }

        if (params.keyDownThisFrame("n")) {
            addBus(params.screenRect);
        }
    });
});

const collider = new Collider(
    [
        new Vector(1, 1),
        new Vector(1, 79),
        new Vector(399, 79),
        new Vector(399, 1),
    ]);

function addBus(rect) {
    const standingBus = game.createSprite("/assets/bus/bus.png", EditorBus,
        {
            x: (game.camera.wx + rect.width / 2) / game.camera.sx,
            y: (game.camera.wy + rect.height / 2) / game.camera.sy,
            sx: 0.5,
            sy: 0.5,
        });
    const currentCollider = collider.copy();
    standingBus.addWheels("/assets/bus/wheel.png");
    standingBus.addCollider(currentCollider);
}
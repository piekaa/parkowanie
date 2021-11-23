import PiekoszekEngine from '/js/engine/PiekoszekEngine.js'
import Collider from "../engine/Collider.js";
import Vector from "../engine/Vector.js";
import Serializer from "../engine/Serializer.js";
import StandingBus from "./StandingBus.js";
import EditorTransformer from "./EditorTransformer.js";
import Bus from "./Bus.js";

window.onload = () => {
    document.getElementById("try").onclick = () => {
        window.open(`/?level=${encodeURIComponent(document.getElementById("serialized").value)}`, '_blank').focus();
    };
};

const game = new PiekoszekEngine(document.getElementById("canvas"), () => {

    const cameraSpeed = 5;
    const cameraZoomSpeed = 0.03;
    const minCamera = 0.45;
    const maxCamera = 4;

    const playerBus = addBus(Bus);
    playerBus.setColor([1, 1, 1, 1]);
    playerBus.x = 100;
    playerBus.y = 350;
    playerBus.moving = true;

    let items = [];

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
            items.push(addBus(StandingBus, params.screenRect));
        }

        if (params.keyDownThisFrame("k")) {
            document.getElementById("serialized").value = Serializer.SerializeToString([playerBus, ...items]);
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

function addBus(Type, rect = {width: 0, height: 0}) {

    const colors = [
        [0.4, 0.1, 0.11, 1],
        [0.1, 0.4, 0.1, 1],
        [0.08, 0.25, 0.3, 1],
        [0.36, 0.18, 0.01, 1],
        [0.36, 0.01, 0.01, 1],
        [0.06, 0.01, 0.50, 1]
    ];

    const bus = game.createSprite("/assets/bus/bus-colors.png", Type,
        {
            x: (game.camera.wx + rect.width / 2) / game.camera.sx,
            y: (game.camera.wy + rect.height / 2) / game.camera.sy,
            sx: 0.5,
            sy: 0.5,
        });
    bus.afterInit = () => {
        bus.loadWhite("/assets/bus/bus-white.png");
        bus.addWheels("/assets/bus/wheel.png");
        bus.addLights("/assets/bus/lightMask.png");
    }

    const currentCollider = collider.copy();
    bus.addCollider(currentCollider);
    bus.setColor(colors[Math.floor(Math.random() * colors.length)]);
    EditorTransformer.Transform(bus);

    return bus;
}
import PiekoszekEngine from '/js/engine/PiekoszekEngine.js'
import Serializer from "../engine/Serializer.js";
import StandingBus from "./StandingBus.js";
import EditorTransformer from "./EditorTransformer.js";
import PlayerControlledBus from "./PlayerControlledBus.js";
import Trailer from "./Trailer.js";
import TrailerParking from "./TrailerParking.js";

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

    const playerBus = addBus(PlayerControlledBus);
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

        if (params.keyDownThisFrame("m")) {
            items.unshift(addTrailerParking(params.screenRect));
            items.push(addTrailer(params.screenRect));
        }

        if (params.keyDownThisFrame("k")) {
            document.getElementById("serialized").value = Serializer.SerializeToString([...items, playerBus]);
        }
    });
});

function addBus(Type, rect = {width: 0, height: 0}) {

    const busColors = [
        [0.4, 0.1, 0.11, 1],
        [0.1, 0.4, 0.1, 1],
        [0.08, 0.25, 0.3, 1],
        [0.36, 0.18, 0.01, 1],
        [0.36, 0.01, 0.01, 1],
        [0.06, 0.01, 0.50, 1]
    ];

    const bus = game.createSprite("/assets/bus/bus.png", Type,
        {
            x: (game.camera.wx + rect.width / 2) / game.camera.sx,
            y: (game.camera.wy + rect.height / 2) / game.camera.sy,
            sx: 0.5,
            sy: 0.5,
        });
    bus.addLights("/assets/bus/lightMask.png");
    bus.setColor(busColors[Math.floor(Math.random() * busColors.length)]);
    EditorTransformer.Transform(bus);
    return bus;
}

let trailerColorIndex = 0;
const trailerColors = [
    [0.6, 0.8, 0.4, 1],
    [0.3, 0.3, 0.6, 1],
    [0.0, 0.7, 0.7, 1],
    [0.0, 0.7, 0, 1],
    [0.7, 0, 0, 1],
];

function addTrailer(rect) {
    const trailer = game.createSprite("/assets/bus/trailer.png", Trailer,
        {
            x: (game.camera.wx + rect.width / 2) / game.camera.sx,
            y: (game.camera.wy + rect.height / 2) / game.camera.sy,
            sx: 0.5,
            sy: 0.5,
            color: trailerColors[trailerColorIndex++]
        });
    trailer.addLights("/assets/bus/lightMask.png");
    EditorTransformer.Transform(trailer);
    return trailer;
}

function addTrailerParking(rect) {
    const trailerParking = game.createSprite("/assets/bus/parking.png", TrailerParking,
        {
            x: (game.camera.wx + rect.width / 2) / game.camera.sx,
            y: (game.camera.wy + rect.height / 2) / game.camera.sy + 100,
            sx: 0.5,
            sy: 0.5,
            color: trailerColors[trailerColorIndex]
        });
    EditorTransformer.Transform(trailerParking);
    return trailerParking;
}
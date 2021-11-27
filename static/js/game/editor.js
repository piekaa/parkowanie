import Serializer from "../engine/Serializer.js";
import StandingBus from "./StandingBus.js";
import EditorTransformer from "./EditorTransformer.js";
import PlayerControlledBus from "./PlayerControlledBus.js";
import Trailer from "./Trailer.js";
import TrailerParking from "./TrailerParking.js";
import BusParking from "./BusParking.js";
import LevelLoader from "../engine/LevelLoader.js";

window.onload = () => {
    document.getElementById("try").onclick = () => {
        window.open(`/?level=${encodeURIComponent(document.getElementById("serialized").value)}`, '_blank').focus();
    };

    document.getElementById("load").onclick = () => {
        window.location.href = `/edytor.html?level=${encodeURIComponent(document.getElementById("serialized").value)}`;
    };
};

const levelParam = new URLSearchParams(window.location.search).get("level");

let level = `{"items":[{"x":519,"y":246.796875,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"BusParking","imagePath":"/assets/bus/parking.png","moving":false},{"x":471,"y":329.796875,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"PlayerControlledBus","imagePath":"/assets/bus/bus.png","moving":true,"lightsImage":"/assets/bus/lightMask.png"}]}`;

if (levelParam !== null) {
    level = decodeURIComponent(levelParam);
}

let items = [];


LevelLoader.Load(document.getElementById("canvas"),
    level, [
        PlayerControlledBus, StandingBus, BusParking, TrailerParking, Trailer
    ], (game) => {


        game.forEachSprite((sprite) => {
            items.push(sprite);
            EditorTransformer.Transform(sprite);
        });

        game.addBehaviour((params) => {

            const cameraSpeed = 5;
            const cameraZoomSpeed = 0.03;
            const minCamera = 0.45;
            const maxCamera = 4;

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
                items.push(addStandingBus(params.screenRect));
            }

            if (params.keyDownThisFrame("m")) {
                items.unshift(addTrailerParking(params.screenRect));
                items.push(addTrailer(params.screenRect));
            }

            if (params.keyDownThisFrame("k")) {
                document.getElementById("serialized").value = Serializer.SerializeToString(items);
            }
        });


        function addStandingBus(rect) {
            const busImages = [
                "/assets/bus/bus-1.png",
                "/assets/bus/bus-2.png",
                "/assets/bus/bus-3.png",
                "/assets/bus/bus-4.png",
                "/assets/bus/bus-5.png",
            ];
            return addBus(StandingBus, busImages[Math.floor(Math.random() * busImages.length)], rect)
        }

        function addBus(Type, imagePath, rect = {width: 0, height: 0}) {
            const bus = game.createSprite(imagePath, Type,
                {
                    x: (game.camera.wx + rect.width / 2) / game.camera.sx,
                    y: (game.camera.wy + rect.height / 2) / game.camera.sy,
                    sx: 0.5,
                    sy: 0.5,
                });
            bus.addLights("/assets/bus/lightMask.png");
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
    });
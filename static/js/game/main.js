import Bus from "./Bus.js";
import StandingBus from "./StandingBus.js";
import LevelLoader from "../engine/LevelLoader.js";


const levelParam = new URLSearchParams(window.location.search).get("level");

let level = `{"items":[{"x":100,"y":350,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"Bus","imagePath":"/assets/bus/bus.png","moving":true,"colliders":[[{"x":1,"y":1},{"x":1,"y":79},{"x":399,"y":79},{"x":399,"y":1}]],"wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":810.9814082278482,"y":255.72557357594934,"sx":0.5,"sy":0.5,"angle":9.946129281374075,"color":[0.05999999865889549,0.009999999776482582,0.5,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"colliders":[[{"x":1,"y":1},{"x":1,"y":79},{"x":399,"y":79},{"x":399,"y":1}]],"wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":593,"y":370.796875,"sx":0.5,"sy":0.5,"angle":0,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"colliders":[[{"x":1,"y":1},{"x":1,"y":79},{"x":399,"y":79},{"x":399,"y":1}]],"wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":800,"y":369.796875,"sx":0.5,"sy":0.5,"angle":7.877967404612986,"color":[0.10000000149011612,0.4000000059604645,0.10000000149011612,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"colliders":[[{"x":1,"y":1},{"x":1,"y":79},{"x":399,"y":79},{"x":399,"y":1}]],"wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":584.3991297468355,"y":260.78886471518985,"sx":0.5,"sy":0.5,"angle":0,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"colliders":[[{"x":1,"y":1},{"x":1,"y":79},{"x":399,"y":79},{"x":399,"y":1}]],"wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1028.87181122449,"y":310.5176977040816,"sx":0.5,"sy":0.5,"angle":27.3487433093201,"color":[0.10000000149011612,0.4000000059604645,0.10000000149011612,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"colliders":[[{"x":1,"y":1},{"x":1,"y":79},{"x":399,"y":79},{"x":399,"y":1}]],"wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1153.3616071428578,"y":457.45647321428584,"sx":0.5,"sy":0.5,"angle":93.33066592273866,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"colliders":[[{"x":1,"y":1},{"x":1,"y":79},{"x":399,"y":79},{"x":399,"y":1}]],"wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":955.402423469388,"y":602.3544323979595,"sx":0.5,"sy":0.5,"angle":0,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"colliders":[[{"x":1,"y":1},{"x":1,"y":79},{"x":399,"y":79},{"x":399,"y":1}]],"wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":862.0841346153846,"y":591.9791380494505,"sx":0.5,"sy":0.5,"angle":-131.06543053489963,"color":[0.07999999821186066,0.25,0.30000001192092896,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"colliders":[[{"x":1,"y":1},{"x":1,"y":79},{"x":399,"y":79},{"x":399,"y":1}]],"wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":589.462420886076,"y":467.11797863924056,"sx":0.5,"sy":0.5,"angle":0,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"colliders":[[{"x":1,"y":1},{"x":1,"y":79},{"x":399,"y":79},{"x":399,"y":1}]],"wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"}]}`;

if (levelParam !== null) {
    level = decodeURIComponent(levelParam);
}


LevelLoader.Load(document.getElementById("canvas"),
    level,
    [Bus, StandingBus],
    (game) => {
        const bus = game.getSpriteByType(Bus);
        game.camera.follow(bus);

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
        });

    });

//
// const game = new PiekoszekEngine(document.getElementById("canvas"), () => {
//
//     const bus = game.createSprite("/assets/bus/bus.png", Bus,
//         {
//             x: 200,
//             y: 300,
//             sx: 0.5,
//             sy: 0.5
//         });
//
//     const standingBus = game.createSprite("/assets/bus/bus.png", StandingBus,
//         {
//             x: 500,
//             y: 200,
//             sx: 0.5,
//             sy: 0.5,
//         });
//     standingBus.addWheels("/assets/bus/wheel.png");
//     standingBus.addLights("/assets/bus/lightMask.png");
//
//     const standingBus2 = game.createSprite("/assets/bus/bus.png", StandingBus,
//         {
//             x: 500,
//             y: 350,
//             sx: 0.5,
//             sy: 0.5,
//         });
//     standingBus2.addWheels("/assets/bus/wheel.png");
//     standingBus2.addLights("/assets/bus/lightMask.png");
//     standingBus2.angle = 30;
//
//
//     const collider = new Collider(
//         [
//             new Vector(1, 1),
//             new Vector(1, 79),
//             new Vector(399, 79),
//             new Vector(399, 1),
//         ]);
//
//
//     bus.addWheels("/assets/bus/wheel.png");
//     bus.moving = true;
//     bus.addCollider(collider.copy());
//     standingBus.addCollider(collider.copy());
//     standingBus2.addCollider(collider.copy());
//
//     standingBus.setColor([0.4, 0.1, 0.11, 1]);
//     standingBus2.setColor([0.1, 0.4, 0.1, 1]);
//
//
//     const cameraZoomSpeed = 0.03;
//     const minCamera = 0.45;
//     const maxCamera = 4;
//
//     game.addBehaviour((params) => {
//         if (params.keyDown("q")) {
//             game.camera.sx -= cameraZoomSpeed;
//             game.camera.sy -= cameraZoomSpeed;
//             if (game.camera.sx < minCamera) {
//                 game.camera.sx = minCamera;
//                 game.camera.sy = minCamera;
//             }
//         }
//         if (params.keyDown("e")) {
//             game.camera.sx += cameraZoomSpeed;
//             game.camera.sy += cameraZoomSpeed;
//             if (game.camera.sx > maxCamera) {
//                 game.camera.sx = maxCamera;
//                 game.camera.sy = maxCamera;
//             }
//         }
//     });
//
//     game.camera.follow(bus);
// });
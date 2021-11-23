import Bus from "./Bus.js";
import StandingBus from "./StandingBus.js";
import LevelLoader from "../engine/LevelLoader.js";


const levelParam = new URLSearchParams(window.location.search).get("level");

let level = decodeURIComponent(levelParam) || `{"items":[{"x":55,"y":330.5,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"Bus","imagePath":"/assets/bus/bus.png","wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":244,"y":422.296875,"sx":0.5,"sy":0.5,"angle":0,"color":[0.07999999821186066,0.25,0.30000001192092896,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":466.9202544511536,"y":434.70051499633837,"sx":0.5,"sy":0.5,"angle":25.719105714367974,"color":[0.10000000149011612,0.4000000059604645,0.10000000149011612,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":562.3018375501669,"y":429.3710621114722,"sx":0.5,"sy":0.5,"angle":-149.4964909260942,"color":[0.4000000059604645,0.10000000149011612,0.10999999940395355,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":590.7446733634467,"y":394.1869246521993,"sx":0.5,"sy":0.5,"angle":23.0146270775355,"color":[0.4000000059604645,0.10000000149011612,0.10999999940395355,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":655.0946180555555,"y":565.7838541666667,"sx":0.5,"sy":0.5,"angle":0,"color":[0.07999999821186066,0.25,0.30000001192092896,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":886.770020206954,"y":341.49560352242014,"sx":0.5,"sy":0.5,"angle":56.139366039392534,"color":[0.07999999821186066,0.25,0.30000001192092896,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":884.4965581014928,"y":566.3737268205592,"sx":0.5,"sy":0.5,"angle":33.573746001225516,"color":[0.4000000059604645,0.10000000149011612,0.10999999940395355,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1044.5553195854457,"y":489.7771205276746,"sx":0.5,"sy":0.5,"angle":71.7898147126516,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":698.3159512302602,"y":208.28437945118068,"sx":0.5,"sy":0.5,"angle":34.24824616220976,"color":[0.07999999821186066,0.25,0.30000001192092896,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","wheelImagePath":"/assets/bus/wheel.png","lightMaskImagePath":"/assets/bus/lightMask.png"}]}`;

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
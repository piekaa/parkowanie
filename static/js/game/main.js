import StandingBus from "./StandingBus.js";
import LevelLoader from "../engine/LevelLoader.js";
import PlayerControlledBus from "./PlayerControlledBus.js";
import Trailer from "./Trailer.js";


const levelParam = new URLSearchParams(window.location.search).get("level");

let level = `{"items":[{"x":100,"y":350,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"PlayerControlledBus","imagePath":"/assets/bus/bus.png","moving":true,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":-134.33333333333326,"y":349.850615530303,"sx":0.55,"sy":0.55,"angle":0,"color":[1,1,1,1],"type":"Trailer","imagePath":"/assets/bus/trailer.png","moving":true},{"x":-378.7272727272727,"y":348.3354640151515,"sx":0.55,"sy":0.55,"angle":0,"color":[1,1,1,1],"type":"Trailer","imagePath":"/assets/bus/trailer.png","moving":true},{"x":638.4444444444445,"y":427.5060763888889,"sx":0.5,"sy":0.5,"angle":90.87174497215535,"color":[0.36000001430511475,0.18000000715255737,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":631.7777777777778,"y":640.8394097222223,"sx":0.5,"sy":0.5,"angle":91.8953593479395,"color":[0.4000000059604645,0.10000000149011612,0.10999999940395355,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":638.4444444444445,"y":225.28385416666669,"sx":0.5,"sy":0.5,"angle":92.3781734249597,"color":[0.05999999865889549,0.009999999776482582,0.5,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":634,"y":16.394965277777814,"sx":0.5,"sy":0.5,"angle":88.7708619412043,"color":[0.36000001430511475,0.18000000715255737,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":625.1111111111111,"y":843.0616319444446,"sx":0.5,"sy":0.5,"angle":90.71220984568458,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1097.3333333333333,"y":583.0616319444446,"sx":0.5,"sy":0.5,"angle":0,"color":[0.10000000149011612,0.4000000059604645,0.10000000149011612,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1092.888888888889,"y":394.1727430555556,"sx":0.5,"sy":0.5,"angle":0,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1303.9999999999998,"y":549.7282986111111,"sx":0.5,"sy":0.5,"angle":0,"color":[0.4000000059604645,0.10000000149011612,0.10999999940395355,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1301.7777777777776,"y":429.72829861111114,"sx":0.5,"sy":0.5,"angle":0,"color":[0.05999999865889549,0.009999999776482582,0.5,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1506.7777777777776,"y":549.7282986111111,"sx":0.5,"sy":0.5,"angle":0,"color":[0.05999999865889549,0.009999999776482582,0.5,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1508.9999999999998,"y":429.72829861111114,"sx":0.5,"sy":0.5,"angle":0,"color":[0.36000001430511475,0.18000000715255737,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1713.4444444444443,"y":429.72829861111114,"sx":0.5,"sy":0.5,"angle":0,"color":[0.05999999865889549,0.009999999776482582,0.5,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1711.2222222222222,"y":549.7282986111111,"sx":0.5,"sy":0.5,"angle":0,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1897.8888888888887,"y":543.0616319444445,"sx":0.5,"sy":0.5,"angle":-90.14483047681601,"color":[0.36000001430511475,0.18000000715255737,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"}]}`;

if (levelParam !== null) {
    level = decodeURIComponent(levelParam);
}


LevelLoader.Load(document.getElementById("canvas"),
    level,
    [PlayerControlledBus, StandingBus, Trailer],
    (game) => {
        const bus = game.getSpriteByType(PlayerControlledBus);
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

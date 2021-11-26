import StandingBus from "./StandingBus.js";
import LevelLoader from "../engine/LevelLoader.js";
import PlayerControlledBus from "./PlayerControlledBus.js";
import Trailer from "./Trailer.js";
import TrailerParking from "./TrailerParking.js";


const levelParam = new URLSearchParams(window.location.search).get("level");

let level = `{"items":[{"x":297,"y":353.796875,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"PlayerControlledBus","imagePath":"/assets/bus/bus.png","moving":true,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":73,"y":353.796875,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"Trailer","imagePath":"/assets/bus/trailer.png","moving":true},{"x":-141,"y":351.796875,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"Trailer","imagePath":"/assets/bus/trailer.png","moving":true},{"x":638.150568181818,"y":469.21377840909093,"sx":0.5,"sy":0.5,"angle":90.53273762846075,"color":[0.07999999821186066,0.25,0.30000001192092896,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":645.4232954545454,"y":680.122869318182,"sx":0.5,"sy":0.5,"angle":88.48447467085805,"color":[0.36000001430511475,0.18000000715255737,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":645.3854166666667,"y":894.7282986111112,"sx":0.5,"sy":0.5,"angle":91.34503263783843,"color":[0.36000001430511475,0.18000000715255737,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":645.3854166666667,"y":1112.506076388889,"sx":0.5,"sy":0.5,"angle":90.65310680446844,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1440.9409722222224,"y":614.7282986111112,"sx":0.5,"sy":0.5,"angle":0,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1434.2743055555557,"y":483.6171875,"sx":0.5,"sy":0.5,"angle":0,"color":[0.10000000149011612,0.4000000059604645,0.10000000149011612,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1234.2743055555557,"y":614.7282986111112,"sx":0.5,"sy":0.5,"angle":0,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1227.6076388888891,"y":481.3949652777778,"sx":0.5,"sy":0.5,"angle":0,"color":[0.4000000059604645,0.10000000149011612,0.10999999940395355,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1129.829861111111,"y":643.6171875000001,"sx":0.5,"sy":0.5,"angle":144.54810613531947,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1016.4965277777778,"y":479.1727430555556,"sx":0.5,"sy":0.5,"angle":0,"color":[0.36000001430511475,0.18000000715255737,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1647.6076388888891,"y":619.1727430555557,"sx":0.5,"sy":0.5,"angle":0,"color":[0.36000001430511475,0.009999999776482582,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1645.3854166666667,"y":485.83940972222223,"sx":0.5,"sy":0.5,"angle":0,"color":[0.36000001430511475,0.18000000715255737,0.009999999776482582,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"},{"x":1832.0520833333335,"y":503.6171875,"sx":0.5,"sy":0.5,"angle":91.67024321598142,"color":[0.05999999865889549,0.009999999776482582,0.5,1],"type":"StandingBus","imagePath":"/assets/bus/bus.png","moving":false,"lightMaskImagePath":"/assets/bus/lightMask.png"}]}`;

if (levelParam !== null) {
    level = decodeURIComponent(levelParam);
}


LevelLoader.Load(document.getElementById("canvas"),
    level,
    [PlayerControlledBus,
        StandingBus,
        Trailer,
        TrailerParking],
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

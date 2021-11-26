import StandingBus from "./StandingBus.js";
import LevelLoader from "../engine/LevelLoader.js";
import PlayerControlledBus from "./PlayerControlledBus.js";
import Trailer from "./Trailer.js";
import TrailerParking from "./TrailerParking.js";
import GameController from "./GameController.js";
import CameraController from "./CameraController.js";
import BusParking from "./BusParking.js";


const levelParam = new URLSearchParams(window.location.search).get("level");

let level = `{"items":[{"x":1327.8168512658228,"y":532.1179786392405,"sx":0.5,"sy":0.5,"angle":0,"color":[0.30000001192092896,0.30000001192092896,0.6000000238418579,1],"type":"TrailerParking","imagePath":"/assets/bus/parking.png","moving":false},{"x":1495.8247282608702,"y":378.960258152174,"sx":0.5,"sy":0.5,"angle":0,"color":[0.6000000238418579,0.800000011920929,0.4000000059604645,1],"type":"TrailerParking","imagePath":"/assets/bus/parking.png","moving":false},{"x":635.5937500000001,"y":319.39843750000006,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-3.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":1067.5638586956525,"y":318.0906929347826,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-3.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":1271.9116847826092,"y":313.7428668478261,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-5.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":1482.7812500000007,"y":313.7428668478261,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-1.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":1041.7409018987341,"y":540.9787381329114,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-4.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":682.7812499999998,"y":113.74286684782591,"sx":0.5,"sy":0.5,"angle":0,"color":[0.6000000238418579,0.800000011920929,0.4000000059604645,1],"type":"Trailer","imagePath":"/assets/bus/trailer.png","moving":true,"lightsImage":"/assets/bus/lightMask.png"},{"x":1671.9116847826094,"y":337.655910326087,"sx":0.5,"sy":0.5,"angle":91.88516934202964,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-3.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":1478.4334239130442,"y":459.61243206521743,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-2.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":1265.3899456521742,"y":463.96025815217394,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-1.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":1050.1725543478262,"y":466.13417119565224,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-2.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":945.8247282608696,"y":492.22112771739137,"sx":0.5,"sy":0.5,"angle":145.38334555852958,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-4.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":527.7812499999998,"y":333.5254755434782,"sx":0.5,"sy":0.5,"angle":163.63539941500392,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-1.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":392.1290760869563,"y":468.0906929347825,"sx":0.5,"sy":0.5,"angle":95.22250469398293,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-2.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":387.7812499999998,"y":681.1341711956522,"sx":0.5,"sy":0.5,"angle":91.7396140441088,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-3.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":385.60733695652146,"y":909.3950407608698,"sx":0.5,"sy":0.5,"angle":89.97645434085476,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-1.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":396.4769021739128,"y":1131.1341711956527,"sx":0.5,"sy":0.5,"angle":91.74366981961643,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-2.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":885.7779017857142,"y":115.64704241071432,"sx":0.5,"sy":0.5,"angle":0,"color":[0.30000001192092896,0.30000001192092896,0.6000000238418579,1],"type":"Trailer","imagePath":"/assets/bus/trailer.png","moving":true,"lightsImage":"/assets/bus/lightMask.png"},{"x":1507.5636867088608,"y":539.7129153481013,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-2.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":848.0700158227847,"y":318.1939280063291,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"StandingBus","imagePath":"/assets/bus/bus-2.png","moving":false,"lightsImage":"/assets/bus/lightMask.png"},{"x":100,"y":350,"sx":0.5,"sy":0.5,"angle":0,"color":[1,1,1,1],"type":"PlayerControlledBus","imagePath":"/assets/bus/bus.png","moving":true,"lightsImage":"/assets/bus/lightMask.png"}]}`;

if (levelParam !== null) {
    level = decodeURIComponent(levelParam);
}


LevelLoader.Load(document.getElementById("canvas"),
    level,
    [PlayerControlledBus,
        StandingBus,
        Trailer,
        TrailerParking,
        BusParking],
    (game) => {
        const bus = game.getSpriteByType(PlayerControlledBus);
        game.camera.follow(bus);
        GameController.playerBus = bus;
        GameController.start();
        CameraController.setup(game);
    });

import CameraController from "./CameraController.js";
import LevelLoader from "../engine/LevelLoader.js";

class GameController {

    static playerBus;

    static restart() {
        this.playerBus.update = () => {};
        CameraController.zoomOutToShowCollision();
        LevelLoader.restart(3000);
    }

}

export default GameController
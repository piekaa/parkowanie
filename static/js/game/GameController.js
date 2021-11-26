import CameraController from "./CameraController.js";
import LevelLoader from "../engine/LevelLoader.js";

class GameController {

    static playerBus;

    static restarting = false;

    static start() {
        GameController.restarting = false;
    }

    static restart() {
        if (GameController.restarting) {
            return;
        }
        GameController.restarting = true;
        this.playerBus.update = () => {
        };
        CameraController.zoomOutToShowCollision();
        LevelLoader.restart(3000);
    }

}

export default GameController
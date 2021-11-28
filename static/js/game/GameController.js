import CameraController from "./CameraController.js";
import LevelLoader from "../engine/LevelLoader.js";

class GameController {

    static playerBus;
    static restarting = false;
    static finishing = false;
    static stopper;

    static start(stopper) {
        this.stopper = stopper;
        stopper.restart();
        GameController.restarting = false;
        GameController.finishing = false;
    }

    static restart() {
        if (GameController.restarting) {
            return;
        }
        GameController.restarting = true;
        this.#stopGame();
        LevelLoader.restart(3000);
    }

    static finish() {

        document.exitFullscreen();

        document.getElementById("finished").style.display = "flex";

        if(GameController.finishing){
            return;
        }

        this.stopper.stop();
        this.#stopGame();
        const seconds = this.stopper.seconds();
        const record = GameController.record();

        if (!record || seconds < record) {
            localStorage.setItem(LevelLoader.levelString, `${seconds}`);
        }
    }

    static #stopGame() {
        GameController.stopper.stop();
        this.playerBus.update = () => {
        };
        CameraController.zoomOutToShowCollision();
    }

    static record() {
        return parseInt(localStorage.getItem(LevelLoader.levelString));
    }
}

export default GameController
import Bus from "./Bus.js";
import GameController from "./GameController.js";

class StandingBus extends Bus {

    onCollision() {
        this.turnOnLights();
        GameController.restart();
    }
}

export default StandingBus
import Bus from "./Bus.js";
import GameController from "./GameController.js";

class StandingBus extends Bus {

    turnOffIn = 0;

    update(params) {
        this.turnOffIn--;
        if (this.turnOffIn < 0) {
            this.turnOffLights();
        }
    }

    onCollision() {
        this.turnOnLights();
        this.turnOffIn = 2;
        GameController.restart();
    }
}

export default StandingBus
import Bus from "./Bus.js";
import LevelLoader from "../engine/LevelLoader.js";

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

        LevelLoader.restart();

    }
}

export default StandingBus
import Sprite from "../engine/Sprite.js";
import Collider from "../engine/Collider.js";
import Vector from "../engine/Vector.js";
import TrailerParking from "./TrailerParking.js";
import GameController from "./GameController.js";

class BusParking extends Sprite {

    static collider = new Collider([
        new Vector(0, 0),
        new Vector(0, 100),
        new Vector(500, 100),
        new Vector(500, 0),
    ])

    init() {
        this.trigger = true;
        this.addCollider(BusParking.collider.copy());
    }

    onFullyInside(sprite) {
        if (sprite.constructor.name === "PlayerControlledBus" && sprite.isStooped()) {
            if (this.game.getSpritesByType(TrailerParking).filter(parking => !parking.done).length === 0) {
                GameController.finish();
                sprite.turnOnLights();
            }
        }
    }
}

export default BusParking
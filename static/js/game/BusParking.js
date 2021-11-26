import Sprite from "../engine/Sprite.js";
import Collider from "../engine/Collider.js";
import Vector from "../engine/Vector.js";
import PiekoszekEngine from "../engine/PiekoszekEngine.js";

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
        if (sprite.constructor.name === "PlayerControlledBus") {
        }

        if (sprite.constructor.name === "PlayerControlledBus" && sprite.isStooped()) {
            sprite.turnOnLights();
        }
    }
}

export default BusParking
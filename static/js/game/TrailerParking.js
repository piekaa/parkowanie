import Sprite from "../engine/Sprite.js";
import Collider from "../engine/Collider.js";
import Vector from "../engine/Vector.js";

class TrailerParking extends Sprite {

    static collider = new Collider([
        new Vector(0, 0),
        new Vector(0, 100),
        new Vector(500, 100),
        new Vector(500, 0),
    ])

    init() {
        this.addCollider(TrailerParking.collider.copy());
    }

    onFullyInside(sprite) {
        if( sprite.constructor.name === "Trailer") {
            sprite.disconnectIfStopped();
        }
    }
}

export default TrailerParking
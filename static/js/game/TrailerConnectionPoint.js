import Sprite from "../engine/Sprite.js";
import Collider from "../engine/Collider.js";
import Vector from "../engine/Vector.js";

class TrailerConnectionPoint extends Sprite {

    trailer

    init() {
        this.moving = true;
        this.addCollider(
            new Collider([
                new Vector(0, 0),
                new Vector(0, 1),
                new Vector(1, 1),
                new Vector(1, 0),
            ])
        )
    }

    onCollision(collider) {
        if (collider.sprite.constructor.name === "Hook") {
            this.trailer.connected = true;
            this.trailer.connectedTo = collider.sprite;
        }
    }

}

export default TrailerConnectionPoint
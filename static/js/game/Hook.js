import Sprite from "../engine/Sprite.js";
import Collider from "../engine/Collider.js";
import Vector from "../engine/Vector.js";

class Hook extends Sprite {

    static collider = new Collider([
                                      new Vector(0,0),
                                      new Vector(0,1),
                                      new Vector(1,1),
                                      new Vector(1,0),
                                  ]);

    static Add(parent) {
        const hook = parent.addPixelChild({x: -10, y: 39, sx: 20, sy: 8, color: [0.2, 0.2, 0.2, 1]}, Hook);
        hook.moving = true;
        hook.addCollider(this.collider.copy())
    }
}

export default Hook
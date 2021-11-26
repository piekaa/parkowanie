import Sprite from "../engine/Sprite.js";
import TrailerConnectionPoint from "./TrailerConnectionPoint.js";
import Hook from "./Hook.js";
import Collider from "../engine/Collider.js";
import Vector from "../engine/Vector.js";

class Trailer extends Sprite {

    #connectionPoint;
    #pivotPoint;
    connected = false;
    connectedTo;
    done = false;
    speed = 0;

    init() {
        this.#connectionPoint = this.addPixelChild({
            x: 390,
            y: 40,
            sx: 15,
            sy: 15,
            color: [1, 0, 0, 1]
        }, TrailerConnectionPoint)
        this.#connectionPoint.trailer = this;

        const wheelColor = [0.09, 0.09, 0.09, 1];
        this.addPixelChild({x: 90, y: 0, sx: 40, sy: 10, color: wheelColor});
        this.addPixelChild({x: 90, y: 80, sx: 40, sy: 10, color: wheelColor});

        this.setPivot(90, 39);
        this.#pivotPoint = this.addPixelChild({
            x: 90,
            y: 39
        })
        this.#pivotPoint.visible = false;
        this.#connectionPoint.visible = false;

        Hook.Add(this);

        this.moving = true;

        // buda
        this.addCollider(new Collider([
            new Vector(1, 1),
            new Vector(1, 79),
            new Vector(326, 79),
            new Vector(326, 1),
        ]));


        // trojkat
        this.addCollider(new Collider([
            new Vector(326, 80 - 20),
            new Vector(351, 80 - 34),
            new Vector(351, 80 - 44),
            new Vector(326, 80 - 60),
        ]));

        // // palak
        this.addCollider(new Collider([
            new Vector(351, 80 - 34),
            new Vector(378, 80 - 34),
            new Vector(392, 80 - 37),
            new Vector(392, 80 - 41),
            new Vector(387, 80 - 44),
            new Vector(351, 80 - 44),
        ]));

    }

    update() {
        if (this.connected) {
            this.#moveToPoint();
            this.angle = this.#pivotPoint.worldPositionVector().direction(this.connectedTo.worldPositionVector()).toAngleDegrees();
        }
    }

    #moveToPoint() {
        const Dv = this.#pivotPoint.worldPositionVector().direction(this.connectedTo.worldPositionVector());
        const dv = this.#pivotPoint.worldPositionVector().direction(this.#connectionPoint.worldPositionVector());
        const distanceToMove = Dv.length() - dv.length();
        const toMoveV = Dv.normalized().multiply(distanceToMove);
        this.x += toMoveV.x;
        this.y += toMoveV.y;
        this.speed = Math.abs(distanceToMove);
    }

    disconnectIfStopped() {
        if( this.speed < 0.1) {
            this.connected = false;
            this.connectedTo = undefined;
            this.done = true;
        }
    }
}

export default Trailer
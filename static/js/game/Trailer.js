import Sprite from "../engine/Sprite.js";
import TrailerConnectionPoint from "./TrailerConnectionPoint.js";

class Trailer extends Sprite {

    #connectionPoint;
    #pivotPoint;
    connected = false;
    connectedTo;

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
    }

    update() {
        if (this.connected) {
            this.#moveToPoint();
            this.angle = this.#pivotPoint.worldPositionVector().direction(this.connectedTo.worldPositionVector()).toAngleDegrees();
        }
    }

    #moveToPoint () {

        const Dv = this.#pivotPoint.worldPositionVector().direction(this.connectedTo.worldPositionVector());
        const dv = this.#pivotPoint.worldPositionVector().direction(this.#connectionPoint.worldPositionVector());
        const distanceToMove = Dv.length() - dv.length();
        const toMoveV = Dv.normalized().multiply(distanceToMove);
        this.x += toMoveV.x;
        this.y += toMoveV.y;
    }
}

export default Trailer
import Sprite from "../engine/Sprite.js";
import TrailerConnectionPoint from "./TrailerConnectionPoint.js";

class Trailer extends Sprite {

    #connectionPoint;
    connected = false;
    connectedTo;

    init() {
        this.#connectionPoint = this.addPixelChild({
            x: 386,
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
    }

    update() {
        if (this.connected) {
            this.angle = this.worldPositionVector().direction(this.connectedTo.worldPositionVector()).toAngleDegrees();
        }
    }

}

export default Trailer
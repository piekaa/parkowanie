import Sprite from "../engine/Sprite.js";
import TrailerConnectionPoint from "./TrailerConnectionPoint.js";
import Hook from "./Hook.js";
import Collider from "../engine/Collider.js";
import Vector from "../engine/Vector.js";
import Lights from "./Lights.js";
import GameController from "./GameController.js";

class Trailer extends Sprite {

    #connectionPoint;
    #pivotPoint;
    connected = false;
    connectedTo;
    done = false;
    speed = 0;

    #rearLights;

    #turnOffLightsIn = 0;

    #connectionPointCollider;

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
        this.#connectionPointCollider = new Collider([
            new Vector(351, 80 - 34),
            new Vector(378, 80 - 34),
            new Vector(392, 80 - 37),
            new Vector(392, 80 - 41),
            new Vector(387, 80 - 44),
            new Vector(351, 80 - 44),
        ]);
        this.addCollider(this.#connectionPointCollider);

    }

    update() {
        if (this.connected) {
            this.#moveToPoint();
            this.angle = this.#pivotPoint.worldPositionVector().direction(this.connectedTo.worldPositionVector()).toAngleDegrees();
        }

        if (this.#turnOffLightsIn > 0) {
            this.turnOnLights();
            this.#turnOffLightsIn--;
        } else {
            this.turnOffLights();
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
        if (this.speed < 0.005) {
            this.connected = false;
            this.connectedTo = undefined;
            this.done = true;
        }
    }

    addLights(path) {
        this.#rearLights = new Lights(path, this, -40, 15, 70, true);
        this.turnOffLights();
    }

    turnOnLights() {
        this.#rearLights.turnOn();
    }

    turnOffLights() {
        this.#rearLights.turnOff();
    }

    onCollision(otherCollider, myCollider) {
        if (myCollider === this.#connectionPointCollider) {
            if (otherCollider.sprite.constructor.name !== "Hook") {
                this.#turnOffLightsIn = 2;
                GameController.restart();
            }
        } else {
            this.#turnOffLightsIn = 2;
            GameController.restart();
        }
    }

    serialize() {
        let item = super.serialize();
        item.lightsImage = this.#rearLights.imagePath;
        return item;
    }

    deserialize(item) {
        super.deserialize(item);
        this.addLights(item.lightsImage);
    }

}

export default Trailer
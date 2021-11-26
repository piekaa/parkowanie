import Sprite from "../engine/Sprite.js";
import Collider from "../engine/Collider.js";
import Vector from "../engine/Vector.js";
import Lights from "./Lights.js";

class Bus extends Sprite {

    #leftFrontWheel = {};
    #rightFrontWheel = {};

    #leftRearWheel = {};
    #rightRearWheel = {};

    #frontLights;
    #rearLights;

    #lightMaskImagePath = "";

    wheelsAngle = 0;

    static collider = new Collider(
        [
            new Vector(1, 1),
            new Vector(1, 79),
            new Vector(399, 79),
            new Vector(399, 1),
        ]);

    addWheels() {
        const col = [0.09, 0.09, 0.09, 1];

        this.#leftFrontWheel = this.addPixelChild({x: 310, y: 0, color: col});
        this.#leftFrontWheel.addPixelChild({sx: 40, sy: 10, color: col})

        this.#rightFrontWheel = this.addPixelChild({x: 310, y: 80, color: col});
        this.#rightFrontWheel.addPixelChild({sx: 40, sy: 10, color: col})

        this.#leftRearWheel = this.addPixelChild({x: 90, y: 0, color: col});
        this.#leftRearWheel.addPixelChild({sx: 40, sy: 10, color: col})

        this.#rightRearWheel = this.addPixelChild({x: 90, y: 80, color: col});
        this.#rightRearWheel.addPixelChild({sx: 40, sy: 10, color: col})
    }

    addLights(path) {
        this.#lightMaskImagePath = path;
        this.#frontLights = new Lights(path, this, 488, 15, 75);
        this.#rearLights = new Lights(path, this, -40, 15, 75, true);
        this.turnOffLights();
    }

    init() {
        this.renderChildrenFirst = true;
        this.setPivot(90, 39);
        this.visible = false;
        this.game.createShaderProgramPromise("/js/game/shader/busFragment.shader", "/js/engine/shader/vertex.shader")
            .then(shaderProgram => {
                this.shaderProgram = shaderProgram;
                this.visible = true;
            })
        this.addWheels();
        this.setMovingAndAddCollider();
    }

    setMovingAndAddCollider() {
        this.setMoving();
        this.addCollider(Bus.collider.copy());
    }

    setMoving() {
        this.moving = false;
    }

    turnOnLights() {
        this.#frontLights.turnOn();
        this.#rearLights.turnOn();
    }

    turnOffLights() {
        this.#frontLights.turnOff();
        this.#rearLights.turnOff();
    }

    serialize() {
        let item = super.serialize();
        item.lightsImage = this.#frontLights.imagePath;
        return item;
    }

    deserialize(item) {
        super.deserialize(item);
        this.addLights(item.lightsImage);
    }

    turn(angle) {
        this.wheelsAngle += angle;

        this.wheelsAngle = Math.max(this.wheelsAngle, -50);
        this.wheelsAngle = Math.min(this.wheelsAngle, 50);

        this.#leftFrontWheel.angle = this.wheelsAngle;
        this.#rightFrontWheel.angle = this.wheelsAngle;
    }
}

export default Bus
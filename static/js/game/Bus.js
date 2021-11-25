import Sprite from "../engine/Sprite.js";
import Collider from "../engine/Collider.js";
import Vector from "../engine/Vector.js";

class Bus extends Sprite {

    #leftFrontWheel = {};
    #rightFrontWheel = {};

    #leftRearWheel = {};
    #rightRearWheel = {};

    #frontLeftLight = {};
    #frontRightLight = {};

    #rearLeftLight = {};
    #rearRightLight = {};

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
        this.#frontRightLight = super.addChild(path, Sprite, {x: 448, y: 15});
        this.#frontLeftLight = super.addChild(path, Sprite, {x: 448, y: 75});

        this.#frontLeftLight.setColor([0.9, 0.9, 0.5, 1]);
        this.#frontRightLight.setColor([0.9, 0.9, 0.5, 1]);

        this.#rearRightLight = super.addChild(path, Sprite, {x: -40, y: 15, sx: -1});
        this.#rearLeftLight = super.addChild(path, Sprite, {x: -40, y: 70, sx: -1});

        this.#rearRightLight.setColor([0.9, 0.3, 0.3, 1]);
        this.#rearLeftLight.setColor([0.9, 0.3, 0.3, 1]);

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
        this.#frontRightLight.visible = true;
        this.#frontLeftLight.visible = true;
        this.#rearRightLight.visible = true;
        this.#rearLeftLight.visible = true;
    }

    turnOffLights() {
        this.#frontRightLight.visible = false;
        this.#frontLeftLight.visible = false;
        this.#rearRightLight.visible = false;
        this.#rearLeftLight.visible = false;
    }

    serialize() {
        let item = super.serialize();
        item.lightMaskImagePath = this.#lightMaskImagePath;
        return item;
    }

    deserialize(item) {
        super.deserialize(item);
        this.addLights(item.lightMaskImagePath);

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
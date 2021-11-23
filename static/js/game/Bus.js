import Sprite from "../engine/Sprite.js";
import Vector from "../engine/Vector.js";

class Bus extends Sprite {

    #leftFrontWheel;
    #rightFrontWheel;

    #leftRearWheel;
    #rightRearWheel;

    #wheelsAngle = 0;

    #speed = 0;

    #acceleration = 0.05;
    #deceleration = 0.15;

    #speedLimit = 3;

    #rearFollowPoint
    #frontFollowPoint

    #cameraLerp = 0.5;
    #cameraLerpSpeed = 0.07;

    #frontLeftLight = {};
    #frontRightLight = {};

    #rearLeftLight = {};
    #rearRightLight = {};

    #wheelImagePath;
    #whiteImagePath;
    #lightMaskImagePath;

    #whiteTexture;

    loadWhite(whiteImagePath) {
        this.#whiteImagePath = whiteImagePath;
        this.loadTexture(whiteImagePath, (texture) => {
            this.#whiteTexture = texture;
            this.ready = true;
        });
    }

    addWheels(path) {

        this.#wheelImagePath = path;

        this.#leftFrontWheel = super.addChild(path, Sprite, {x: 310, y: 0});
        this.#rightFrontWheel = super.addChild(path, Sprite, {x: 310, y: 80});

        this.#leftRearWheel = super.addChild(path, Sprite, {x: 90, y: 0});
        this.#rightRearWheel = super.addChild(path, Sprite, {x: 90, y: 80});

        this.#rearFollowPoint = super.addChild(path, Sprite, {x: 40, y: 39});
        this.#frontFollowPoint = super.addChild(path, Sprite, {x: 340, y: 39});

        this.#rearFollowPoint.visible = false;
        this.#frontFollowPoint.visible = false;

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
        this.ready = false;
        this.renderChildrenFirst = true;
        this.setPivot(90, 39);
        this.visible = false;
        this.game.createShaderProgramPromise("/js/game/shader/busFragment.shader", "/js/engine/shader/vertex.shader")
            .then(shaderProgram => {
                this.shaderProgram = shaderProgram;
                this.visible = true;
            })
    }

    turnLeft() {
        this.#turn(1);
    }

    turnRight() {
        this.#turn(-1);
    }

    #turn(angle) {
        this.#wheelsAngle += angle;

        this.#wheelsAngle = Math.max(this.#wheelsAngle, -50);
        this.#wheelsAngle = Math.min(this.#wheelsAngle, 50);

        this.#leftFrontWheel.angle = this.#wheelsAngle;
        this.#rightFrontWheel.angle = this.#wheelsAngle;
    }

    update(params) {
        if (params.keyDown("a")) {
            this.turnLeft();
        }
        if (params.keyDown("d")) {
            this.turnRight();
        }
        if (params.keyDown("w")) {
            this.#speed += this.#acceleration;
            this.#limitSpeed();
        }
        if (params.keyDown("s")) {
            this.#speed -= this.#acceleration;
            this.#limitSpeed();
        }
        if (params.keyDown(" ")) {
            if (Math.abs(this.#speed) < this.#deceleration) {
                this.#speed = 0;
                return
            }
            this.#speed -= this.#deceleration * Math.sign(this.#speed);
        }


        this.#updateCameraLerp();
        this.#updatePosition();

    }

    #updateCameraLerp() {
        this.#cameraLerp += this.#cameraLerpSpeed * Math.sign(this.#speed);
        this.#cameraLerp = Math.max(this.#cameraLerp, 0);
        this.#cameraLerp = Math.min(this.#cameraLerp, 1);
    }

    followVector() {
        return this.#rearFollowPoint.followVector()
            .lerpClamp(this.#frontFollowPoint.followVector(), this.#cameraLerp);
    }

    #limitSpeed() {
        if (this.#speed > this.#speedLimit) {
            this.#speed = this.#speedLimit;
        }
        if (this.#speed < -this.#speedLimit) {
            this.#speed = -this.#speedLimit;
        }
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

    #updatePosition() {
        const newPosition = this.forward().multiply(this.#speed).add(new Vector(this.x, this.y))
        this.x = newPosition.x;
        this.y = newPosition.y;
        this.angle += this.#wheelsAngle * this.#speed / 50;
    }

    renderStep(gl) {
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.#whiteTexture);
        gl.uniform1i(gl.getUniformLocation(this.shaderProgram, "whiteTexture"), 1);
    }

    serialize() {
        let item = super.serialize();
        item.wheelImagePath = this.#wheelImagePath;
        item.lightMaskImagePath = this.#lightMaskImagePath;
        item.wheelImagePath = this.#wheelImagePath;
        return item;
    }

    deserialize(item) {
        super.deserialize(item);
        this.loadWhite(item.wheelImagePath);
        this.addWheels(item.wheelImagePath);
        this.addLights(item.lightMaskImagePath);

    }
}

export default Bus
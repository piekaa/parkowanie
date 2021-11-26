import Vector from "../engine/Vector.js";
import Bus from "./Bus.js";
import Hook from "./Hook.js";

class PlayerControlledBus extends Bus {

    #cameraLerp = 0.5;
    #cameraLerpSpeed = 0.07;

    #acceleration = 0.05;
    #deceleration = 0.15;

    #speedLimit = 3;
    #speed = 0;

    #rearFollowPoint
    #frontFollowPoint

    init() {
        super.init();
        this.#rearFollowPoint = super.addPixelChild({x: 40, y: 39});
        this.#frontFollowPoint = super.addPixelChild({x: 340, y: 39});

        this.#rearFollowPoint.visible = false;
        this.#frontFollowPoint.visible = false;

        Hook.Add(this);
    }

    setMoving() {
        this.moving = true;
    }

    update(params) {
        if (params.keyDown("a")) {
            this.#turnLeft();
        }
        if (params.keyDown("d")) {
            this.#turnRight();
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

    #limitSpeed() {
        if (this.#speed > this.#speedLimit) {
            this.#speed = this.#speedLimit;
        }
        if (this.#speed < -this.#speedLimit) {
            this.#speed = -this.#speedLimit;
        }
    }

    #updateCameraLerp() {
        this.#cameraLerp += this.#cameraLerpSpeed * Math.sign(this.#speed);
        this.#cameraLerp = Math.max(this.#cameraLerp, 0);
        this.#cameraLerp = Math.min(this.#cameraLerp, 1);
    }

    followVector() {
        if(!this.#rearFollowPoint || !this.#frontFollowPoint) {
            return this.worldPositionVector();
        }

        return this.#rearFollowPoint.followVector()
            .lerpClamp(this.#frontFollowPoint.followVector(), this.#cameraLerp);
    }

    #updatePosition() {
        const newPosition = this.forward().multiply(this.#speed).add(new Vector(this.x, this.y))
        this.x = newPosition.x;
        this.y = newPosition.y;
        this.angle += this.wheelsAngle * this.#speed / 50;
    }

    #turnLeft() {
        this.turn(1);
    }

    #turnRight() {
        this.turn(-1);
    }


}

export default PlayerControlledBus
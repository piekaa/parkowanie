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
    #deceleration = 0.3;

    #speedLimit = 3;

    addWheels(path) {
        this.#leftFrontWheel = super.addChild(path);
        this.#leftFrontWheel.x = 310;
        this.#leftFrontWheel.y = 0;
        this.#rightFrontWheel = super.addChild(path);
        this.#rightFrontWheel.x = 310;
        this.#rightFrontWheel.y = 80;


        this.#leftRearWheel = super.addChild(path);
        this.#leftRearWheel.x = 90;
        this.#leftRearWheel.y = 0;
        this.#rightRearWheel = super.addChild(path);
        this.#rightRearWheel.x = 90;
        this.#rightRearWheel.y = 80;

    }

    init() {
        this.renderChildrenFirst = true;
        // this.setPivot(39, 90)
        this.setPivot(90, 39)
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

        this.#updatePosition();

    }

    #limitSpeed() {
        if(this.#speed > this.#speedLimit) {
            this.#speed = this.#speedLimit;
        }
        if( this.#speed < -this.#speedLimit) {
            this.#speed = -this.#speedLimit;
        }
    }

    #updatePosition() {
        const newPosition = this.forward().multiply(this.#speed).add(new Vector(this.x, this.y))
        this.x = newPosition.x;
        this.y = newPosition.y;

        this.angle += this.#wheelsAngle * this.#speed / 60;
    }


}

export default Bus
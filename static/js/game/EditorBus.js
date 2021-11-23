import Bus from "./Bus.js";

class EditorBus extends Bus {

    #moveTime = 0;
    #rotateTime = 0;

    #colors = [
        [0.4, 0.1, 0.11, 1],
        [0.1, 0.4, 0.1, 1],
        [0.08, 0.25, 0.3, 1],
        [0.36, 0.18, 0.01, 1],
        [0.36, 0.01, 0.01, 1],
        [0.06, 0.01, 0.50, 1]
    ];

    init() {
        super.init();
        this.setColor(this.#colors[Math.floor(Math.random()*this.#colors.length)]);
    }

    update(params) {

        if (this.#moveTime > 0) {
            const mouse = params.mouse();
            this.x = mouse.wx;
            this.y = mouse.wy;

            if (mouse.pressed) {
                this.#moveTime++;
            }
        }

        if (this.#rotateTime > 0) {
            const mouse = params.mouse();
            if (mouse.pressed) {
                this.#rotateTime++;
            }
            this.angle = this.worldPositionVector().direction(params.mouse().worldVector).toAngleDegrees();
        }

        this.#moveTime--;
        this.#rotateTime--;
    }

    onMousePress(mouse) {
        if (mouse.leftButton) {
            this.#moveTime = 3;
            window.lastPressedSprite = this;
        }
        if (mouse.rightButton) {
            this.#rotateTime = 3;

        }
    }
}

export default EditorBus
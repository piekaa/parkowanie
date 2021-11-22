import Bus from "./Bus.js";

class EditorBus extends Bus {

    #pressedTime = 0;

    update(params) {

        if (this.#pressedTime > 0) {
            const mouse = params.mouse();
            this.x = mouse.wx;
            this.y = mouse.wy;
        }

    }

    onMousePress(mouse) {
        this.#pressedTime = 3;
    }
}

export default EditorBus
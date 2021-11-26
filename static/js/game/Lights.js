import Sprite from "../engine/Sprite.js";

class Lights {

    #left;
    #right

    imagePath;

    constructor(path, sprite, x, y1, y2, stopLights = false) {
        this.imagePath = path;

        if (stopLights) {
            this.#right = sprite.addChild(path, Sprite, {x: x, y: y1, sx: -1});
            this.#left = sprite.addChild(path, Sprite, {x: x, y: y2, sx: -1});
            this.#left.setColor([0.9, 0.3, 0.3, 1]);
            this.#right.setColor([0.9, 0.3, 0.3, 1]);
        } else {
            this.#right = sprite.addChild(path, Sprite, {x: x, y: y1});
            this.#left = sprite.addChild(path, Sprite, {x: x, y: y2});
            this.#left.setColor([0.9, 0.9, 0.5, 1]);
            this.#right.setColor([0.9, 0.9, 0.5, 1]);
        }
    }

    turnOn() {
        this.#right.visible = true;
        this.#left.visible = true;
    }

    turnOff() {
        this.#right.visible = false;
        this.#left.visible = false;
    }
}

export default Lights
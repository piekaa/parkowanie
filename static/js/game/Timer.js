import Sprite from "../engine/Sprite.js";
import Number from "./Number.js";

class Timer extends Sprite {

    #second1;
    #second2;

    #minute1;
    #minute2;

    #dot1;
    #dot2;

    setColor(color) {
        if (!this.isReady()) {
            return;
        }
        this.#second1.setColor(color);
        this.#second2.setColor(color);
        this.#minute1.setColor(color);
        this.#minute2.setColor(color);
        this.#dot1.setColor(color);
        this.#dot2.setColor(color);
    }

    init() {
        this.visible = false;

        this.#second1 = this.addPixelChild({x: 0}, Number)
        this.#second2 = this.addPixelChild({x: 40}, Number)

        this.#dot1 = this.addPixelChild({x: -15, y: 15, sx: 4, sy: 4, color: [0, 0, 0, 1]}).isUi = true;
        this.#dot2 = this.addPixelChild({x: -15, y: 30, sx: 4, sy: 4, color: [0, 0, 0, 1]}).isUi = true;

        this.#minute1 = this.addPixelChild({x: -100}, Number)
        this.#minute2 = this.addPixelChild({x: -60}, Number)
    }

    setTime(date) {
        const s1 = Math.floor(date.getSeconds() / 10) % 10;
        const s2 = date.getSeconds() % 10;

        const m1 = Math.floor(date.getMinutes() / 10) % 10;
        const m2 = date.getMinutes() % 10;

        this.#minute1.setNumber(m1);
        this.#minute2.setNumber(m2);
        this.#second1.setNumber(s1);
        this.#second2.setNumber(s2);
    }
}

export default Timer
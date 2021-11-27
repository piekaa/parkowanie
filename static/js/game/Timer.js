import Sprite from "../engine/Sprite.js";
import Number from "./Number.js";

class Timer extends Sprite {

    #second1;
    #second2;

    #minute1;
    #minute2;

    #startTimeMillis;

    static New(game) {
        return game.createPixelSprite({}, Timer);
    }

    restart() {
        this.#startTimeMillis = new Date().getTime();
    }

    init() {
        this.visible = false;

        this.#second1 = this.addPixelChild({x: 0}, Number)
        this.#second2 = this.addPixelChild({x: 40}, Number)

        this.addPixelChild({x: -15, y: 15, sx: 4, sy: 4, color: [0, 0, 0, 1]}).isUi = true;
        this.addPixelChild({x: -15, y: 30, sx: 4, sy: 4, color: [0, 0, 0, 1]}).isUi = true;

        this.#minute1 = this.addPixelChild({x: -100}, Number)
        this.#minute2 = this.addPixelChild({x: -60}, Number)
    }

    update(params) {

        this.x = params.screenRect.width / 2;
        this.y = params.screenRect.height - 100;

        const date = new Date(new Date().getTime() - this.#startTimeMillis);

        this.#second1.setNumber(Math.floor(date.getSeconds() / 10) % 10);
        this.#second2.setNumber(date.getSeconds() % 10);

        this.#minute1.setNumber(Math.floor(date.getMinutes() / 10) % 10);
        this.#minute2.setNumber(date.getMinutes() % 10);
    }

}

export default Timer
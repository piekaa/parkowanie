import Timer from "./Timer.js";

class TimeDisplay extends Timer {


    #time = 0;
    #date = new Date(0);

    static New(game) {
        return game.createPixelSprite({}, TimeDisplay);
    }

    init() {
        super.init();
        this.sx = 0.5;
        this.sy = 0.5;
        this.setTime(this.#time);
    }

    setTime(seconds) {
        this.#time = seconds;
        this.#date = new Date(this.#time);
    }

    update(params) {
        this.x = params.screenRect.width / 2 + 150;
        this.y = params.screenRect.height - 45;
        super.setTime(this.#date);
    }
}

export default TimeDisplay
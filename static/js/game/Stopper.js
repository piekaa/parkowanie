import Timer from "./Timer.js";

class Stopper extends Timer {

    #startTimeMillis;
    #stopped = false;

    static New(game) {
        return game.createPixelSprite({}, Stopper);
    }

    init() {
        super.init();
        this.sx = 0.6;
        this.sy = 0.6;
    }

    restart() {
        this.#startTimeMillis = new Date().getTime();
        this.#stopped = false;
    }

    stop() {
        this.#stopped = true;
    }

    seconds() {
        return new Date(new Date().getTime() - this.#startTimeMillis).getTime();
    }

    update(params) {
        this.x = params.screenRect.width / 2;
        this.y = params.screenRect.height - 50;
        if(!this.#stopped) {
            const date = new Date(new Date().getTime() - this.#startTimeMillis);
            this.setTime(date);
        }

    }

}

export default Stopper
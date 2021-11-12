class PiekoszekEngine {

    #context

    constructor(canvas) {
        this.#context = canvas.getContext("webgl");
        this.#context.clearColor(1,0,0,1);
        this.#context.clear(this.#context.COLOR_BUFFER_BIT);
    }

}

export default PiekoszekEngine
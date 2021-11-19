import Sprite from "./Sprite.js";

class PiekoszekEngine {

    #canvas

    #gl

    #vertexShader
    #fragmentShader

    #shaderProgram

    #sprites = []

    constructor(canvas) {
        this.#canvas = canvas;

        this.#canvas.width = 1000;
        this.#canvas.height = 1000;

        this.#gl = canvas.getContext("webgl");
        this.#gl.clearColor(1, 0, 0, 1);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);

        this.#gl.enable(this.#gl.BLEND);
        this.#gl.blendFunc(this.#gl.SRC_ALPHA, this.#gl.ONE_MINUS_SRC_ALPHA);

        fetch("/js/engine/shader/fragment.shader")
            .then(res => res.text())
            .then(text => this.#fragmentShader = this.#loadShader(this.#gl.FRAGMENT_SHADER, text))
            .then(() => fetch("/js/engine/shader/vertex.shader"))
            .then(res => res.text())
            .then(text => this.#vertexShader = this.#loadShader(this.#gl.VERTEX_SHADER, text))
            .then(() => this.#initShaderProgram())
            .then(() => setInterval(this.#update.bind(this), 30));
    }

    #initShaderProgram() {
        this.#shaderProgram = this.#gl.createProgram();
        this.#gl.attachShader(this.#shaderProgram, this.#vertexShader);
        this.#gl.attachShader(this.#shaderProgram, this.#fragmentShader);
        this.#gl.linkProgram(this.#shaderProgram);

        if (!this.#gl.getProgramParameter(this.#shaderProgram, this.#gl.LINK_STATUS)) {
            console.log(+this.#gl.getProgramInfoLog(this.#shaderProgram));
        }
    }

    #loadShader(type, source) {
        const shader = this.#gl.createShader(type);
        this.#gl.shaderSource(shader, source);
        this.#gl.compileShader(shader);

        if (!this.#gl.getShaderParameter(shader, this.#gl.COMPILE_STATUS)) {
            console.log(this.#gl.getShaderInfoLog(shader));
        }
        return shader;
    }

    createSprite(imagePath, Type = Sprite) {
        const sprite = new Type(imagePath, this.#gl);
        this.#sprites.push(sprite);
        return sprite;
    }


    #update() {
        this.#gl.clearColor(0, 0, 0, 1);
        // this.#gl.colorMask(true, true, true, true);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
        this.#sprites.forEach(sprite => sprite.update());
        this.#sprites.forEach(sprite => sprite.render(this.#shaderProgram, this.#canvas.getBoundingClientRect()));
    }

}

export default PiekoszekEngine
import Sprite from "./sprite.js";

class PiekoszekEngine {

    #canvas

    #gl

    #vertexShader
    #fragmentShader

    #shaderProgram

    #sprite

    constructor(canvas) {
        this.#canvas = canvas;

        this.#canvas.width = 1000;
        this.#canvas.height = 1000;

        this.#gl = canvas.getContext("webgl");
        this.#gl.clearColor(1, 0, 0, 1);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);

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

    createSprite(imagePath) {
         this.#sprite = new Sprite(imagePath, this.#gl);
    }


    #update() {

        this.#gl.clearColor(0, 0, 0, 1);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
        this.#sprite.render(this.#shaderProgram, this.#canvas.getBoundingClientRect());


    }

}

export default PiekoszekEngine
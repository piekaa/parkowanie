import Sprite from "./Sprite.js";
import Matrix2D from "./Matrix.js";
import Camera from "./Camera.js";

class PiekoszekEngine {

    #canvas

    #gl

    #vertexShader
    #fragmentShader

    #shaderProgram

    #sprites = []

    camera

    behaviours = []

    #updateParams

    constructor(canvas) {
        this.#canvas = canvas;

        this.#updateParams = new UpdateParams();

        this.camera = new Camera();

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

    addBehaviour(behaviour) {
        this.behaviours .push(behaviour);
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

        this.behaviours.forEach(behaviour => behaviour(this.#updateParams));

        this.#sprites.forEach(sprite => sprite.update(this.#updateParams));
        this.#sprites.forEach(sprite => sprite.updateChildren(this.#updateParams));

        const rect = this.#canvas.getBoundingClientRect();
        const screenAndCamera = Matrix2D.Scale(2/rect.width, 2/rect.height).multiply(Matrix2D.Translation(-rect.width/2, -rect.height/2)).multiply(this.camera.matrix(rect));

        this.#sprites.forEach(sprite => sprite.render(this.#shaderProgram, screenAndCamera.float32array()));
    }

}

class UpdateParams {

    #keys = [];

    constructor() {
        window.addEventListener("keydown", (event) => {
            this.#keys[event.key] = true;
        }, true);

        window.addEventListener("keyup", (event) => {
            this.#keys[event.key] = false;
        }, true);
    }

    keyDown(keyCode) {
        const keyState = this.#keys[keyCode];
        if(keyState === undefined) {
            return false;
        }
        return keyState
    }

}

export default PiekoszekEngine
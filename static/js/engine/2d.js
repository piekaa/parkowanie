import Sprite from "./Sprite.js";
import Matrix2D from "./Matrix.js";
import Camera from "./Camera.js";
import Vector from "./Vector.js";

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

        this.camera = new Camera();

        this.#updateParams = new UpdateParams(canvas, this.camera);

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

    newSprite(imagePath, Type = Sprite, transformation) {
        const sprite = new Type(imagePath, this.#gl, this);

        transformation.sx = transformation.sx || 1;
        transformation.sy = transformation.sy || 1;

        sprite.x = transformation.x;
        sprite.y = transformation.y;
        sprite.sx = transformation.sx;
        sprite.sy = transformation.sy;
        return sprite;
    }

    createSprite(imagePath, Type = Sprite, transformation = {x : 0, y: 0, sx: 1, sy: 1}) {
        const sprite = this.newSprite(imagePath, Type, transformation);
        this.#sprites.push(sprite);
        return sprite;
    }


    #update() {
        this.#gl.clearColor(0.4, 0.4, 0.4, 1);
        // this.#gl.colorMask(true, true, true, true);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);

        const rect = this.#canvas.getBoundingClientRect();
        this.#updateParams.screenRect = rect;

        this.behaviours.forEach(behaviour => behaviour(this.#updateParams));

        this.#sprites.forEach(sprite => sprite.update(this.#updateParams));
        this.#sprites.forEach(sprite => sprite.updateChildren(this.#updateParams));

        this.camera.update(this.#updateParams);

        this.#updateParams.update();

        const screenAndCamera = Matrix2D.Scale(2/rect.width, 2/rect.height).multiply(Matrix2D.Translation(-rect.width/2, -rect.height/2)).multiply(this.camera.matrix(rect));

        this.#sprites.forEach(sprite => sprite.render(this.#shaderProgram, screenAndCamera.float32array()));
    }

}

class UpdateParams {

    #keys = [];
    screenRect;

    #camera;

    #mousePressed = false;
    #mouseJustPressed = false;
    #mouseJustReleased = false;

    #mx = 0;
    #my = 0;

    #mwx = 0;
    #mwy = 0;

    constructor(canvas, camera) {
        this.#camera = camera;
        window.addEventListener("keydown", (event) => {
            this.#keys[event.key] = true;
        }, true);

        window.addEventListener("keyup", (event) => {
            this.#keys[event.key] = false;
        }, true);

        canvas.addEventListener("mousedown", (event) => {
            this.#mouseJustPressed = true;
            this.#mousePressed = true;
            this.#mx = event.offsetX;
            this.#my = this.screenRect.height - event.offsetY;

            this.#mwx = (-this.#camera.wx + this.#mx) / this.#camera.sx;
            this.#mwy = (-this.#camera.wy + this.#my) / this.#camera.sy;
        }, false);

        canvas.addEventListener("mouseup", (event) => {
            this.#mousePressed = false;
            this.#mouseJustReleased = true;
        }, false);
    }

    keyDown(keyCode) {
        const keyState = this.#keys[keyCode];
        if(keyState === undefined) {
            return false;
        }
        return keyState;
    }

    mouse() {
        return {
            x: this.#mx,
            y: this.screenRect.height - this.#my,
            wx: this.#mwx,
            wy: this.#mwy,
            mousePressed: this.#mousePressed,
            mouseJustPressed: this.#mouseJustPressed,
            mouseJustReleased: this.#mouseJustReleased,
            mouseWorldVector: new Vector(this.#mwx, this.#mwy)
        }
    }

    update() {
        this.#mouseJustReleased = false;
        this.#mouseJustPressed = false;
    }
}

export default PiekoszekEngine
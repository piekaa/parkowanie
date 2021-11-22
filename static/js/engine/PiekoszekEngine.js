import Sprite from "./Sprite.js";
import Matrix2D from "./Matrix.js";
import Camera from "./Camera.js";
import Vector from "./Vector.js";

class PiekoszekEngine {

    #canvas
    #gl
    #standardShaderProgram
    #sprites = []
    camera
    behaviours = []
    #updateParams

    #movingColliders = [];
    #notMovingColliders = [];

    constructor(canvas, afterInitFunction) {
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

        this.createShaderProgramPromise("/js/engine/shader/fragment.shader", "/js/engine/shader/vertex.shader")
            .then(shaderProgram => {
                this.#standardShaderProgram = shaderProgram;
                setInterval(this.#update.bind(this), 30);
                afterInitFunction();
            });
    }

    createShaderProgramPromise(fragmentShaderPath, vertexShaderPath) {
        let vertexShader;
        let fragmentShader;
        return fetch(fragmentShaderPath)
            .then(res => res.text())
            .then(text => fragmentShader = this.#loadShader(this.#gl.FRAGMENT_SHADER, text))
            .then(() => fetch(vertexShaderPath))
            .then(res => res.text())
            .then(text => vertexShader = this.#loadShader(this.#gl.VERTEX_SHADER, text))
            .then(() => this.#initShaderProgram(fragmentShader, vertexShader))
    }

    #initShaderProgram(fragmentShader, vertexShader) {
        const shaderProgram = this.#gl.createProgram();
        this.#gl.attachShader(shaderProgram, vertexShader);
        this.#gl.attachShader(shaderProgram, fragmentShader);
        this.#gl.linkProgram(shaderProgram);

        if (!this.#gl.getProgramParameter(shaderProgram, this.#gl.LINK_STATUS)) {
            console.log(this.#gl.getProgramInfoLog(shaderProgram));
        }
        return shaderProgram;
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

    addBehaviour(behaviour) {
        this.behaviours.push(behaviour);
    }

    newSprite(imagePath, Type = Sprite, transformation) {
        const sprite = new Type(imagePath, this.#gl, this);
        sprite.shaderProgram = this.#standardShaderProgram;

        transformation.sx = transformation.sx || 1;
        transformation.sy = transformation.sy || 1;
        transformation.x = transformation.x || 0;
        transformation.y = transformation.y || 0;

        sprite.x = transformation.x;
        sprite.y = transformation.y;
        sprite.sx = transformation.sx;
        sprite.sy = transformation.sy;
        return sprite;
    }

    createSprite(imagePath, Type = Sprite, transformation = {x: 0, y: 0, sx: 1, sy: 1}) {
        const sprite = this.newSprite(imagePath, Type, transformation);
        this.#sprites.push(sprite);
        return sprite;
    }

    addMovingCollider(collider) {
        this.#movingColliders.push(collider);
    }

    addNotMovingCollider(collider) {
        this.#notMovingColliders.push(collider);
    }

    #update() {
        const rect = this.#canvas.getBoundingClientRect();
        this.#updateParams.screenRect = rect;
        this.#checkCollisions();
        this.#checkMouseCollisions();
        this.#runUpdates();
        this.#render(rect);
    }

    #checkCollisions() {
        for (let i = 0; i < this.#movingColliders.length; i++) {
            const collider = this.#movingColliders[i];
            for (let j = 0; j < this.#movingColliders.length; j++) {
                if (i === j) {
                    continue;
                }
                const collider2 = this.#movingColliders[j];

                if (collider.collides(collider2)) {
                    collider.sprite.onCollision();
                    collider2.sprite.onCollision();
                }
            }

            for (let j = 0; j < this.#notMovingColliders.length; j++) {
                const collider2 = this.#notMovingColliders[j];

                if (collider.collides(collider2)) {
                    collider.sprite.onCollision();
                    collider2.sprite.onCollision();
                }
            }

        }
    }

    #checkMouseCollisions() {
        const mouse = this.#updateParams.mouse();
        if (mouse.mousePressed) {
            this.#movingColliders.forEach(collider => {
                if (collider.isInside(mouse.mouseWorldVector)) {
                    collider.sprite.onMousePress(mouse);
                }
            });

            this.#notMovingColliders.forEach(collider => {
                if (collider.isInside(mouse.mouseWorldVector)) {
                    collider.sprite.onMousePress(mouse);
                }
            });
        }
    }

    #runUpdates() {
        this.behaviours.forEach(behaviour => behaviour(this.#updateParams));

        this.#sprites.forEach(sprite => sprite.update(this.#updateParams));
        this.#sprites.forEach(sprite => sprite.updateChildren(this.#updateParams));

        this.camera.update(this.#updateParams);

        this.#updateParams.update();
    }

    #render(rect) {
        this.#gl.clearColor(0.4, 0.4, 0.4, 1);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
        const screenAndCamera = Matrix2D.Scale(2 / rect.width, 2 / rect.height).multiply(Matrix2D.Translation(-rect.width / 2, -rect.height / 2)).multiply(this.camera.matrix(rect));
        this.#sprites.forEach(sprite => sprite.render(screenAndCamera.float32array()));
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
            this.#calculateMouse(event);
        }, false);

        canvas.addEventListener("mouseup", (event) => {
            this.#mousePressed = false;
            this.#mouseJustReleased = true;
        }, false);

        canvas.addEventListener("mousemove", (event) => {
            if (this.#mousePressed) {
                this.#calculateMouse(event);
            }
        }, false);
    }

    #calculateMouse(event) {
        this.#mouseJustPressed = true;
        this.#mousePressed = true;
        this.#mx = event.offsetX;
        this.#my = this.screenRect.height - event.offsetY;
        this.#mwx = (this.#camera.wx + this.#mx) / this.#camera.sx;
        this.#mwy = (this.#camera.wy + this.#my) / this.#camera.sy;
    }

    keyDown(keyCode) {
        const keyState = this.#keys[keyCode];
        if (keyState === undefined) {
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
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

        this.#canvas.width = 1920;
        this.#canvas.height = 1080;

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

    getSpriteByType(Type) {
        for (let i = 0; i < this.#sprites.length; i++) {
            const sprite = this.#sprites[i];
            if (sprite.constructor.name === Type.prototype.constructor.name) {
                return sprite;
            }
        }
        return undefined;
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
        return this.#setupSprite(sprite, transformation);
    }

    newPixelSprite(transformation) {
        const sprite = new Sprite("js/engine/common/pixel.png", this.#gl, this);
        return this.#setupSprite(sprite, transformation);
    }

    #setupSprite(sprite, transformation) {
        sprite.shaderProgram = this.#standardShaderProgram;

        transformation.sx = transformation.sx || 1;
        transformation.sy = transformation.sy || 1;
        transformation.x = transformation.x || 0;
        transformation.y = transformation.y || 0;
        transformation.color = transformation.color || [1,1,1,1];


        sprite.x = transformation.x;
        sprite.y = transformation.y;
        sprite.sx = transformation.sx;
        sprite.sy = transformation.sy;
        sprite.setColor(transformation.color)
        return sprite;
    }

    createSprite(imagePath, Type = Sprite, transformation = {x: 0, y: 0, sx: 1, sy: 1, color: [1,1,1,1]}) {
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
        if (mouse.justPressed) {
            for (let i = 0; i < this.#movingColliders.length; i++) {
                const collider = this.#movingColliders[i];
                if (collider.isInside(mouse.worldVector)) {
                    collider.sprite.onMousePress(mouse);
                    return;
                }
            }
            for (let i = 0; i < this.#notMovingColliders.length; i++) {
                const collider = this.#notMovingColliders[i];
                if (collider.isInside(mouse.worldVector)) {
                    collider.sprite.onMousePress(mouse);
                    return;
                }
            }
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

    #justPressedKeys = [];

    screenRect;

    #camera;

    #mousePressed = false;
    #mouseJustPressed = false;
    #mouseJustReleased = false;

    #mouseButton = 0;

    #mx = 0;
    #my = 0;

    #mwx = 0;
    #mwy = 0;

    constructor(canvas, camera) {
        this.#camera = camera;
        window.addEventListener("keydown", (event) => {
            this.#keys[event.key] = true;
            this.#justPressedKeys.push(event.key);
        }, true);

        window.addEventListener("keyup", (event) => {
            this.#keys[event.key] = false;
        }, true);

        canvas.addEventListener("mousedown", (event) => {
            this.#mousePressed = true;
            this.#mouseJustPressed = true;
            this.#mouseButton = event.button;
            this.#calculateMouse(event);
        }, false);

        canvas.addEventListener("mouseup", (event) => {
            this.#mousePressed = false;
            this.#mouseJustReleased = true;
            this.#mouseButton = -1;
        }, false);

        canvas.addEventListener("mousemove", (event) => {
            if (this.#mousePressed) {
                this.#calculateMouse(event);
            }
        }, false);
    }

    #calculateMouse(event) {
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

    keyDownThisFrame(keyCode) {
        return this.#justPressedKeys.includes(keyCode);
    }

    mouse() {
        return {
            x: this.#mx,
            y: this.screenRect.height - this.#my,
            wx: this.#mwx,
            wy: this.#mwy,
            pressed: this.#mousePressed,
            justPressed: this.#mouseJustPressed,
            justReleased: this.#mouseJustReleased,
            worldVector: new Vector(this.#mwx, this.#mwy),
            leftButton: this.#mouseButton === 0,
            rightButton: this.#mouseButton === 2,
        }
    }

    update() {
        this.#mouseJustReleased = false;
        this.#mouseJustPressed = false;
        this.#justPressedKeys = [];
    }
}

export default PiekoszekEngine
import Sprite from "./Sprite.js";
import Matrix2D from "./Matrix.js";
import Camera from "./Camera.js";
import Vector from "./Vector.js";

class PiekoszekEngine {

    #canvas;
    #gl;
    #standardShaderProgram;
    #sprites = [];
    camera;
    behaviours = [];
    #updateParams;

    #movingColliders = [];
    #notMovingColliders = [];
    #triggerColliders = [];

    #movingSprites = [];
    #movingSpritesMap = {};

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

    getSpritesByType(Type) {
        let sprites = [];
        for (let i = 0; i < this.#sprites.length; i++) {
            const sprite = this.#sprites[i];
            if (sprite.constructor.name === Type.prototype.constructor.name) {
                sprites.push(sprite);
            }
        }
        return sprites;
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

    // to be used by Sprite class, use createSprite instead
    newSprite(imagePath, Type = Sprite, transformation) {
        const sprite = new Type(imagePath, this.#gl, this);
        return this.#setupSprite(sprite, transformation);
    }

    // to be used by Sprite class, use createPixelSprite instead
    newPixelSprite(transformation, Type) {
        const sprite = new Type("js/engine/common/pixel.png", this.#gl, this);
        return this.#setupSprite(sprite, transformation);
    }

    #setupSprite(sprite, transformation) {
        sprite.shaderProgram = this.#standardShaderProgram;

        transformation = transformation || {x: 0, y: 0, sx: 1, sy: 1, color: [1, 1, 1, 1]};

        transformation.sx = transformation.sx || 1;
        transformation.sy = transformation.sy || 1;
        transformation.x = transformation.x || 0;
        transformation.y = transformation.y || 0;
        transformation.color = transformation.color || [1, 1, 1, 1];


        sprite.x = transformation.x;
        sprite.y = transformation.y;
        sprite.sx = transformation.sx;
        sprite.sy = transformation.sy;
        sprite.setColor(transformation.color)
        return sprite;
    }

    createPixelSprite(transformation, Type = Sprite) {
        const sprite = this.newPixelSprite(transformation, Type);
        this.#sprites.push(sprite);
        return sprite;
    }

    createSprite(imagePath, Type = Sprite, transformation) {
        const sprite = this.newSprite(imagePath, Type, transformation);
        this.#sprites.push(sprite);
        return sprite;
    }

    addMovingCollider(collider) {
        this.#movingColliders.push(collider);
        if (!this.#movingSpritesMap[collider.sprite.id]) {
            this.#movingSpritesMap[collider.sprite.id] = true;
            this.#movingSprites.push(collider.sprite);
        }
    }

    addNotMovingCollider(collider) {
        this.#notMovingColliders.push(collider);
    }

    addTriggerCollider(collider) {
        this.#triggerColliders.push(collider);
    }

    #update() {
        const rect = this.#canvas.getBoundingClientRect();
        this.#updateParams.screenRect = rect;
        this.#checkMouseCollisions();
        this.#runUpdates();
        this.#render(rect);
        this.#checkCollisions();
        this.#checkFullCollisions();
    }

    #checkCollisions() {
        for (let i = 0; i < this.#movingColliders.length; i++) {
            const collider = this.#movingColliders[i];
            if (!collider.sprite.isReady()) {
                continue;
            }
            for (let j = 0; j < this.#movingColliders.length; j++) {
                if (i === j) {
                    continue;
                }
                const collider2 = this.#movingColliders[j];
                PiekoszekEngine.#invokeOnCollisionIfCollides(collider, collider2);
            }

            for (let j = 0; j < this.#notMovingColliders.length; j++) {
                const collider2 = this.#notMovingColliders[j];
                PiekoszekEngine.#invokeOnCollisionIfCollides(collider, collider2);
            }

        }
    }

    // true if continue
    static #invokeOnCollisionIfCollides(collider, collider2) {
        if (!collider2.sprite.isReady()) {
            return;
        }
        if (collider.sprite.isSameOrParent(collider2.sprite)) {
            return;
        }
        if (collider2.sprite.isSameOrParent(collider.sprite)) {
            return;
        }
        if (collider.collides(collider2)) {
            collider.sprite.onCollision(collider2, collider);
            collider2.sprite.onCollision(collider, collider2);
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
            for (let i = 0; i < this.#triggerColliders.length; i++) {
                const collider = this.#triggerColliders[i];
                if (collider.isInside(mouse.worldVector)) {
                    collider.sprite.onMousePress(mouse);
                    return;
                }
            }
        }
    }

    #checkFullCollisions() {
        for (let i = 0; i < this.#movingSprites.length; i++) {
            const sprite = this.#movingSprites[i];
            for (let j = 0; j < this.#triggerColliders.length; j++) {
                const collider = this.#triggerColliders[j];
                if (collider.allCollidersInside(sprite.colliders)) {
                    collider.sprite.onFullyInside(sprite);
                }
            }
        }
    }

    #runUpdates() {
        this.behaviours.forEach(behaviour => behaviour(this.#updateParams));
        this.#sprites.filter(sprite => sprite.isReady()).forEach(sprite => sprite.update(this.#updateParams));
        this.#sprites.filter(sprite => sprite.isReady()).forEach(sprite => sprite.updateChildren(this.#updateParams));
        this.camera.update(this.#updateParams);
        this.#updateParams.update();
    }

    #render(rect) {
        this.#gl.clearColor(0.5, 0.5, 0.5, 1);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
        const uiMatrix = Matrix2D.Scale(2 / rect.width, 2 / rect.height).multiply(Matrix2D.Translation(-rect.width / 2, -rect.height / 2));
        const screenAndCamera = uiMatrix.multiply(this.camera.matrix(rect));
        this.#sprites.forEach(sprite => sprite.render(screenAndCamera.float32array(), uiMatrix.float32array()));
    }

    static colorEquals(col1, col2) {
        return col1[0] === col2[0] &&
            col1[1] === col2[1] &&
            col1[2] === col2[2] &&
            col1[3] === col2[3];
    }

    forgetAll() {
        this.#sprites = [];
        this.behaviours = [];
        this.#movingColliders = [];
        this.#notMovingColliders = [];
        this.#triggerColliders = [];
        this.#movingSprites = [];
        this.#movingSpritesMap = {};
    }

    forEachSprite(func) {
        this.#sprites.forEach(func);
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
import Matrix2D from "./Matrix.js";
import Vector from "./Vector.js";

class Sprite {

    #img;
    #gl

    #ready = false;

    texture;

    #pivot
    #position
    #rotation
    #scale

    #positionBuffer
    #positionBufferData

    #children = []

    visible = true;

    renderChildrenFirst = false;

    #game

    x = 0;
    y = 0;

    //world x and y
    wx = 0;
    wy = 0;
    // in degrees
    angle = 0;

    sx = 1;
    sy = 1;

    #colliders = [];

    moving = false;

    #colorArray = new Float32Array([1,1,1,1]);

    constructor(imgPath, gl, game) {
        this.#gl = gl;
        this.#game = game;
        this.#img = new Image();
        this.#img.onload = () => {
            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.#img);

            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if (this.#isPowerOf2(this.#img.width) && this.#isPowerOf2(this.#img.height)) {
                // Yes, it's a power of 2. Generate mips.
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // gl.NEAREST is also allowed, instead of gl.LINEAR, as neither mipmap.
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                // Prevents s-coordinate wrapping (repeating).
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                // Prevents t-coordinate wrapping (repeating).
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }

            const pos_and_tex = [
                0, 0, 0, 1,
                0, this.#img.height, 0, 0,
                this.#img.width, 0, 1, 1,
                this.#img.width, this.#img.height, 1, 0,
            ]

            this.#positionBuffer = gl.createBuffer();
            this.#positionBufferData = new Float32Array(pos_and_tex);


            this.setPivot(this.#img.width / 2, this.#img.height / 2);
            this.#ready = true;
            this.init();
        }
        this.#img.src = imgPath;
    }

    setColor(color) {
        this.#colorArray = new Float32Array(color);
    }

    #isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }

    setPivot(x, y) {
        this.#pivot = Matrix2D.Translation(-x, -y);
    }

    addChild(imagePath, Type = Sprite, transformation = {x: 0, y: 0, sx: 1, sy: 1}) {
        const sprite = this.#game.newSprite(imagePath, Type, transformation);
        this.#children.push(sprite);
        return sprite;
    }

    addCollider(collider) {
        this.#colliders.push(collider);
        collider.sprite = this;

        if( this.moving) {
            this.#game.addMovingCollider(collider);
        } else {
            this.#game.addNotMovingCollider(collider);
        }
    }

    followVector() {
        return new Vector(this.wx, this.wy);
    }

    worldPositionVector() {
        return new Vector(this.wx, this.wy);
    }

    update() {

    }

    init() {

    }

    forward() {
        return Vector.FromAngle(this.angle);
    }

    updateChildren() {
        this.#children.forEach(child => child.update());
        this.#children.forEach(child => child.updateChildren());
    }

    onCollision() {

    }

    render(shaderProgram, screenAndCameraArray, parentTransformation = Matrix2D.Identity()) {
        if (!this.#ready) {
            return;
        }

        this.#position = Matrix2D.Translation(this.x, this.y);
        this.#rotation = Matrix2D.RotationDeg(this.angle);
        this.#scale = Matrix2D.Scale(this.sx, this.sy);

        const transformation = parentTransformation
            .multiply(this.#position)
            .multiply(this.#scale)
            .multiply(this.#rotation)
            .multiply(this.#pivot);

        this.wx = transformation.x();
        this.wy = transformation.y();

        this.#colliders.forEach(collider => collider.update(transformation));

        if (this.renderChildrenFirst) {
            this.#children.forEach(child => child.render(shaderProgram, screenAndCameraArray, transformation));
        }

        if (this.visible) {

            const vertexPositionLocation = this.#gl.getAttribLocation(shaderProgram, 'vertexPosition');
            const texcoordLocation = this.#gl.getAttribLocation(shaderProgram, 'vertexTextureCoordinate');

            this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, this.#positionBuffer);
            this.#gl.bufferData(this.#gl.ARRAY_BUFFER, this.#positionBufferData, this.#gl.STATIC_DRAW);


            this.#gl.vertexAttribPointer(
                vertexPositionLocation,
                2,
                this.#gl.FLOAT,
                null,
                16,
                0
            );

            this.#gl.vertexAttribPointer(
                texcoordLocation,
                2,
                this.#gl.FLOAT,
                null,
                16,
                8
            );

            this.#gl.enableVertexAttribArray(vertexPositionLocation);
            this.#gl.enableVertexAttribArray(texcoordLocation);

            this.#gl.useProgram(shaderProgram);

            this.#gl.activeTexture(this.#gl.TEXTURE0);
            this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.texture)
            this.#gl.uniform1i(this.#gl.getUniformLocation(shaderProgram, "sprite"), 0)


            this.#gl.uniformMatrix3fv(
                this.#gl.getUniformLocation(shaderProgram, "transformation"),
                false,
                transformation.float32array());

            this.#gl.uniformMatrix3fv(
                this.#gl.getUniformLocation(shaderProgram, "screenAndCamera"),
                false,
                screenAndCameraArray);

            this.#gl.uniform4fv(
                this.#gl.getUniformLocation(shaderProgram, "color"),
                this.#colorArray
            )


            this.#gl.drawArrays(this.#gl.TRIANGLE_STRIP, 0, 4);

        }

        if (!this.renderChildrenFirst) {
            this.#children.forEach(child => child.render(shaderProgram, screenAndCameraArray, transformation));
        }
    }

}

export default Sprite
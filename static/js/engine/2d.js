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

        fetch("/js/engine/fragment.shader")
            .then(res => res.text())
            .then(text => this.#fragmentShader = this.#loadShader(this.#gl.FRAGMENT_SHADER, text))
            .then(() => fetch("/js/engine/vertex.shader"))
            .then(res => res.text())
            .then(text => this.#vertexShader = this.#loadShader(this.#gl.VERTEX_SHADER, text))
            .then(() => this.#initShaderProgram())
            .then(() => setInterval(this.#update.bind(this), 100));
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

        const pos_and_tex = [
            0, 0, 0, 0,
            0, 400, 0, 1,
            200, 0, 1, 0,
            200, 400, 1, 1
        ]

        const positionBuffer = this.#gl.createBuffer();
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, positionBuffer);
        this.#gl.bufferData(this.#gl.ARRAY_BUFFER, new Float32Array(pos_and_tex), this.#gl.STATIC_DRAW);

        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, positionBuffer);

        const vertexPositionLocation = this.#gl.getAttribLocation(this.#shaderProgram, 'vertexPosition');
        const texcoordLocation = this.#gl.getAttribLocation(this.#shaderProgram, 'vertexTextureCoordinate');

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

        this.#gl.useProgram(this.#shaderProgram);

        const rect = this.#canvas.getBoundingClientRect();

        this.#gl.uniform2fv(
            this.#gl.getUniformLocation(this.#shaderProgram, "screen"),
            new Float32Array([rect.width, rect.height])
        )

        this.#gl.activeTexture(this.#gl.TEXTURE0);
        this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#sprite.texture)
        this.#gl.uniform1i(this.#gl.getUniformLocation(this.#shaderProgram, "sprite"),0)


        this.#gl.drawArrays(this.#gl.TRIANGLE_STRIP, 0, 4);

    }

}

export default PiekoszekEngine
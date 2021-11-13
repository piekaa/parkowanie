class PiekoszekEngine {

    #canvas

    #gl

    #vertexShader
    #fragmentShader

    #shaderProgram

    constructor(canvas) {
        this.#canvas = canvas;
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


    #update() {

        this.#gl.clearColor(1, 0, 0, 1);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);

        const pos = [
            0, 0,
            0, 200,
            100, 0,
            100, 200
        ]

        const positionBuffer = this.#gl.createBuffer();
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, positionBuffer);
        this.#gl.bufferData(this.#gl.ARRAY_BUFFER, new Float32Array(pos), this.#gl.STATIC_DRAW);

        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, positionBuffer);

        const vertexPositionLocation = this.#gl.getAttribLocation(this.#shaderProgram, 'vertexPosition');

        this.#gl.vertexAttribPointer(
            vertexPositionLocation,
            2,
            this.#gl.FLOAT,
            null,
            0,
            0
        );

        this.#gl.enableVertexAttribArray(vertexPositionLocation);

        this.#gl.useProgram(this.#shaderProgram);

        // console.log(this.#canvas.width);
        // console.log(this.#canvas.height);

        const rect = this.#canvas.getBoundingClientRect();

        this.#gl.uniform2fv(
            this.#gl.getUniformLocation(this.#shaderProgram, "screen"),
            new Float32Array([rect.width, rect.height])
        )

        this.#gl.drawArrays(this.#gl.TRIANGLE_STRIP, 0, 4);

    }

}

export default PiekoszekEngine
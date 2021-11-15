class Sprite {

    #img;
    #gl

    #ready = false;

    texture;

    constructor(imgPath, gl) {
        this.#gl = gl;
        this.#img = new Image();
        this.#img.onload = () => {
            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.#img);

            // WebGL1 has different requirements for power of 2 images
            // vs non power of 2 images so check if the image is a
            // power of 2 in both dimensions.
            if( this.#isPowerOf2(this.#img.width) && this.#isPowerOf2(this.#img.height)) {
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
            this.#ready = true;
        }
        this.#img.src = imgPath;
    }

    #isPowerOf2(value) {
        return (value & (value - 1)) === 0;
    }

    render(shaderProgram, rect) {

        if( !this.#ready ) {
            return;
        }

        const pos_and_tex = [
            0, 0, 0, 0,
            0, this.#img.height, 1, 0,
            this.#img.width, 0, 0, 1,
            this.#img.width, this.#img.height, 0, 0
        ]

        const positionBuffer = this.#gl.createBuffer();
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, positionBuffer);
        this.#gl.bufferData(this.#gl.ARRAY_BUFFER, new Float32Array(pos_and_tex), this.#gl.STATIC_DRAW);

        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, positionBuffer);

        const vertexPositionLocation = this.#gl.getAttribLocation(shaderProgram, 'vertexPosition');
        const texcoordLocation = this.#gl.getAttribLocation(shaderProgram, 'vertexTextureCoordinate');

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

        this.#gl.uniform2fv(
            this.#gl.getUniformLocation(shaderProgram, "screen"),
            new Float32Array([rect.width, rect.height])
        )

        this.#gl.activeTexture(this.#gl.TEXTURE0);
        this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.texture)
        this.#gl.uniform1i(this.#gl.getUniformLocation(shaderProgram, "sprite"),0)


        this.#gl.drawArrays(this.#gl.TRIANGLE_STRIP, 0, 4);
    }

}

export default Sprite
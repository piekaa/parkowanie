import Matrix2D from "./Matrix.js";

class Vector {

    x = 0;
    y = 0;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    static FromAngle(degrees) {
        let radian = degrees * 0.0174532925;
        return new Vector(Math.cos(radian), Math.sin(radian)).normalized();
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalized() {
        if (this.x === 0) {
            return new Vector(0, 1);
        }

        const p = this.y / this.x;
        const x = Math.sqrt(1 / (p * p + 1));
        const y = p * x;
        return new Vector(this.#copySign(x, this.x),this.#copySign(y, this.y));
    }

    #copySign(a, b) {
        if (a * b < 0) {
            return a * -1;
        }
        return a;
    }

    multiply(v) {
        return new Vector(this.x * v, this.y * v);
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    toTranslationMatrix() {
        return Matrix2D.Translation(this.x, this.y);
    }

    display() {
        console.log(`x: ${this.x}, y: ${this.y}`);
    }

}

export default Vector
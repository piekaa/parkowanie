import Matrix2D from "./Matrix.js";

class Camera {
    x = 0;
    y = 0;
    sx = 1;
    sy = 1;

    wx = 0;
    wy = 0;

    #toFollow;

    matrix(rect) {
        const matrix =  Matrix2D.Translation(rect.width / 2, rect.height / 2)
            .multiply(Matrix2D.Scale(this.sx, this.sy))
            .multiply(Matrix2D.Translation(-rect.width / 2, -rect.height / 2))
            .multiply(Matrix2D.Translation(-this.x, -this.y));

        this.wx = matrix.x();
        this.wy = matrix.y();

        return matrix;
    }

    follow(sprite) {
        this.#toFollow = sprite;
    }

    update(params) {
        if (this.#toFollow === undefined) {
            return
        }
        const fp = this.#toFollow.followVector();
        this.x = fp.x - params.screenRect.width / 2;
        this.y = fp.y - params.screenRect.height / 2;
    }
}

export default Camera
import Matrix2D from "./Matrix.js";

class Camera {
    x = 0;
    y = 0;
    sx = 1;
    sy = 1;

    matrix(rect) {
        return Matrix2D.Translation(rect.width/2, rect.height/2)
            .multiply(Matrix2D.Scale(this.sx, this.sy))
            .multiply(Matrix2D.Translation(-rect.width/2, -rect.height/2))
            .multiply(Matrix2D.Translation(-this.x, -this.y));
    }
}

export default Camera
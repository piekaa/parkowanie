import Vector from "./Vector.js";

class Collider {

    #points = []
    #worldPoints = [];

    constructor(points) {
        this.#points = points;
        if (!points.length || points.length < 3) {
            throw new Error("Collider must have at least 3 points")
        }
        points.forEach(p => this.#worldPoints.push(p.copy()));
    }


    update(parentTransformation) {
        for (let i = 0; i < this.#points.length; i++) {
            this.#worldPoints[i] = Vector.FromMatrix(
                parentTransformation.multiply(this.#points[i].toTranslationMatrix())
            );
        }
    }

    isInside(point) {
        let pointsAndNormals = [];
        for (let i = 0; i < this.#worldPoints.length - 1; i++) {
            pointsAndNormals.push(this.#createPointAndNormal(this.#worldPoints[i], this.#worldPoints[i + 1]));
        }
        pointsAndNormals.push(this.#createPointAndNormal(this.#worldPoints[this.#worldPoints.length - 1], this.#worldPoints[0]));

        for (let i = 0; i < pointsAndNormals.length; i++) {
            const pointAndNormal = pointsAndNormals[i];
            if (point.direction(pointAndNormal.point).dot(pointAndNormal.normal) <= 0) {
                return false;
            }
        }
        return true;
    }

    #createPointAndNormal(v1, v2) {
        return {
            point: v1,
            normal: v1.normal(v2)
        };
    }

}

export default Collider
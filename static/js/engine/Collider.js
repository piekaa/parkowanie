import Vector from "./Vector.js";

class Collider {

    #points = []
    #worldPoints = [];
    sprite;

    constructor(points) {
        this.#points = points;
        if (!points.length || points.length < 3) {
            throw new Error("Collider must have at least 3 points")
        }
        this.#worldPoints = this.#copyPoints();
    }

    copy() {
        return new Collider(this.#copyPoints());
    }

    #copyPoints() {
        let newPoints = [];
        this.#points.forEach(p => newPoints.push(p.copy()));
        return newPoints;
    }


    update(parentTransformation) {
        for (let i = 0; i < this.#points.length; i++) {
            this.#worldPoints[i] = Vector.FromMatrix(
                parentTransformation.multiply(this.#points[i].toTranslationMatrix())
            );
        }
    }

    collides(collider) {
        for (let i = 0; i < collider.#worldPoints.length; i++) {
            const p = collider.#worldPoints[i];
            if (this.isInside(p)) {
                return true;
            }
        }

        for (let i = 0; i < this.#worldPoints.length; i++) {
            const p = this.#worldPoints[i];
            if (collider.isInside(p)) {
                return true;
            }
        }

        return false;
    }

    allCollidersInside(colliders) {
        for (let i = 0; i < colliders.length; i++) {
            const collider = colliders[i];
            if (!this.colliderInside(collider)) {
                return false;
            }
        }
        return true;
    }

    colliderInside(collider) {
        for (let i = 0; i < collider.#worldPoints.length; i++) {
            const p = collider.#worldPoints[i];
            if (!this.isInside(p)) {
                return false;
            }
        }
        return true;
    }

    isInside(point) {
        let pointsAndNormals = [];
        for (let i = 0; i < this.#worldPoints.length - 1; i++) {
            pointsAndNormals.push(this.#createPointAndNormal(this.#worldPoints[i], this.#worldPoints[i + 1]));
        }
        pointsAndNormals.push(this.#createPointAndNormal(this.#worldPoints[this.#worldPoints.length - 1], this.#worldPoints[0]));

        for (let i = 0; i < pointsAndNormals.length; i++) {
            const pointAndNormal = pointsAndNormals[i];
            if (point.direction(pointAndNormal.point).dot(pointAndNormal.normal) < 0) {
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

    serialize() {
        let points = [];
        this.#points.forEach(point => {
            points.push({x: point.x, y: point.y});
        })
        return points;
    }

    static Deserialize(colliderItem) {
        let points = [];
        colliderItem.points.forEach(point => {
            points.push(new Vector(point.x, point.y));
        })
        return new Collider(points);
    }

}

export default Collider
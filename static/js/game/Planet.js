import Sprite from "../engine/Sprite.js";

class Planet extends Sprite {

    rotationSpeed = 1;
    x = 300;
    y = 300;

    update() {
        this.angle += this.rotationSpeed;
    }


}

export default Planet
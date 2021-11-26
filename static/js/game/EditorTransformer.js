class EditorTransformer {

    static Transform(sprite) {

        sprite.___moveTime = 0;
        sprite.___rotateTime = 0;

        sprite.update = (params) => {
            if (sprite.___moveTime > 0) {
                const mouse = params.mouse();
                sprite.x = mouse.wx;
                sprite.y = mouse.wy;

                if (mouse.pressed) {
                    sprite.___moveTime++;
                }
            }

            if (sprite.___rotateTime > 0) {
                const mouse = params.mouse();
                if (mouse.pressed) {
                    sprite.___rotateTime++;
                }
                sprite.angle = sprite.worldPositionVector().direction(params.mouse().worldVector).toAngleDegrees();
            }

            sprite.___moveTime--;
            sprite.___rotateTime--;
        }

        sprite.onMousePress = (mouse) => {
            window.lastPressedSprite = sprite;
            if (mouse.leftButton) {
                sprite.___moveTime = 3;
            }
            if (mouse.rightButton) {
                sprite.___rotateTime = 3;

            }
        }
        sprite.onCollision = () => {};
    }
}

export default EditorTransformer
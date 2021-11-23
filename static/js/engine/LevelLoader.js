import PiekoszekEngine from "./PiekoszekEngine.js";
import Sprite from "./Sprite.js";

class LevelLoader {
    static Load(canvas, levelString, types, afterInitFunction) {

        let typesMap = {
            "Sprite": Sprite,
        }

        types.forEach(type => {
            typesMap[type.prototype.constructor.name] = type;
        })

        const game = new PiekoszekEngine(canvas, () => {
            const level = JSON.parse(levelString);
            level.items.forEach(item => {
                const sprite = game.createSprite(item.imagePath, typesMap[item.type]);
                sprite.afterInit = () => {
                    sprite.deserialize(item);
                }
            });
            afterInitFunction(game);
        });
        return game;
    }
}

export default LevelLoader
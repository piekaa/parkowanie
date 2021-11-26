import PiekoszekEngine from "./PiekoszekEngine.js";
import Sprite from "./Sprite.js";

class LevelLoader {

    static canvas;
    static levelString;
    static types;
    static afterInitFunction;
    static cleanupFunction;
    static game;

    static Load(canvas, levelString, types, afterInitFunction, cleanupFunction) {
        LevelLoader.canvas = canvas;
        LevelLoader.levelString = levelString;
        LevelLoader.types = types;
        LevelLoader.afterInitFunction = afterInitFunction;
        LevelLoader.cleanupFunction = cleanupFunction;
        LevelLoader.#load();
    }

    static restart() {
        this.game.forgetAll();
        this.#load();
    }

    static #load() {
        let typesMap = {
            "Sprite": Sprite,
        }

        LevelLoader.types.forEach(type => {
            typesMap[type.prototype.constructor.name] = type;
        })

        const game = new PiekoszekEngine(LevelLoader.canvas, () => {
            const level = JSON.parse(LevelLoader.levelString);
            level.items.forEach(item => {
                const sprite = game.createSprite(item.imagePath, typesMap[item.type]);
                sprite.afterInit = () => {
                    sprite.deserialize(item);
                }
            });
            LevelLoader.afterInitFunction(game);
        });
        LevelLoader.game = game;
        return game;
    }

}

export default LevelLoader
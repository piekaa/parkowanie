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
        LevelLoader.#createGame();
    }

    static restart(delayMillis = 3000) {
        setTimeout( () => {
            LevelLoader.game.forgetAll();
            LevelLoader.#addItems();
        }, delayMillis);
    }

    static #createGame() {
        const game = new PiekoszekEngine(LevelLoader.canvas, LevelLoader.#addItems);
        LevelLoader.game = game;
        return game;
    }

    static #addItems() {
        let typesMap = {
            "Sprite": Sprite,
        }
        LevelLoader.types.forEach(type => {
            typesMap[type.prototype.constructor.name] = type;
        })
        const level = JSON.parse(LevelLoader.levelString);
        level.items.forEach(item => {
            const sprite = LevelLoader.game.createSprite(item.imagePath, typesMap[item.type]);
            sprite.afterInit = () => {
                sprite.deserialize(item);
            }
        });
        LevelLoader.afterInitFunction(LevelLoader.game);
    }
}

export default LevelLoader
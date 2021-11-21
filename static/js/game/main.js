import PiekoszekEngine from '/js/engine/2d.js'
import Bus from "./Bus.js";

const game = new PiekoszekEngine(document.getElementById("canvas"));

const bus = game.createSprite("/assets/bus/bus.png", Bus);
bus.x = 200;
bus.y = 300;
bus.sx = 0.5;
bus.sy = 0.5;
bus.addWheels("/assets/bus/wheel.png");
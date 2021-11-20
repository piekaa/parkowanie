import PiekoszekEngine from '/js/engine/2d.js'
import Planet from "./Planet.js";

const game = new PiekoszekEngine(document.getElementById("canvas"));

const zieima = game.createSprite("/assets/ziemia.png", Planet);
zieima.sx = 0.25;
zieima.sy = 0.25;
zieima.x = 400;
zieima.y = 350;

const slonce = zieima.addChild("/assets/slonce.png", Planet)
slonce.x = 600;
slonce.sx = 0.75;
slonce.sy = 0.75;

const mars = zieima.addChild("/assets/mars.png", Planet)
mars.x = 900;
mars.y = -500;
mars.sx = 0.75;
mars.sy = 0.75;
mars.rotationSpeed = 3;

const ksiezyc = mars.addChild("/assets/ksiezyc.png", Planet)
ksiezyc.x = 400;
ksiezyc.y = -200;
ksiezyc.sx = 0.75;
ksiezyc.sy = 0.75;
ksiezyc.rotationSpeed = 1;

game.addBehaviour((params) => {

    if (params.keyDown("ArrowLeft")) {
        game.camera.x -= 3;
    }
    if (params.keyDown("ArrowRight")) {
        game.camera.x += 3;
    }
    if (params.keyDown("ArrowUp")) {
        game.camera.y += 3;
    }
    if (params.keyDown("ArrowDown")) {
        game.camera.y -= 3;
    }

    if (params.keyDown("a")) {
        game.camera.sx += 0.03;
        game.camera.sy += 0.03;
    }

    if (params.keyDown("s")) {
        game.camera.sx -= 0.03;
        game.camera.sy -= 0.03;
    }

});
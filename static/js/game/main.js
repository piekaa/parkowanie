import PiekoszekEngine from '/js/engine/2d.js'
import Planet from "./Planet.js";

const game = new PiekoszekEngine(document.getElementById("canvas"));

const ksiezyc = game.createSprite("/assets/ksiezyc.png", Planet);
const slonce = game.createSprite("/assets/slonce.png", Planet);

slonce.x = 200;
slonce.y = 300;

ksiezyc.x = 400;
ksiezyc.y = 100;

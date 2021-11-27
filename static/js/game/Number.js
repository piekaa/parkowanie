import Sprite from "../engine/Sprite.js";

/*
   _
  |_|
  |_|

   0_
  1|2_3|
  4|5_6|

 */
const f = false;
const t = true;
class Number extends Sprite {

    #lines = [];



    #visibles = [
//       0  1  2  3  4  5  6
        [t, t, f, t, t, t, t], // 0
//       0  1  2  3  4  5  6
        [f, f, f, t, f, f, t], // 1
//       0  1  2  3  4  5  6
        [t, f, t, t, t, t, f], // 2
//       0  1  2  3  4  5  6
        [t, f, t, t, f, t, t], // 3
//       0  1  2  3  4  5  6
        [f, t, t, t, f, f, t], // 4
//       0  1  2  3  4  5  6
        [t, t, t, f, f, t, t], // 5
//       0  1  2  3  4  5  6
        [t, t, t, f, t, t, t], // 6
//       0  1  2  3  4  5  6
        [t, f, f, t, f, f, t], // 7
//       0  1  2  3  4  5  6
        [t, t, t, t, t, t, t], // 8
//       0  1  2  3  4  5  6
        [t, t, t, t, f, t, t], // 9
    ]

    setNumber(number) {
        if(!this.isReady()) {
            return;
        }
        for(let i = 0 ; i < 7 ; i++) {
            this.#lines[i].visible = this.#visibles[number][i];
        }
    }

    init() {
        this.visible = false;
        const color = [0, 0, 0, 1];
        const size = 30;
        const lineWidth = 2;
        this.#lines.push(this.addPixelChild({x: size / 2, y: 2 * size, sx: size, sy: lineWidth, color: color}))
        this.#lines.push(this.addPixelChild({sy: size, sx: lineWidth, y: 1.5 * size, color: color}))
        this.#lines.push(this.addPixelChild({x: size / 2, sx: size, sy: lineWidth, y: size, color: color}))
        this.#lines.push(this.addPixelChild({x: size, y: 1.5 * size, sy: size, sx: lineWidth, color: color}))
        this.#lines.push(this.addPixelChild({sy: size, sx: lineWidth, y: 0.5 * size, color: color}))
        this.#lines.push(this.addPixelChild({x: size / 2, sx: size, sy: lineWidth, color: color}))
        this.#lines.push(this.addPixelChild({x: size, y: 0.5 * size, sy: size, sx: lineWidth, color: color}))
        this.#lines.forEach(line => line.isUi = true);
    }

}

export default Number
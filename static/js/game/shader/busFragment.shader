precision highp float;

uniform sampler2D sprite;
uniform vec4 color;

varying vec2 texcoord;


void main() {

    vec4 col = texture2D(sprite, texcoord);

    if(col.r + col.g + col.b + col.a >= 3.4) {
        gl_FragColor = col * color;
    } else {
        gl_FragColor = col;
    }
}
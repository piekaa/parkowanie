precision highp float;

uniform sampler2D sprite;

varying vec2 texcoord;



void main() {
    gl_FragColor = vec4(texcoord.x, texcoord.y, 0, 1);
    gl_FragColor = texture2D(sprite, texcoord);
}
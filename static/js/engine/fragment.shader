precision highp float;
varying vec2 texcoord;

void main() {
    gl_FragColor = vec4(texcoord.x, texcoord.y, 0, 1);
}
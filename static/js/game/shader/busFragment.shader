precision highp float;

uniform sampler2D sprite;
uniform sampler2D whiteTexture;
uniform vec4 color;

varying vec2 texcoord;


void main() {
    gl_FragColor = texture2D(sprite, texcoord) + texture2D(whiteTexture, texcoord) * color;
}
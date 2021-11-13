attribute vec2 vertexPosition;
attribute vec2 vertexTextureCoordinate;

uniform vec2 screen;

varying vec2 texcoord;

void main() {

    float x = vertexPosition.x * 2.0 / screen.x - 1.0;
    float y = vertexPosition.y * 2.0 / screen.y - 1.0;

    gl_Position = vec4(x + 0.75, y + 0.5, 0, 1);

    texcoord = vertexTextureCoordinate;
}
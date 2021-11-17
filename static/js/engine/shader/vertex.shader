attribute vec2 vertexPosition;
attribute vec2 vertexTextureCoordinate;

uniform vec2 screen;
uniform mat3 transformation;

varying vec2 texcoord;

void main() {

    vec3 vp = vec3(vertexPosition.x, vertexPosition.y, 1);

    vp =  vp * transformation;

    float x = vp.x * 2.0 / screen.x - 1.0;
    float y = vp.y * 2.0 / screen.y - 1.0;

    gl_Position = vec4(x, y, 0, 1);

    texcoord = vertexTextureCoordinate;
}
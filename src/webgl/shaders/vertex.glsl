attribute vec4 a_position;
uniform mat4 u_transform;
uniform vec4 u_color;
varying vec4 v_color;

void main() {
    gl_Position = a_position * u_transform;
    v_color = u_color;
}

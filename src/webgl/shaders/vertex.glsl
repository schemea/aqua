attribute vec4 a_position;
uniform mat4 u_transform;
uniform mat4 u_world;
uniform vec4 u_color;
varying vec4 v_color;

void main() {
    gl_Position = u_world * u_transform * a_position;
    v_color = u_color;
}

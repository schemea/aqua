attribute vec4 a_position;
uniform mat4 u_transform;
uniform vec3 u_ambient;
uniform mat4 u_world;
uniform vec4 u_color;
varying vec4 v_color;
varying vec3 v_light;

void main() {
    //    gl_Position = u_world * u_transform * a_position;
    gl_Position = a_position * u_transform * u_world;
    v_light = u_ambient;
    v_color = u_color;
}

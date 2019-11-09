attribute vec4 a_position;
uniform mat4 u_transform;
uniform mat4 u_world;
uniform vec4 u_color;
varying vec4 v_color;

void main() {
    gl_Position = u_world * u_transform * a_position;
    //    gl_Position =  a_position * u_transform;
    //    gl_Position = u_transform * a_position;
    //    gl_Position =  a_position * u_transform * u_world;
    //    gl_Position.w = gl_Position.z * 0.5 + 1.0;
    v_color = u_color;
}

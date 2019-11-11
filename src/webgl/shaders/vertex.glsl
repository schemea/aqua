attribute vec3 a_normal;
attribute vec4 a_position;
uniform mat4 u_view_projection;
uniform mat4 u_transform;
uniform vec3 u_ambient;
uniform vec4 u_color;
varying vec4 v_color;
varying vec3 v_light;
varying vec3 v_normal;

void main() {
    //    gl_Position = u_world * u_transform * a_position;
    gl_Position = a_position * u_transform * u_view_projection;
    v_light = u_ambient;
    v_color = u_color;
    v_normal = vec3(vec4(a_normal, 0) * u_transform);
}

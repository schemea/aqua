attribute vec3 a_normal;
attribute vec4 a_position;
uniform mat4 u_view_projection;
uniform mat4 u_transform;
uniform mat4 u_world;
uniform vec3 u_ambient;
uniform vec4 u_color;
varying vec4 v_back_color;
varying vec4 v_front_color;

void main() {
    gl_Position = a_position * u_transform * u_world * u_view_projection;

    vec3 normal = vec3(vec4(a_normal, 0) * u_transform * u_world);
    normal = normalize(normal);

    float light = -dot(normal, vec3(0.15, -0.15, -0.75));

    v_front_color = vec4(u_color.rgb * light, u_color.a);
    v_back_color = vec4(u_color.rgb * (-light), u_color.a);
}

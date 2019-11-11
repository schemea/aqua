precision mediump float;
varying vec4 v_color;
varying vec3 v_light;
varying vec3 v_normal;

void main() {
    vec3 normal = normalize(v_normal);
    float light = dot(normal, vec3(0.15, -0.15, -0.75));
    gl_FragColor = vec4(v_color.rgb * light, v_color.a);
}

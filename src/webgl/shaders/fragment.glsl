precision mediump float;
varying vec4 v_color;
varying vec3 v_light;

void main() {
    gl_FragColor = vec4(v_color.rgb * v_light.rgb, v_color.a);
}

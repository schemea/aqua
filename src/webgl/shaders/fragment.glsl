precision mediump float;
varying vec4 v_color;
varying vec3 v_light;
varying vec3 v_normal;
varying vec4 v_back_color;
varying vec4 v_front_color;

void main() {
    if (gl_FrontFacing) {
        gl_FragColor = v_front_color;
    } else {
        gl_FragColor = v_back_color;
    }
    //    vec3 normal = normalize(v_normal);
    //    if (!gl_FrontFacing){
    //        normal = -normal;
    //    }
    //    float light = -dot(normal, vec3(0.15, -0.15, -0.75));
    //    //    float light = 0.5;
    //    gl_FragColor = vec4(v_color.rgb * light, v_color.a);
}

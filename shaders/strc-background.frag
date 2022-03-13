#define GLSLIFY 1
// Common uniforms
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_frame;

uniform vec2 curvature;
uniform vec3 uMaterialColor1;
uniform vec3 uMaterialColor2;
uniform vec3 uMaterialColor3;
uniform float uScale;
uniform float uThreshold;

#define PI 3.1415926538

// Texture uniforms
// uniform sampler2D u_texture;

// Texture varyings
varying vec2 v_uv;

vec3 background_color = vec3(0.030, 0.014, 0.100) ;


vec2 curveRemapPos(vec2 uv)
{
    // as we near the edge of our screen apply greater distortion using a sinusoid.

    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
}

vec3 get_pixel_color(vec2 uv, vec3 uMaterialColor) {

    vec2 mappedPos = curveRemapPos( uv ) ;

    float diffuse = sin(uScale*mappedPos.x) * sin(uScale*mappedPos.y)  ;

    vec3 texColor = uMaterialColor ;

    if ( diffuse > uThreshold ) {
        return uMaterialColor ;
    } else {
        return vec3(0.0,0.0,0.0) ;
    }

}


/*
 * The main program
 */
void main() {
    // Calculate the color offset directions
    float angle = u_time;
    vec2 red_offset = vec2(cos(angle), sin(angle));
    angle += radians(120.0);
    vec2 green_offset = vec2(cos(angle), sin(angle));
    angle += radians(120.0);
    vec2 blue_offset = vec2(cos(angle), sin(angle));

    // Calculate the offset size as a function of the pixel distance to the center
    float offset_size = 0.4 * length(gl_FragCoord.xy - 0.5 * u_resolution);

    // Scale the offset size by the relative mouse position
    offset_size *= u_mouse.x / u_resolution.x;

    // Extract the pixel color values from the input texture


    //vec3 c1 = get_pixel_color( v_uv - offset_size * red_offset / u_resolution, uMaterialColor1) ;
    vec3 c2 = get_pixel_color( v_uv - offset_size * green_offset / u_resolution, uMaterialColor2) ;
    vec3 c3 = get_pixel_color( v_uv - offset_size * blue_offset / u_resolution, uMaterialColor3) ;

    // Fragment shader output
    // float rand = (random2d(v_uv + 1.133001 * vec2(u_time, 1.13)) - 1.2) ;
    gl_FragColor = vec4(c2+c3+background_color, 1.0);
}
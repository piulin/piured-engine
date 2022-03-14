#define GLSLIFY 1
// Texture varyings
varying vec2 v_uv;
varying vec4 vModelPosition;

/*
 * The main program
 */
void main() {
    // Calculate the varyings
    v_uv = uv;
    vModelPosition = modelMatrix * vec4( position, 1.0 );
    // Vertex shader output
    gl_Position =  vec4( position, 1.0 );
}
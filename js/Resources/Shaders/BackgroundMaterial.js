/*
 * # Copyright (C) Pedro G. Bascoy
 # This file is part of piured-engine <https://github.com/piulin/piured-engine>.
 #
 # piured-engine is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # piured-engine is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with piured-engine.If not, see <http://www.gnu.org/licenses/>.
 *
 */
"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


import readFileContent from "../../Utils/FileReader.js";
import * as THREE from '../../../node_modules/three/src/Three.js'

class BackgroundMaterial {


    _material ;


    constructor( resourcePath ) {

        let colorBG1 = new THREE.Color( 0x0F061F ) ;
        let colorBG2 = new THREE.Color( 0x341D00) ;
        let colorBG3 = new THREE.Color( 0x002A38 ) ;
        // let colorBG = new THREE.Color( Math.random()*0.4,Math.random()*0.4,Math.random()*0.4 ) ;

        // uniform vec2 u_resolution;
        // uniform vec2 u_mouse;
        // uniform float u_time;
        // uniform float u_frame;

        // procedural texturing.


        // var uniforms = {
        //     uMaterialColor: { type: "c", value: colorBG },
        //     uKd: {
        //         type: "f",
        //         value: 1.0
        //     },
        //     uScale: {
        //         type: "f",
        //         value: 50.0
        //     },
        //     uThreshold : { type: "f", value: 0.5 },
        //     curvature : { type: "v2", value : new THREE.Vector2(2.0,1)},
        //     screenResolution : { type: "v2", value: new THREE.Vector2(500,500)},
        //     scanLineOpacity: {type: "v2", value : new THREE.Vector2(0.9,1.0) }
        // };

        var uniforms = {
            u_resolution: {
                type: 'v2',
                value: new THREE.Vector2(6000,6000)
            },
            u_mouse: {
                type: 'v2',
                value: new THREE.Vector2(220,220)
            },
            u_time: {
                type: 'f',
                value: 0.0
            },
            u_frame: {
                type: 'f',
                value: 0.0
            },
            uMaterialColor1: { type: "c", value: colorBG1 },
            uMaterialColor2: { type: "c", value: colorBG2 },
            uMaterialColor3: { type: "c", value: colorBG3 },
            uScale: {
                type: "f",
                value: 100.0
            },
            uThreshold : { type: "f", value: 0.5 },
            curvature : { type: "v2", value : new THREE.Vector2(0.9,0.8)},
        }


        let vs = `
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
`
        // await readFileContent(resourcePath + 'shaders/strc-background.vert',function (content) {
        //     vs = content ;
        // }) ;

let fs = `
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
    float offset_size = 0.1 * length(gl_FragCoord.xy - 0.5 * u_resolution);

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
`

        this._material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vs,
            fragmentShader: fs
        });

        this._material.depthWrite = false ;


        // // color picker
        // const colorThief = new ColorThief();
        //
        //
        // const img = new Image();
        // let M = this._material ;
        //
        // // Make sure image is finished loading
        // img.addEventListener('load', function() {
        //     let color = colorThief.getColor(img) ;
        //     console.log(color) ;
        //     M.uniforms.uMaterialColor.value =  new THREE.Color ( color[0]/255.0, color[1]/255.0, color[2]/255.0) ;
        // });
        //
        // img.src = coverPath ;

    }


    get material() {
        return this._material;
    }
}

export {BackgroundMaterial} ;
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
import * as THREE from 'three'

class ReceptorMaterial {


    _material ;

    constructor(map, resourcePath) {


        const uniforms = {
            textureReceptor: {type: "t", value: map},
            activeColorContribution: {type: "f", value: 0.0}
        };


        let vs = `
varying vec2 vUv;

void main() {

    vUv = uv ;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

}
`;

        let fs = `
varying vec2 vUv;
uniform sampler2D textureReceptor;

// Color contribution of the active receptor.
uniform float activeColorContribution ;

void main() {

    // Position of the receptor in the texture
    vec2 receptorUVOffset = vec2( 0, 1.0/2.0 ) ;
    vec2 receptorUVRepeat = vec2( 1, 1.0/2.0 ) ;

    // Position of the activeReceptor in the texture
    // vec2 activeReceptorUVOffset = vec2( 0, 0 ) ;
    vec2 activeReceptorUVRepeat = vec2( 1, 1.0/2.0 ) ;

    // Getting colors
    vec4 receptorColor = texture2D(textureReceptor, vUv*receptorUVRepeat + receptorUVOffset);
    vec4 activeColor = texture2D(textureReceptor, vUv*activeReceptorUVRepeat);


    if ( activeColor.a < 0.9 ) {
        activeColor = vec4( 0, 0, 0 ,0 );
    }

    // Same effect as alphaTest
    if ( receptorColor.a < 0.55 ) {
        discard;
    } else {
        // Naive color mix. Change color contribution
        gl_FragColor = vec4( (receptorColor.rgb + activeColor.rgb*activeColorContribution), receptorColor.a) ;
    }

}
`;


        this._material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vs,
            fragmentShader: fs
        });

    }


    get material() {
        return this._material;
    }
}

export {ReceptorMaterial} ;
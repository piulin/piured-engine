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


import readFileContent from "../../Utils/FileReader";

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

        let vs = '';
        readFileContent(resourcePath + 'shaders/strc-background.vert',function (content) {
            vs = content ;
        }) ;


        let fs = '' ;
        readFileContent(resourcePath + 'shaders/strc-background.frag', function (content) {
            fs = content;
        }) ;

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
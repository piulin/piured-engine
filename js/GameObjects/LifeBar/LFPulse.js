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

import {GameObject} from "../GameObject.js";
import * as THREE from '../../../node_modules/three/src/Three.js'

class LFPulse extends GameObject {

    _mesh ;
    _object ;
    _beatManager ;

    _size ;


    constructor( resourceManager, engine, beatManager, kind ) {
        super(resourceManager, engine);



        this._object = new THREE.Object3D() ;
        this._mesh = this._resourceManager.constructLifeBarPulse() ;
        this._mesh.scale.y = 0.70 ;
        this._object.add(this._mesh) ;

        this._beatManager = beatManager ;
        this.kind = kind ;

        if (kind === 'single') {
            this._size = 0.4;
        } else if (kind ==='double'){
            this._size = 0.8 ;
            this._mesh.scale.x = 2 ;
        }


        this.setsize(1.0) ;

        // this._tweenOpacityEffect = undefined ;

    }

    setsize(size) {

        this._mesh.position.x = -(this._size/2- this._size*(size/2)) ;
        if (this.kind === 'single') {
            this._mesh.scale.x = size ;
        } else {
            this._mesh.scale.x = 2*size ;
        }

    }

    get size(){
        return this._size ;
    }

    ready() {

    }

    animate() {


    }

    set opacity(opacity){
        this._mesh.material.opacity = opacity ;
    }

    update(delta) {


        const bpm = this._beatManager.currentBPM ;
        const currentAudioTime = this._beatManager.currentAudioTimeReal ;
        const beatsPerSecond = bpm / 60 ;
        const secondsPerBeat = 60 / bpm ;


        if ( currentAudioTime < 0 ) {
            this.setsize(1.0) ;
            return ;
        }

        const timeInBeat = Math.abs(  currentAudioTime % secondsPerBeat  ) ;
        const normalizedTimeInBeat = beatsPerSecond * timeInBeat ;
        let level = (1 - normalizedTimeInBeat) ;

        if (level !== 0) {
            let ml = Math.log(level) / Math.log(1.5);
            let size = 1 + ml ;

            if ( ml > -1.0 ) {
                this.setsize(size*size) ;
            } else {
                this.setsize(0) ;
            }
        } else {
            this.setsize(0) ;
        }


    }

    get object () {
        return this._object ;
    }
}

export {LFPulse} ;
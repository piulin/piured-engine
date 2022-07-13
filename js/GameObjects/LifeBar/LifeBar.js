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
import {LFBack} from "./LFBack.js";
import {LFFront} from "./LFFront.js";
import {LFBar} from "./LFBar.js";
import * as THREE from '../../../node_modules/three/src/Three.js'

class LifeBar extends GameObject {


    _back ;
    _bar ;
    _front ;
    _tip ;
    _pulse ;
    _barSize ;

    _beatManager ;
    _animationRate ;
    _object ;

    constructor(resourceManager, engine, beatManager, kind) {
        super(resourceManager, engine);
        this._beatManager = beatManager ;
        this._object = new THREE.Object3D() ;

        this._back = this.setUpBack(kind) ;
        this._bar = this.setUpBar(kind) ;
        this._front = this.setUpFront(kind) ;

        this._barSize = 0.5 ;
        this.setsize(this._barSize);

    }


    get barSize() {
        return this._barSize;
    }

    setsize(size) {

        this._barSize = size ;

        if (size < 0.3) {
            this._back.red();
        } else {
            this._back.normal();
        }

        this._bar.setsize(size) ;

    }



    setUpBack(kind) {
        let back = new LFBack(this._resourceManager,this.engine, kind) ;
        back.object.position.z = 0.01 ;
        back.object.material.opacity = 1.0 ;
        this._object.add(back.object) ;
        return back ;
    }

    setUpFront(kind) {
        let front = new LFFront(this._resourceManager,this.engine, kind) ;
        front.object.position.z = 0.03 ;
        front.object.scale.x = 1.01 ;
        front.object.scale.y = 1.05 ;
        front.object.material.opacity = 1.0 ;
        this._object.add(front.object) ;
        return front ;
    }

    setUpBar(kind) {
        let bar = new LFBar(this._resourceManager,this.engine, this._beatManager, kind) ;
        bar.object.position.z = 0.02 ;
        this._object.add(bar.object) ;
        return bar ;
    }



    ready() {

    }


    update(delta) {

    }

    get object() {
        return this._object;
    }



}

export {LifeBar} ;
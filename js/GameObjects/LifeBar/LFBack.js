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

class LFBack extends GameObject {

    _mesh ;


    constructor( resourceManager, engine, kind ) {
        super(resourceManager, engine);
        let back = null ;

        if (kind === 'single') {
            back = this._resourceManager.constructSLifeBarBack() ;
        } else if (kind === 'double') {
            back = this._resourceManager.constructDLifeBarBack() ;
        }

        back.material.map.repeat.set(1,1/2);
        back.material.map.offset.set(0,1/2);
        this._mesh = back ;

        // this._tweenOpacityEffect = undefined ;

    }

    ready() {

    }

    normal() {
        this._mesh.material.map.offset.set(0,1/2);
    }

    red () {
        this._mesh.material.map.offset.set(0,0);
    }

    animate() {


    }

    update(delta) {


    }

    get object () {
        return this._mesh;
    }
}

export {LFBack} ;
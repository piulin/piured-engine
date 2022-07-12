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

class LFTip extends GameObject {

    _mesh ;
    _show ;

    constructor( resourceManager ) {
        super(resourceManager);

        let tip = this._resourceManager.constructLifeBarTip() ;
        tip.material.map.repeat.set(1,1/2);
        tip.material.map.offset.set(0,1/2);
        this._mesh = tip ;

        // this._tweenOpacityEffect = undefined ;

    }

    ready() {
        this._show = false ;
    }

    animate() {



    }

    blue () {
        this._mesh.material.map.offset.set(0,1/2);
    }

    red () {
        this._mesh.material.map.offset.set(0,0);
    }

    update(delta) {

        if (this._show) {
            this._show = false ;
            this._mesh.material.opacity = 1.0 ;
        } else {
            this._show = true ;
            this._mesh.material.opacity = 0.0 ;
        }

    }

    get object () {
        return this._mesh;
    }
}

export {LFTip} ;
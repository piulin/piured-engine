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

class LFBarFX extends GameObject {

    _mesh ;
    _show ;
    _blink ;

    constructor( resourceManager, engine, kind) {
        super(resourceManager, engine);
        if ( kind === 'single') {
            this._mesh = this._resourceManager.constructSLifeBarBarFX() ;
        } else if ( kind === 'double') {
            this._mesh = this._resourceManager.constructDLifeBarBarFX() ;
        }

        let scale = 2.0;

        this._mesh.material.color.r = scale ;
        this._mesh.material.color.g = scale ;
        this._mesh.material.color.b = scale ;

        this._show = false ;
        this._blink = false ;

    }

    ready() {

    }

    animate() {



    }

    set blink(blink) {
        this._blink = blink ;
    }



    update(delta) {

        if ( this._blink ) {
            if (this._show) {
                this._show = false ;
                this._mesh.material.opacity = 0.0 ;
            } else {
                this._show = true ;
                this._mesh.material.opacity = 1.0 ;

            }
        } else {
            this._mesh.material.opacity = 0.0 ;
        }

    }

    get object () {
        return this._mesh;
    }
}

export {LFBarFX} ;
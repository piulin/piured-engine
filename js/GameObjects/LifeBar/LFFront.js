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

import {GameObject} from "../GameObject";

class LFFront extends GameObject {

    _mesh ;


    constructor( resourceManager, kind ) {

        super(resourceManager);


        if (kind === 'single') {
            this._mesh = this._resourceManager.constructSLifeBarFront() ;
        } else if (kind === 'double') {
            this._mesh = this._resourceManager.constructDLifeBarFront() ;
        }

        // this._tweenOpacityEffect = undefined ;

    }

    ready() {

    }

    animate() {


    }

    update(delta) {


    }

    get object () {
        return this._mesh;
    }
}

export {LFFront} ;
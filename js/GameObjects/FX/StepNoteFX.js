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

class StepNoteFX extends GameObject {


    _tweenOpacityEffect ;
    _mesh ;
    _kind ;

    constructor(resourceManager, kind) {
        super(resourceManager);
        this._resourceManager = resourceManager ;
        this._kind = kind ;
        this._mesh = this._resourceManager.constructStepNoteFX( this._kind ) ;
    }


    animate (  ) {

        const time = 250 ;
        this._mesh.material.opacity = 1.0 ;

        if ( this._tweenOpacityEffect !== null ) {
            TWEEN.remove(this._tweenOpacityEffect) ;
        }

        this._tweenOpacityEffect = new TWEEN.Tween( this._mesh.material ).to( { opacity: 0 }, time ).start();


    }

    get object () {
        return this._mesh;
    }


    ready() {

    }

    update(delta) {

    }
}
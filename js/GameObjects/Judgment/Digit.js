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
import {TWEEN} from "../../../lib/tween.min.js";

class Digit extends GameObject {

    _mesh ;


    constructor(resourceManager) {

        super( resourceManager );

        this._mesh = this._resourceManager.constructDigit( ) ;

        this._mesh.material.map.repeat.set ( 1/4, 1/4 ) ;
        this._mesh.material.map.offset.set ( 0, 3/4 );

        this._mesh.material.opacity = 0.0 ;

        this.opacityFadeTween = null ;
        this.burnTween = null ;

    }

    ready() {


    }


    update(delta) {

    }

    animate() {

        if ( this.opacityFadeTween !== null ) {
            TWEEN.remove(this.opacityFadeTween) ;
            TWEEN.remove(this.burnTween) ;
        }

        const diffuseTimeWait = (30/60)*1000 ;
        const diffuseAnimation = (22/60)*1000;
        const time = (5/60)*1000;
        this._mesh.material.opacity = 1.0;
        let scale = 100.0 ;

        this._mesh.material.color.r = 1.0 ;
        this._mesh.material.color.g = 1.0 ;
        this._mesh.material.color.b = 1.0 ;

        new TWEEN.Tween( this._mesh.material ).to( {opacity: 0.7 } , diffuseTimeWait ).start();

        this._mesh.material.opacity = 0.7 ;
        // we need to do this for each digit.
        this.opacityFadeTween = new TWEEN.Tween(this._mesh.material).to({opacity: 0.0}, diffuseAnimation).delay(diffuseTimeWait).start();
        this.burnTween = new TWEEN.Tween( this._mesh.material.color ).to( { r:scale ,g:scale,b:scale } , 1 ).delay(diffuseTimeWait).start();



    }

    displayDigit(digit) {

        const [row, col] = this.getCoordinatesForDigit(digit) ;
        // console.log(index) ;
        this._mesh.material.map.offset.set(col * (1/4), row * (1/4)) ;
    }

    hide(){
        this._mesh.material.map.offset.set(1,1) ;
    }

    getCoordinatesForDigit(digit) {

        const col = digit % 4 ;
        const row = 3 - Math.floor( digit/4 ) ;

        return [row, col] ;

    }


    get object () {
        return this._mesh;
    }
}

export {Digit} ;
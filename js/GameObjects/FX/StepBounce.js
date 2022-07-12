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

class StepBounce extends GameObject {

    _mesh ;
    _kind ;

    _spritePosition ;
    _stepAnimationRate ;
    _animationDelta ;
    _tweenOpacityEffect ;



    constructor(resourceManager, kind, stepAnimationRate, noteskin) {

        super(resourceManager);
        this._kind = kind ;
        this._stepAnimationRate = stepAnimationRate ;
        this._mesh = this._resourceManager.constructStepBounce( this._kind, noteskin ) ;
        this._tweenOpacityEffect = undefined ;

    }

    ready() {


        this._spritePosition = 0 ;
        this._animationDelta = 0 ;

        this._mesh.material.map.repeat.set(1/3,1/2);

        let scale = 1.0 ;

        this._mesh.material.color.r = scale ;
        this._mesh.material.color.g = scale ;
        this._mesh.material.color.b = scale ;
    }

    animate() {

        // Animate tap
        const time = 380 ;
        const delayOpacity = 250 ;
        this._mesh.material.opacity = 1.0 ;
        this._mesh.scale.set(1,1) ;

        // for early stopping the tween
        if ( this._tweenOpacityEffect !== undefined ) {
            TWEEN.remove( this._tweenOpacityEffect ) ;
        }

        this._tweenOpacityEffect = new TWEEN.Tween( this._mesh.material ).to( { opacity: 0 }, time-delayOpacity ).delay(delayOpacity).start();
        new TWEEN.Tween( this._mesh.scale ).to( { x: 1.3, y: 1.3 }, time ).start();
    }

    update(delta) {



        let timeStamp = this._animationDelta + delta;

        let movement = timeStamp*this._stepAnimationRate ;

        if ( movement > 1 ) {

            this._spritePosition = (this._spritePosition + 1)%6 ;

            const col = this._spritePosition % 3 ;
            // in UV cordinates, the first row is the lowest one.

            const row = Math.floor( this._spritePosition / 3 ) ;

            const XOffset3x2 = col * (1/3) ;

            const YOffset3x2 = row * (1/2) ;




            this._mesh.material.map.offset.set(  XOffset3x2, YOffset3x2 ) ;

            this._animationDelta = 0 ;

        } else {

            this._animationDelta += delta ;

        }

    }


    get object () {
        return this._mesh;
    }
}

export {StepBounce} ;
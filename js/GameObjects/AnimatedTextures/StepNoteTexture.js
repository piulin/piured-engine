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

class StepNoteTexture extends GameObject {


    _map;
    _kind;

    _spritePosition ;
    _stepAnimationRate ;
    _animationDelta ;

    constructor(resourceManager, kind, animationRate, noteskin) {

        super(resourceManager);
        this._kind = kind;
        this._stepAnimationRate = animationRate ;

        this._map = this._resourceManager.getStepNoteTexture( this._kind, noteskin ) ;

    }

    ready() {


        this._spritePosition = 0 ;
        this._animationDelta = 0 ;

        this._map.repeat.set(1/3,1/2);
    }

    // This one is not empty
    update(delta) {

        this.updateTextureAnimation(delta) ;


    }

    updateTextureAnimation(delta) {

        let timeStamp = this._animationDelta + delta;

        let movement = timeStamp*this._stepAnimationRate ;

        if ( movement > 1 ) {

            this._spritePosition = (this._spritePosition + 1)%6 ;

            const col = this._spritePosition % 3 ;
            // in UV cordinates, the first row is the lowest one.

            const row = Math.floor( this._spritePosition / 3 ) ;

            const XOffset3x2 = col * (1/3) ;

            const YOffset3x2 = row * (1/2) ;


            this._map.offset.set(  XOffset3x2, YOffset3x2 ) ;

            this._animationDelta = 0 ;

        } else {

            this._animationDelta += delta ;

        }

    }




}

export {StepNoteTexture} ;